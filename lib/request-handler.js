var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(error, links){
    if(error) {
      res.send(404);
    }
    res.send(200,links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  Link.findOne({url: uri}, function(error, found){
    if(error) {
      return res.send(404);
    } else if(found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        Link.create({url: uri, title: title, baseUrl: req.headers.origin}, function(error, createdLink){
          if(error) {
            return res.send(404);
          }
          res.send(200,createdLink);
        });
      });
    }
  });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username}, function(error, user){
    if(error) {
      res.send(404);
    } else if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match){
        if(match){
          util.createSession(req, res, user);
        } else {
          console.log("Your password is incorrect (But that username does exist ;) )");
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(error, found) {
    if(error) {
      res.send(404);
    } else if (!found) {
      User.create({username: username, password: password}, function(error, newUser){
        if(error){
          res.send(404);
        }
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Username already exists, pick a new one!');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(error, link){
    if(error){
      res.send(404);
    } else if(!link) {
      res.redirect('/');
    } else {
      var visit = link.visits + 1;
      link.update({visits: visit}).exec();
      res.redirect(link.get('url'));
    }
  });
};