const { log }   = require('./message'); // logging functions
const db        = require('./database'); // init database
const Q         = require('./query'); // sql query string manager
const chalk     = require('chalk');
const json2csv  = require('./json2csv');
const z         = require('node-zip');
const conf      = require('../server-conf');
const fs        = require('fs');
const path      = require('path');


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

    exportRoomRecordingList: (socket, payload, io) => {
      db.serialize(() => {
        let params = [payload.roomID];
        db.all(Q.exportRoomRecordingList, params, (err, rows) => {
            
            if (err) return log.error(err.message);
            
            let csv = json2csv(rows);
            let now = new Date().toISOString().replace(/-/g,"").replace(/:/g, "-");
            let file = payload.roomKey+'-'+now;
            let zip = new z();
            for(let i = 0; i < rows.length; i++) {
              let filepath = rows[i].filepath;
              let filedata = fs.readFileSync(path.join(conf.dir, filepath));
              zip.file(filepath, filedata);
            }
            zip.file(file+'.csv', csv);
            let exp = zip.generate(conf.export.zipConf);
            fs.writeFileSync(path.join(conf.export.dir, file+'.zip'), exp, 'binary');

            let exportList = 
              fs.readdirSync(conf.export.dir)
                .filter((file) => { 
                  return file.slice(0, payload.roomKey.length) === payload.roomKey
                });
            
            io.in(payload.roomKey).emit('dataExportList', {dir: conf.export.dir.substring(8), list: exportList});
            log.success(
                `Successfully listed exports for room '${payload.roomKey}'.`,
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