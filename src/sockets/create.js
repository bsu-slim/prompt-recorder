import socket from './socket';

export function createRecorder(payload) {
  socket.emit('newRecorder', payload);
}

export function createRoom(payload) {
  socket.emit('newRoom', payload);
}

export function duplicateRoom(payload) {
  socket.emit('duplicateRoom', payload);
}

export function createPrompt(payload) {
  socket.emit('newPrompt', payload);
}

export function createPromptList(payload) {
  socket.emit('newPromptList', payload);
}