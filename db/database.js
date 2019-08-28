const conf    = require('../server-conf');
const fs      = require('fs');
const Q       = require('./query'); // sql query string manager
const { log } = require('./message');

// == DATABASE ============================================

// set the execution mode to verbose for long stack traces
var sqlite3 = require('sqlite3').verbose();
var newDB = false;

try {
    if(!fs.existsSync(conf.db.database)) {
        newDB = true;
    }
} catch(err) {
    log.error(err.message);
}

try {
  if(!fs.existsSync(conf.dir)) {
    fs.mkdirSync(conf.dir);
  }
  if(!fs.existsSync(conf.export.dir)) {
    fs.mkdirSync(conf.export.dir);
  }
} catch(err) {
  log.error(err.message);
}

var db = new sqlite3.Database(conf.db.database);

if(newDB) {
    db.serialize(function() {
        log.warn('Database file does not exist, instantiating database schema...');
        log.warn('Creating language table...');
        db.run(Q.createTableLanguage);
        log.warn('Creating room table...');
        db.run(Q.createTableRoom);
        log.warn('Creating prompt table...');
        db.run(Q.createTablePrompt);
        log.warn('Creating promptlist table...');
        db.run(Q.createTablePromptList);
        log.warn('Creating recorder table...');
        db.run(Q.createTableRecorder);
        log.warn('Creating recording table...');
        db.run(Q.createTableRecording);
        log.success(`Database created in "${conf.db.database}"!\n`);
    });

    db.parallelize(function() {
        db.run(`INSERT INTO language (LanguageName, LanguageTag, ASR) VALUES ('English', 'en-US', 'english')`);
    });
} else {
    log.success(`Database loaded from "${conf.db.database}"!\n`);
}

module.exports = db;