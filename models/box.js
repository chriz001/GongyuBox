// load the things we need
var mongoose = require('mongoose');
var shortId = require('shortid');

// define the schema for our user model
var boxSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': shortId.generate
  },
  name          : String,
  created_at    : { type: Date, default: Date.now },
});

// create the model for users and expose it to our app
module.exports = mongoose.model('box', boxSchema);
