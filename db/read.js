const { log } = require('./message'); // logging functions
const db      = require('./database'); // init database
const Q       = require('./query'); // sql query string manager
const chalk   = require('chalk');


module.exports = {
    getPromptList: (socket, payload) => {
        db.serialize(() => {
            let params = [payload.roomID];
            let stmt = Q.getRecentPromptList;
            if (payload.search && payload.search !== '') {
                params.push(`%${payload.search}%`);
                stmt = Q.getPromptList;
            }

            db.all(stmt, params, (err, rows) => {
                if (err) return log.error(err.message);
                socket.emit('listPrompts', rows);
                log.success(
                    `Successfully listed prompts for room '${payload.roomID}'.`,
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Read]',
                        color: chalk.magenta
                      }
                    }
                );
            });
        });
    },

    getRoomPrompts: (socket, payload) => {
      db.serialize(() => {
        let params = [payload.roomID];
        let stmt = Q.getRoomPrompts;
        db.all(stmt, params, (err, rows) => {
          if (err) return log.error(err.message);
          socket.emit('listRoomPrompts', rows);
          log.success(
            `Successfully listed prompts for room '${payload.roomID}'.`,
            {
              broadcast: false,
              room: payload.room,
              sender: socket,
              prefix: {
                text: '[Read]',
                color: chalk.magenta
              }
            }
          );
        });
      });
    },

    getRecordingList: (socket, payload) => {
        db.serialize(() => {
            let params = [payload.roomID, payload.recorderID, payload.promptID]
            db.all(Q.getRecordingList, params, (err, rows) => {
                if (err) log.error(err.message);
                socket.emit('listRecordings', rows);
                log.success(
                    `Successfully listed recordings for for recorder '${payload.recorderID}' in room '${payload.roomID}' for prompt '${payload.promptID}'.`, 
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Read]',
                        color: chalk.magenta
                      }
                    }
                );
            });
        });
    },

    getRoomRecordingList: (socket, payload) => {
        db.serialize(() => {
            let params = [payload.roomID];
            db.all(Q.getRoomRecordingList, params, (err, rows) => {
                if (err) return log.error(err.message);
                socket.emit('listRoomRecordings', rows);
                log.success(
                    `Successfully listed recordings for room '${payload.roomID}'.`,
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Read]',
                        color: chalk.magenta
                      }
                    }
                );
            });
        });
    },

    getRecorder: (socket, payload) => {
        db.serialize(() => {
            let params = [payload.recorderID];
            db.get(Q.getRecorder, params, (err, row) => {
                if (err) return log.error(err.message);
                socket.emit('dataRecorder', row);
                log.success(
                    `Successfully got data for recorder '${payload.recorderID}'.`,
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Read]',
                        color: chalk.magenta
                      }
                    }
                );
            });
        });
    }
};