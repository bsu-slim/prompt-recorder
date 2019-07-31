import socket from '../sockets/socket';

export const SAMPLERATE = 16000;
export const CHANNELS = 1;
export const BUFFERSIZE = 2048;

let constraints = { audio: true, video: false };

let ctx, processor, input, globalStream;
let MediaDevices = [];
let isHTTPs = window.location.protocol === 'https:';
let canEnumerate = false;

export let hasMicrophone = false;
export let hasSpeakers = false;
export let hasWebcam = false;

export let isMicrophoneAlreadyCaptured = false;
export let isWebcamAlreadyCaptured = false;

if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
  // Firefox 38+ seems having support of enumerateDevicesx
  navigator.enumerateDevices = function(callback) {
      navigator.mediaDevices.enumerateDevices().then(callback);
  };
}

if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
  canEnumerate = true;
} else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
  canEnumerate = true;
}

checkDeviceSupport();

export function startRecording(payload) {
  checkDeviceSupport(() => {
    if(window.hasMicrophone) {
      record(payload);
    } else {
      alert('NO MICROPHONE ATTACHED. Please connect a microphone device to record with.');
    }
  })
}

export function stopRecording(payload) {
  if(globalStream) {
    let tracks = globalStream.getTracks();
    if(tracks.length > 0) {
      tracks[0].stop();
    }
    input.disconnect(processor);
    processor.disconnect(ctx.destination);
    ctx.close().then(() => {
      input = null;
      processor = null;
      ctx = new AudioContext();
    });
  } else {
    window.hasMicrophone = false;
    alert("NO MICROPHONE ATTACHED. Please connect a microphone device to record with.")
  }
  socket.emit('stopRecording', payload);
}

function record(payload) {
  socket.emit('startRecording', payload);
  ctx = new AudioContext();
  processor = ctx.createScriptProcessor(BUFFERSIZE, CHANNELS, CHANNELS);
  processor.connect(ctx.destination);
  ctx.resume();

  let handleSuccess = (stream) => {
    globalStream = stream;
    input = ctx.createMediaStreamSource(stream);
    input.connect(processor);
    processor.onaudioprocess = (e) => {
      payload['data'] = e;
      microphoneProcess(payload);
    }
  }

  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess);
}

function microphoneProcess(payload) {
  let chunk = payload.data;
  let l = chunk.inputBuffer.getChannelData(0);
  let lResample = downsampleBuffer(l, ctx.sampleRate, SAMPLERATE);
  payload.data = lResample;
  socket.emit('binaryData', payload);
}

let downsampleBuffer = (buffer, sampleRate, outSampleRate) => {
  if (outSampleRate === sampleRate) {
      return buffer;
  }
  if (outSampleRate > sampleRate) {
      throw new Error("downsampling rate show be smaller than original sample rate");
  }
  var sampleRateRatio = sampleRate / outSampleRate;
  var newLength = Math.round(buffer.length / sampleRateRatio);
  var result = new Int16Array(newLength);
  var offsetResult = 0;
  var offsetBuffer = 0;
  while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0, count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
          accum += buffer[i];
          count++;
      }

      result[offsetResult] = Math.min(1, accum / count)*0x7FFF;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
  }
  return result.buffer;
}

function checkDeviceSupport(callback) {
  if (!canEnumerate) {
    return;
}

if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
    navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
}

if (!navigator.enumerateDevices && navigator.enumerateDevices) {
    navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
}

if (!navigator.enumerateDevices) {
    if (callback) {
        callback();
    }
    return;
}

MediaDevices = [];
  navigator.enumerateDevices(function(devices) {
    devices.forEach(function(_device) {
        var device = {};
        for (var d in _device) {
            device[d] = _device[d];
        }

        if (device.kind === 'audio') {
            device.kind = 'audioinput';
        }

        if (device.kind === 'video') {
            device.kind = 'videoinput';
        }

        var skip;
        MediaDevices.forEach(function(d) {
            if (d.id === device.id && d.kind === device.kind) {
                skip = true;
            }
        });

        if (skip) {
            return;
        }

        if (!device.deviceId) {
            device.deviceId = device.id;
        }

        if (!device.id) {
            device.id = device.deviceId;
        }

        if (!device.label) {
            device.label = 'Please invoke getUserMedia once.';
            if (!isHTTPs) {
                device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
            }
        } else {
            if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
                isWebcamAlreadyCaptured = true;
            }

            if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
                isMicrophoneAlreadyCaptured = true;
            }
        }

        if (device.kind === 'audioinput') {
            hasMicrophone = true;
            window.hasMicrophone = true;
        }

        if (device.kind === 'audiooutput') {
            hasSpeakers = true;
        }

        if (device.kind === 'videoinput') {
            hasWebcam = true;
        }

        // there is no 'videoouput' in the spec.

        MediaDevices.push(device);
    });

    if (callback) {
        callback();
    }
});
}