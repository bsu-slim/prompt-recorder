import openSocket from 'socket.io-client';
const config = require('./socket-conf');
const socket = openSocket(config.socketServer);

export function onDisconnect(cb) {
  socket.on('disconnect', payload => cb(payload));
}

export function onReconnect(cb) {
  socket.on('reconnect', payload => cb(payload));
}

export function onReconnectAttempt(cb) {
  socket.on('reconnect_attempt', payload => cb(payload));
}

export default socket;