const { log }       = require('./message'); // logging functions
const db            = require('./database'); // init database
const Q             = require('./query'); // sql query string manager
const chalk         = require('chalk');

module.exports = {
  updateRecording: (socket, payload, io) => {
    db.serialize(() => {
      db.run(
        Q.updateRecording, 
        [payload.filename, payload.recordingID], 
        (err) => {
          
          if(err) return log.error(err.message);
          socket.emit('updateRecording', payload);
          io.in(payload.roomKey).emit('reloadRecList');
          log.success(
            `Successfully updated filename to '${payload.filename}' for recording with ID '${payload.recordingID}'.`,
            {
              broadcast: false,
              room: payload.room,
              sender: socket,
              prefix: {
                text: '[Update]',
                color: chalk.magenta
              }
            }
          );
        }
      );
    });
  },

  updateRoomActive: (socket, payload, io) => {
    db.serialize(() => {
      db.run(
        Q.updateRoomActive,
        [payload.active, payload.roomKey],
        (err) => {

          if(err) return log.error(err.message);
          io.in(payload.roomKey).emit('dataRoom', payload);
          log.success(
            `Successfully updated active for room '${payload.roomKey}' to ${payload.active ? 'true' : 'false'}.`,
            {
              broadcast: false,
              room: payload.room,
              sender: socket,
              prefix: {
                text: '[Update]',
                color: chalk.magenta
              }
            }
          );

        }
      );
    });
  },

  updateRoomLog: (socket, payload, io) => {
    db.serialize(() => {
      db.run(
        Q.updateRoomLog,
        [payload.log, payload.roomKey],
        (err) => {
          if(err) return log.error(err.message);
          io.in(payload.roomKey).emit('dataRoom', payload);
          log.success(
            `Successfully updated logging for room '${payload.roomKey}' to ${payload.log ? 'true' : 'false'}.`,
            {
              broadcast: false,
              room: payload.room,
              sender: socket,
              prefix: {
                text: '[Update]',
                color: chalk.magenta
              }
            }
          );
        }
      )
    });
  },

  updateRoomShuffle: (socket, payload, io) => {
    db.serialize(() => {
      db.run(
        Q.updateRoomShuffle,
        [payload.shuffle, payload.roomKey],
        (err) => {

          if(err) return log.error(err.message);
          io.in(payload.roomKey).emit('dataRoom', payload);
          log.success(
            `Successfully updated shuffle for room '${payload.roomKey}' to ${payload.shuffle ? 'true' : 'false'}.`,
            {
              broadcast: false,
              room: payload.room,
              sender: socket,
              prefix: {
                text: '[Update]',
                color: chalk.magenta
              }
            }
          );

        }
      );

      let stmt = Q.getRoom;
      let roomKey = payload.roomKey;
      db.get(stmt, [roomKey], (err, row) => {
        if(err) return log.error(err.message);
        io.in(roomKey).emit('dataRoom', row);
      });

    });
  }
}