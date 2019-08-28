let searchLimit = 100;
function Query() {
// == SCHEMA ==============================================
    this.createTableLanguage = `
        CREATE TABLE language (
            languageID      INTEGER PRIMARY KEY AUTOINCREMENT    NOT NULL,
            languageName    VARCHAR(255)                         NOT NULL,
            languageTag     VARCHAR(255) UNIQUE                  NOT NULL,
            ASR             VARCHAR(255)
        );
    `;

    this.createTableRoom = `
        CREATE TABLE room (
            roomID          INTEGER PRIMARY KEY AUTOINCREMENT   NOT NULL,
            roomKey         VARCHAR(255) UNIQUE                 NOT NULL,
            active          INTEGER                             NOT NULL,
            shuffle         INTEGER                             NOT NULL,
            log             INTEGER                             NOT NULL,
            created         DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL
        );
    `;

    this.createTablePrompt = `
        CREATE TABLE prompt (
            promptID        INTEGER PRIMARY KEY AUTOINCREMENT   NOT NULL,
            prompt          VARCHAR(255)                        NOT NULL,
            languageID      INTEGER                             NOT NULL,
            created         DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL,
            FOREIGN KEY(languageID) REFERENCES language(languageID)
        );
    `;

    this.createTablePromptList = `
        CREATE TABLE promptlist (
            promptListID    INTEGER PRIMARY KEY AUTOINCREMENT   NOT NULL,
            promptID        INTEGER                             NOT NULL,
            roomID          INTEGER                             NOT NULL,
            created         DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL,
            FOREIGN KEY(roomID) REFERENCES room(roomID),
            FOREIGN KEY(promptID) REFERENCES prompt(promptID)
        );
    `;
    
    this.createTableRecorder = `
        CREATE TABLE recorder (
            recorderID      INTEGER PRIMARY KEY AUTOINCREMENT   NOT NULL,
            recorderAge     VARCHAR(255),
            recorderGender  VARCHAR(255),
            created         DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL
        );
    `;

    this.createTableRecording = `
        CREATE TABLE recording (
            recordingID     INTEGER PRIMARY KEY AUTOINCREMENT   NOT NULL,
            filepath        VARCHAR(255),
            sampleRate      INTEGER                             NOT NULL,
            channels        INTEGER                             NOT NULL,
            recorderID      INTEGER                             NOT NULL,
            promptID        INTEGER                             NOT NULL,
            roomID          INTEGER                             NOT NULL,
            recPrompt       VARCHAR(255),
            metrics         VARCHAR(255),
            created         DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL,
            FOREIGN KEY(recorderID) REFERENCES recorder(recorderID),
            FOREIGN KEY(promptID) REFERENCES prompt(promptID),
            FOREIGN KEY(roomID) REFERENCES room(roomID)
        );
    `;

// == CREATE ==============================================
    this.createRoom = 'INSERT INTO room (roomKey, active, shuffle, log) VALUES (?, ?, ?, ?);';
    this.createPrompt = 'INSERT INTO prompt (prompt, languageID) VALUES (?, ?);';
    this.createRecorder = 'INSERT INTO recorder (recorderAge, recorderGender) VALUES (?, ?);';
    this.createPromptList = 'INSERT INTO promptlist (promptID, roomID) VALUES (?, ?);';
    this.createRecording = `
        INSERT INTO recording (
            sampleRate,
            channels,
            recorderID,
            promptID,
            roomID
        ) VALUES (?, ?, ?, ?, ?);
    `;

// == READ ================================================

    this.getRoom = `SELECT * FROM room WHERE roomKey = ?;`;
    this.getRecorder = `SELECT * FROM recorder WHERE recorderID = ?;`;
    this.getLanguages = `SELECT * FROM language ORDER BY languageTag DESC;`;
    this.getRecentRooms = `SELECT * FROM room ORDER BY created DESC limit 10`;
    this.getPromptList          = `
        SELECT
            prompt.*,
            language.*,
            CASE
                WHEN promptlist.promptListID IS NULL THEN 0
                ELSE promptlist.promptListID
            END AS promptlistExistsForRoom
            FROM prompt
            LEFT JOIN language ON prompt.languageID = language.languageID
            LEFT JOIN promptlist ON prompt.promptID = promptlist.promptID AND promptlist.roomID = ?
            WHERE prompt.Prompt COLLATE UTF8_GENERAL_CI LIKE ? 
            LIMIT ${searchLimit};
    `;
    this.getRecentPromptList    = `
        SELECT
            prompt.*,
            language.*,
            CASE
                WHEN promptlist.promptListID IS NULL THEN 0
                ELSE promptlist.promptListID
            END AS promptlistExistsForRoom
            FROM prompt
            LEFT JOIN language ON prompt.languageID = language.languageID
            LEFT JOIN promptlist ON prompt.promptID = promptlist.promptID AND promptlist.roomID = ?
            ORDER BY created DESC
            LIMIT ${searchLimit};
    `;

    this.getRoomPromptList = `
        SELECT * FROM promptlist WHERE roomID = ?;
    `;

    this.getRoomPrompts = `
        SELECT 
          prompt.* 
          FROM prompt
          LEFT JOIN language ON prompt.languageID = language.languageID
          INNER JOIN promptlist ON prompt.promptID = promptlist.promptID AND promptlist.roomID = ?
          ORDER BY created DESC;
    `;

    this.getRecordingList       = `
        SELECT recording.* FROM recording 
            INNER JOIN prompt ON recording.promptID = prompt.promptID 
            WHERE roomID = ? AND recorderID = ? AND recording.promptID = ?
            ORDER BY recording.created DESC;
    `;

    this.getRoomRecordingList   = `
        SELECT * FROM recording
            INNER JOIN prompt ON recording.promptID = prompt.promptID
            WHERE roomID = ?;
    `;

    this.exportRoomRecordingList  = `
    SELECT * FROM recording
        INNER JOIN prompt ON recording.promptID = prompt.promptID
        INNER JOIN room ON recording.roomID = room.roomID
        INNER JOIN recorder ON recording.recorderID = recorder.recorderID
        WHERE recording.roomID = ?;
    `;

// == UPDATE ==============================================
   this.updateRecording = 'UPDATE recording SET filepath=? WHERE recordingID =?;';

   this.updateRoomActive = 'UPDATE room SET active=? WHERE roomKey = ?';
   this.updateRoomShuffle = 'UPDATE room SET shuffle=? WHERE roomKey = ?';
   this.updateRoomLog = 'UPDATE room SET log=? WHERE roomKey = ?';

// == DELETE ==============================================
    this.deleteRecording        = 'DELETE FROM recording WHERE recordingID = ?;';
    this.deletePromptList       = 'DELETE FROM promptlist WHERE promptID = ? AND roomID = ?;';
}

let Q = new Query();

module.exports = Q;