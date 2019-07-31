const { log }       = require('./message');
const db            = require('./database'); // init database
const Q             = require('./query'); // sql query string manager
const chalk         = require('chalk');

module.exports = {
    createRoom: (socket, payload, io) => {
        db.serialize(() => {
    
            // create room data array for query
            let room = payload.room;
            let active = 0;
            let shuffle = 0;
            let roomData = [room, active, shuffle];
    
            // Make the room
            let stmt = db.prepare(Q.createRoom);
            stmt.run(roomData, (err) => {
                if(err) return log.error(err.message);
                log.success(
                  `New room '${payload.room}' created successfully.`,
                  {
                    broadcast: false,
                    room: payload.room,
                    sender: socket,
                    prefix: {
                      text: '[Create]',
                      color: chalk.magenta
                    }
                  }
                );
            });
    
            // send new room down to clients and rejoin
            db.get(Q.getRoom, [room], (err, row) => {
                if(err) return log.error(err.message);
                if(row) {
                    io.in(row.roomKey).emit('dataRoom', row); // send room info down
                    io.in(row.roomKey).emit('newRoom', false);
                    log.success(
                      `Administrator created room '${payload.room}' for recording.`,
                      {
                        broadcast: true,
                        room: payload.room,
                        sender: io,
                        prefix: {
                          text: '[Create]',
                          color: chalk.magenta
                        }
                      }
                    );
                }
            });
    
        })
    },

    duplicateRoom: (socket, payload, io) => {
      db.serialize(() => {
    
        // create room data array for query
        let room = payload.room;
        let copy = payload.copy;
        let active = 0;
        let shuffle = 0;
        let roomData = [room, active, shuffle];

        // Make the room
        let stmt = db.prepare(Q.createRoom);
        stmt.run(roomData, (err) => {
            if(err) return log.error(err.message);
            log.success(
                `New room '${payload.room}' created successfully.`,
                {
                  broadcast: false,
                  room: payload.room,
                  sender: socket,
                  prefix: {
                    text: '[Create]',
                    color: chalk.magenta
                  }
                }
            );
        });

        // send new room down to clients and rejoin
        db.get(Q.getRoom, [room], function(err, row) {
            if(err) return log.error(err.message);
            if(row) {
                let newRoom = row;
                io.in(row.roomKey).emit('dataRoom', row); // send room info down
                io.in(row.roomKey).emit('newRoom', false);
                log.success(
                    `Administrator created room '${payload.room}' for recording.`,
                    {
                      broadcast: true,
                      room: payload.room,
                      sender: io,
                      prefix: {
                        text: '[Create]',
                        color: chalk.magenta
                      }
                    }
                );

                stmt = Q.getRoom;
                let roomKey = payload.copy;
                db.get(stmt, [roomKey], (err, row) => {
                    if(err) return log.error(err.message);
                    let copyRoom = row;
                    db.serialize(() => {
                      let params = [copyRoom.roomID];
                      let stmt = Q.getRoomPromptList;
    
                      db.all(stmt, params, (err, rows) => {
                          if (err) return log.error(err.message);
                          console.log(rows);
                          for(let i = 0; i < rows.length; i++) {
                            let row = rows[i];
                            let promptID = row.promptID;
                            let roomID = newRoom.roomID;
                            let promptListData = [promptID, roomID];
                            
                            let stmt = db.prepare(Q.createPromptList);
                            stmt.run(promptListData, function(err) {
                                if(err) return log.error(err.message);
                                payload.promptListID = this.lastID;
                                socket.emit('dataPromptList', payload);
                                log.success(
                                    `Prompt listing '${this.lastID}' created for prompt '${promptID}' in room '${roomID}'.`, 
                                    {
                                      broadcast: false,
                                      room: payload.room,
                                      sender: socket,
                                      prefix: {
                                        text: '[Create]',
                                        color: chalk.magenta
                                      }
                                    }
                                );
                            });
    
                          }
    
                          stmt = Q.getRoom;
                          let roomKey = payload.roomKey;
                          db.get(stmt, [roomKey], (err, row) => {
                              if(err) return log.error(err.message);
                              io.in(roomKey).emit('dataRoom', row);
                          });
                          
                      });
                    });

                });



            }
        });

    })
    },
    
    createPrompt: (socket, payload, io) => {
        db.serialize(() => {
    
            let prompt = payload.prompt;
            let languageID = payload.languageID;
            let add = payload.add;
            let roomID = payload.roomID;
            let promptData = [prompt, languageID];
    
            let stmt = db.prepare(Q.createPrompt);
            stmt.run(promptData, function(err) {
                if(err) return log.error(err.message);
                payload.promptID = this.lastID;
                socket.emit('dataPrompt', payload);
                log.success(
                    "New Prompt created successfully.", 
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Create]',
                        color: chalk.magenta
                      }
                    }
                );

                if(add) {
                  db.serialize(() => {
                    let promptID = payload.promptID;
                    let promptListData = [promptID, roomID];
                  
                    stmt = db.prepare(Q.createPromptList);
                    stmt.run(promptListData, function(err) {
                        if(err) return log.error(err.message);
                        payload.promptListID = this.lastID;
                        socket.emit('dataPromptList', payload);
                        log.success(
                            `Prompt listing '${this.lastID}' created for prompt '${promptID}' in room '${roomID}'.`, 
                            {
                              broadcast: false,
                              room: payload.room,
                              sender: socket,
                              prefix: {
                                text: '[Create]',
                                color: chalk.magenta
                              }
                            }
                        );
                    });
        
                    stmt = Q.getRoom;
                    let roomKey = payload.roomKey;
                    db.get(stmt, [roomKey], (err, row) => {
                        if(err) return log.error(err.message);
                        io.in(roomKey).emit('dataRoom', row);
                    });
                  });
                }

            });

            


        });
    },

    createPromptList: (socket, payload, io) => {
        db.serialize(() => {
            let promptID = payload.promptID;
            let roomID = payload.roomID;
            let promptListData = [promptID, roomID];
            
            let stmt = db.prepare(Q.createPromptList);
            stmt.run(promptListData, function(err) {
                if(err) return log.error(err.message);
                payload.promptListID = this.lastID;
                socket.emit('dataPromptList', payload);
                log.success(
                    `Prompt listing '${this.lastID}' created for prompt '${promptID}' in room '${roomID}'.`, 
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Create]',
                        color: chalk.magenta
                      }
                    }
                );
            });

            stmt = Q.getRoom;
            let roomKey = payload.roomKey;
            db.get(stmt, [roomKey], (err, row) => {
                if(err) return log.error(err.message);
                io.in(roomKey).emit('dataRoom', row);
            });

        });
    },
    
    createRecorder: (socket, payload) => {
        db.serialize(() => {

            let age = payload.recorderAge;
            let gender = payload.recorderGender;
            let recorderData = [age, gender];
    
            let stmt = db.prepare(Q.createRecorder);
            stmt.run(recorderData, function(err) {
                if(err) return log.error(err.message);
                payload.recorderID = this.lastID;
                socket.emit('newRecorder', payload);
                log.success(
                    `New recorder '${this.lastID}' with age '${age}' and gender '${gender}' created successfully.`, {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Create]',
                        color: chalk.magenta
                      }
                    }
                );
            });
    
        });
    },
    
    createRecording: (socket, payload) => {
        db.serialize(() => {
            
            let sampleRate = payload.sampleRate;
            let channels = payload.channels;
            let recorderID = payload.recorderID;
            let roomID = payload.roomID;
            let promptID = payload.promptID;
            let recordingData = [sampleRate, channels, recorderID, promptID, roomID];

            let stmt = db.prepare(Q.createRecording);
            
            stmt.run(recordingData, function(err) {
                if(err) log.error(err.message);
                payload.recordingID = this.lastID;
                log.success(
                    `New recording of prompt '${promptID}' by recorder '${recorderID}' for room '${roomID}'.`, 
                    {
                      broadcast: false,
                      room: payload.room,
                      sender: socket,
                      prefix: {
                        text: '[Create]',
                        color: chalk.magenta
                      }
                    }
                )
                socket.emit('newRecording', payload);
            });
    
        });
    }
};