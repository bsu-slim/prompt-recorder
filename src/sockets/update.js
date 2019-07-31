import socket from './socket';

export function updateRoomActive(payload) {
  socket.emit('updateRoomActive', payload);
}

export function updateRoomShuffle(payload) {
  socket.emit('updateRoomShuffle', payload);
}

export function cbUpdateRecording(cb) {
  socket.on('updateRecording', payload => cb(payload));
}

export function cbReloadRoomRecording(cb) {
  socket.on('reloadRecList', payload => cb(payload));
}