var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var methodOverride = require('method-override'); // HTTP PUT and DELETE support
var session      = require('express-session');
var path         = require('path');
var routes = require('./routes');
var multer  = require('multer');
var favicon = require('serve-favicon');

// configuration ===============================================================
var config = require('./config/config.js');
mongoose.connect(config.database); // connect to our database

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// app.use(morgan('dev')); // log every request to the console

// Request body parsing middleware should be above methodOverride
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(multer({
  dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename + '--' + Date.now()
  }
}))
app.use(express.static(path.resolve('./public')));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(cookieParser()); // read cookies (needed for auth)

// passport
app.use(session({
  secret: config.session_secret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Routes configuration
app.get('*', function(req, res, next) {
  res.locals.authorised = (req.user) ? true : false;
  next();
});
app.get('/', routes.index);
app.get('/user', routes.user);
app.post('/upload', routes.upload);
app.get('/u/:userId', routes.upload_page);

// passport configuration
require('./config/passport')(app, passport, config);

// launch
app.listen(config.port);
console.log('gongyuBox started on port ' + config.port);
