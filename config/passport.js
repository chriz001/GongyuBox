// load all the things we need
var DropboxStrategy = require('passport-dropbox').Strategy;
// https://github.com/boldrocket/sociallogin

// load up the user model
var User = require('../models/user');

module.exports = function(express, passport, config) {

    function addUser(emailAddress, provider, providerId, providerData, passportDone){

        // Define main provider search query
        var query = {};
        query[provider + '.id'] = providerId;
        User.findOne(query, function(err, user) {
            if (err) {
                return passportDone(err);
            }
            if (!user) {
                user = new User({
                    email: emailAddress,
                });

                user[provider] = providerData;

                user.save(function(err) {
                    if (err) console.log(err);
                    return passportDone(err, user);
                });
            } else {
                return passportDone(err, user);
            }
        });
    }

    function authenticationController(req, res) {
        res.redirect('/user');
    };

    function signInController(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/user');
        }
        res.redirect('/');
    };

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // Dropbox
    passport.use(new DropboxStrategy({
            consumerKey: config.dropbox.dropbox_key,
            consumerSecret: config.dropbox.dropbox_secret,
            callbackURL: config.host + '/auth/dropbox/callback'
        },
        function (token, tokenSecret, profile, done) {
            var emailAddress = '';
            if (profile.emails.length > 0) {
                emailAddress = profile.emails[0].value;
            }
            var data = {
                id: profile.id,
                token: token,
                tokenSecret: tokenSecret,
                meta: profile._json
            }
            addUser(emailAddress, profile.provider, profile.id, data, done);
        }
    ));

    // Setting the dropbox auth routes
    express.get('/auth/dropbox',
        passport.authenticate('dropbox', {
            failureRedirect: '/'
        }), signInController);

    express.get('/auth/dropbox/callback',
        passport.authenticate('dropbox', {
            failureRedirect: '/'
        }), authenticationController);

};
