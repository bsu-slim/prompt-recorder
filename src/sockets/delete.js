import socket from './socket';

export function deletePromptList(payload) {
  socket.emit('deletePromptList', payload);
}