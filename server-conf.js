module.exports = {
   port: 80, // port to run server on
   dir: './public/audio/', // dir to save audio in
   audioConf: { // should match frontend specs
       sampleRate: 16000, // quality for saved audio
       channels: 1 // channels for saved audio
   },
   db: {
       database: ':memory:' // file to save DB in, :memory: for ephemeral
   },
   export: {
     zipConf: {
       base64: false,
       compression: 'DEFLATE'
     },
     dir: './public/export/'
   }
};

