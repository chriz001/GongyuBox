/**
 * User must supply dbox module to this route
 */
var db, helper,
    fs = require('fs'),
    config = require('./config/config.js'),
    User = require('./models/user')

var dbox  = require("dbox"),
    dboxApp = dbox.app({
        "app_key": config.dropbox.dropbox_key,
        "app_secret": config.dropbox.dropbox_secret
    })

exports.index = function(req, res){
    res.render('index', { title: 'GongyuBox' });
};

exports.user = function(req, res){
    if (req.isAuthenticated()) {
        var uid = req.user.id;

        return res.render('user', {
            title: 'Your GongyuBox',
            url: config.host + '/u/' + uid
        });
    }else{
        res.redirect('/');
    }
};

exports.upload_page = function (req, res) {
    var uid = req.params.userId;
    User.findOne({'_id': ''+ uid}, function(err, user) {
        if (err || !user ) {
            res.status(404).render('error', {
                title: "Page not found",
                error: err
            });
        } else {
            res.render('upload', {
                title: 'GongyuBox Upload',
                userId: uid
            });
        }
    });
};

exports.upload = function (req, res) {
    var file = req.files.file;
    var uid = req.body.uid;
    if (!file) {
        res.status(400).send('invalid file');
    } else {
        User.findOne({'_id': ''+ uid}, function(err, user) {
            if (err || !user ) {
                res.status(400).send('invalid user');
            } else {
                fs.readFile(file.path, function(err, data) {
                    if (err) {
                        res.status(400).send('error')
                    } else {
                        res.status(200).send('success')
                    }
                    var client = dboxApp.client({
                        oauth_token: user.dropbox.token,
                        oauth_token_secret: user.dropbox.tokenSecret,
                        uid: user.dropbox.uid
                    })
                    client.put(file.name, data, function(status, reply){
                        console.log('Status:', status);
                        console.log('Reply:', reply);
                        fs.unlink(file.path, function (err) {
                            if (err) throw err;
                            console.log('successfully deleted ' + file.path);
                        });
                    })
                });
            }
        });
    }
};
