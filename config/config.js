// config/database.js
module.exports = {
  port: process.env.PORT || 8001,
  host: process.env.HOST || 'http://localhost:8001',
  database: process.env.MONGO_URI || 'mongodb://localhost/gongyuBox',
  session_secret: process.env.SESSION_SECRET || 'supersecret',
  dropbox: {
    dropbox_key: process.env.DROPBOX_APP_KEY || '',
    dropbox_secret: process.env.DROPBOX_APP_SECRET || ''
  }
};
