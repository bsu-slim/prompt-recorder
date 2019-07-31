import socket from './socket';

export function cbListRooms(cb) {
  socket.on('listRooms', payload => cb(payload));
}

export function cblistLanguages(cb) {
  socket.on('listLanguages', payload => cb(payload));
}

export function cbDataRoom(cb) {
  socket.on('dataRoom', payload => cb(payload));
}

export function cbDataPrompt(cb) {
  socket.on('dataPrompt', payload => cb(payload));
}

export function cbDataPromptList(cb) {
  socket.on('dataPromptList', payload => cb(payload));
}

export function cbNoRecorder(cb) {
  socket.on('noRecorder', payload => cb(payload));
}

export function cbNewRecorder(cb) {
  socket.on('newRecorder', payload => cb(payload));
}

export function cbMessage(cb) {
  socket.on('m', payload => cb(payload));
}

export function cbNewRoom(cb) {
  socket.on('newRoom', payload => cb(payload));
}

export function cbNewRecording(cb) {
  socket.on('newRecording', payload => cb(payload));
}

export function cbListLanguages(cb) {
  socket.on('listLanguages', payload => cb(payload));
}

export function cbListPrompts (cb) {
  socket.on('listPrompts', payload => cb(payload));
}

export function cbListRoomPrompts (cb) {
  socket.on('listRoomPrompts', payload => cb(payload));
}

export function cbListRecordings (cb) {
  socket.on('listRecordings', payload => cb(payload));
}

export function cbListRoomRecordings (cb) {
  socket.on('listRoomRecordings', payload => cb(payload));
}

export function joinAdmin(payload) {
  socket.emit('joinAdmin', payload);
}

export function getPromptList(payload) {
  socket.emit('getPromptList', payload);
}

export function getRecordingList(payload) {
  socket.emit('getRecordingList', payload);
}

export function getRoomRecordingList(payload) {
  socket.emit('getRoomRecordingList', payload)
}

export function getRoomPrompts(payload) {
  socket.emit('getRoomPrompts', payload);
}