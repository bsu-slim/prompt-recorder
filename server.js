// == DEPENDENCIES ========================================
const express       = require('express');
const app           = express();
const server        = require('http').Server(app);
let   io            = require('socket.io')(server);
const wav           = require('wav');
const path          = require('path');
const fs            = require('fs');

// == SETTINGS ============================================
const conf          = require('./server-conf'); // server config file
const port          = process.env.PORT || conf.port || 8000; // server port
const aDir          = conf.dir || './public/audio/'; // audio storage location
const aConf         = conf.audioConf || { sampleRate: 16000, channels: 1}; // audio configuration

// == HEADER ==============================================
require('./header')(); // Print the banner

// == HELPERS =============================================
const db            = require('./db/database'); // init database
const msg           = require('./db/message'); // message functions
const { log }       = require('./db/message');
const Q             = require('./db/query'); // sql query string manager

// -- Create helpers --------------------------------------
const { 
    createRoom,
    duplicateRoom,
    createPrompt,
    createPromptList,
    createRecorder,
    createRecording
} = require('./db/create');


// -- Read helpers ----------------------------------------
const { 
    getPromptList,
    getRecordingList,
    getRoomRecordingList,
    exportRoomRecordingList,
    getRoomPrompts,
    getRecorder
} = require('./db/read');

// -- Update helpers --------------------------------------
const { 
    updateRecording,
    updateRoomActive,
    updateRoomShuffle,
    updateRoomLog
} = require('./db/update');

// -- Delete helpers --------------------------------------
const {
    deleteRecording,
    deletePromptList
} = require('./db/delete');



const initRoom = (socket, room, io) => {
    
    db.serialize(() => {
        
        // Send recent rooms to client
        db.all(Q.getRecentRooms, (err, rows) => {
            if(err) return log.error(err.message);
            return socket.emit('listRooms', rows);
        });

        // Send supported languages to client
        db.all(Q.getLanguages, (err, rows) => {
            if(err) return log.error(err.message);
            return socket.emit('listLanguages', rows);
        });

        // Send room info, if in room
        db.get(Q.getRoom, [room], (err, row) => {
            if(err) return log.error(err.message);
            if(row) socket.emit('dataRoom', row);
        });

        let exportList = 
          fs.readdirSync(conf.export.dir)
            .filter((file) => { 
              return file.slice(0, room.length) === room
            });

        io.in(room).emit('dataExportList', {dir: conf.export.dir.substring(8), list: exportList});

    });

};


// == GLOBALS =============================================

let bufferBank = {};

// == CHECKERS ============================================

function ifRoomExists(key, t, f) {
    db.serialize(() => {
        let stmt = Q.getRoom;
        db.get(stmt, [key], (err, row) => {
            if(err) return log.error(err.message);
            return row ? t(row) : f();
        });
    });
}

function ifRecorderExists(key, t, f) {
    db.serialize(() => {
        let stmt = Q.getRecorder;
        db.get(stmt, [key], (err, row) => {
            if(err) return log.error(err.message);
            return row ? t(row) : f();
        })
    });
}

// == FILE SERVE ==========================================

app.use(express.static('build'));
app.use('/audio', express.static(aDir));
app.use('*', express.static('build'));


// == SOCKETS =============================================

io.on('connection', (socket) => {
    
// -- Initialize ------------------------------------------

    log.success(
        'Connection to server established.', 
        { broadcast: false, room: '/', sender: socket }
    );

    socket.on('join', (payload) => {
        socket.join(payload.room);
        let room = payload.room;
        ifRoomExists(
            payload.room,
            (row) => { // if exists send connect message
                if(payload.recorder) {
                  log.success(
                      `Recorder '${payload.recorder}' connected to server in room '${payload.room}'`,
                      { broadcast: false, room: room, sender: socket }
                  );
                } else {
                  log.warn(
                    `A user is connecting to the server in room '${payload.room}', waiting for user ID...`,
                    { broadcast: false, room: room, sender: socket }
                  );
                }
                socket.emit('dataRoom', row);
            }, 
            () => { // tell client room is new and wait for admin
                socket.emit('newRoom', true);
            }
        );
        ifRecorderExists(
            payload.recorder ? payload.recorder : -1,
            (row) => initRoom(socket, payload.room, io), // if recorder exists init
            () => {
              socket.emit('noRecorder', payload)
              log.error(
                `'${payload.recorder ? payload.recorder : -1}' is not a valid recorder ID. Please enter a valid ID or create a new one.`,
                { broadcast: false, room: room, sender: socket }
              );
            } // else send failure
        );
    });

    socket.on('joinAdmin', (payload) => {
        socket.join(payload.room);
        let room = payload.room;
        ifRoomExists(
            room,
            () => { // if exists send connect message
                log.success(
                    `Administrator connected to server in room ${payload.room}`, 
                    { broadcast: true, room: room, sender: io }
                );
            }, 
            () => { // else tell admin room is new and needs created
                socket.emit('newRoom', true) 
            } 
            
        );
        
        initRoom(socket, payload.room, io); // always init room for admin

    });

// -- Create ----------------------------------------------

    socket.on('newRoom', (payload) => {
        createRoom(socket, payload, io);
    });

    socket.on('duplicateRoom', (payload) => {
        duplicateRoom(socket, payload, io);
    });

    socket.on('newPrompt', (payload) => {
        createPrompt(socket, payload, io);
    });

    socket.on('newPromptList', (payload) => {
        createPromptList(socket, payload, io);
    });

    socket.on('newRecorder', (payload) => {
        createRecorder(socket, payload);
    });

    socket.on('newRecording', (payload) => {
        createRecording(socket, payload);
    });

// -- Read ------------------------------------------------

    socket.on('getPromptList', (payload) => {
        getPromptList(socket, payload);
    });

    socket.on('getRecordingList', (payload) => {
        getRecordingList(socket, payload);
    });

    socket.on('getRoomRecordingList', (payload) => {
        getRoomRecordingList(socket, payload);
    });

    socket.on('exportRoomRecordingList', (payload) => {
        exportRoomRecordingList(socket, payload, io);
    });

    socket.on('getRecorder', (payload) => {
        getRecorder(socket, payload);
    });

    socket.on('getRoomPrompts', (payload) => {
        getRoomPrompts(socket, payload);
    })

// -- Update ----------------------------------------------

    socket.on('updateRoomActive', (payload) => {
        updateRoomActive(socket, payload, io);
    });

    socket.on('updateRoomShuffle', (payload) => {
        updateRoomShuffle(socket, payload, io);
    });

    socket.on('updateRoomLog', (payload) => {
        updateRoomLog(socket, payload, io);
    });

// -- Delete ----------------------------------------------

    socket.on('deletePromptList', (payload) => {
        deletePromptList(socket, payload, io);
    });

    socket.on('deleteRecording', (payload) => {
        deleteRecording(socket, payload);
    });

// -- Recording -------------------------------------------

    socket.on('startRecording', (payload) => {
        let recorderID = payload.recorderID;
        let roomID = payload.roomID;
        let promptID = payload.promptID;

        bufferBank[`rec-${recorderID}-room-${roomID}`] = []; // reset buffer for current recorder in current room
        createRecording(socket, payload); // create a new recording entry
        log.success(
            `recording of prompt '${promptID}' started by recorder '${recorderID}' in room '${roomID}'.`,
            { broadcast: false, room: payload.room, sender: socket }
        );
    });

    socket.on('stopRecording', (payload) => {
        let recorderID = payload.recorderID;
        let roomID = payload.roomID;
        let promptID = payload.promptID;

        // merge all of the streamed buffer chunks
        bufferBank[`rec-${recorderID}-room-${roomID}`] = Buffer.concat(bufferBank[`rec-${recorderID}-room-${roomID}`]);
        let now = new Date().toISOString().replace(/-/g,"").replace(/:/g, "-");
        let filename = `${recorderID}-${roomID}-${promptID}-${now}.wav`;
        
        // save the buffer to a wav file
        payload.filename = filename;
        let writer = new wav.FileWriter(path.join(aDir, filename), aConf);
        writer.write(bufferBank[`rec-${recorderID}-room-${roomID}`]);
        writer.end();

        // update recording with filename
        updateRecording(socket, payload, io); 
        log.success(
            `Recorder '${recorderID}' stopped recording in room '${roomID}' for prompt '${promptID}'.`,
            { broadcast: false, room: payload.room, sender: socket }
        );

    });

    socket.on('binaryData', (payload) => {
        let recorderID = payload.recorderID;
        let roomID = payload.roomID;
        // hold streamed buffer chunk for merge later
        //log.log(payload.data);
        if(
          bufferBank[`rec-${recorderID}-room-${roomID}`] 
          && bufferBank[`rec-${recorderID}-room-${roomID}`].constructor === Array
        ) {
          bufferBank[`rec-${recorderID}-room-${roomID}`].push(payload.data);
        }
        /*log.success(
            `Server received buffer of audio from recorder '${recorderID}'.`,
            { broadcast: false, room: payload.room, sender: socket }
        );*/
    });

});


server.listen(port);
log.success(`Socket server listening on port ${port}...`);