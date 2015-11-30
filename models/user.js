// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
  name   : String,
  email  : String,
  dropbox: {
    id: { type: String },
    token: { type: String },
    tokenSecret: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed }
  },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
