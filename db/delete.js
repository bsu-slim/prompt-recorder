const { log }       = require('./message'); // logging functions
const db            = require('./database'); // init database
const Q             = require('./query'); // sql query string manager
const chalk         = require('chalk');

module.exports = {
    deleteRecording: (socket, payload) => {
        db.serialize(() => {
            let params = [payload.recordingID]
            db.run(Q.deleteRecording, params, (err) => {
                if(err) return log.error(err.message);
                socket.emit('deleteRecording', payload);
                log.success(
                    `Successfully deleted recording with ID '${payload.recordingID}'.`,
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Delete]',
                        color: chalk.magenta
                      }
                    }
                );
            });
        });
    },

    deletePromptList: (socket, payload, io) => {
        db.serialize(() => {
            let promptID = payload.promptID;
            let roomID = payload.roomID;
            let params = [promptID, roomID]
            db.run(Q.deletePromptList, params, (err) => {
                if(err) return log.error(err.message);
                socket.emit('deletePromptList', payload);
                socket.to(payload.room).emit('deletePromptList', payload);
                log.success(
                    `Successfully deleted prompt listing with in room '${roomID}' with prompt '${promptID}'.`,
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Delete]',
                        color: chalk.magenta
                      }
                    }
                );
            });

            let stmt = Q.getRoom;
            let roomKey = payload.roomKey;
            db.get(stmt, [roomKey], (err, row) => {
                if(err) return log.error(err.message);
                io.in(roomKey).emit('dataRoom', row);
            });

        });
    }
}