var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var usersSchema = new db.Schema({
  username: String,
  password: String,
  updated_At: Date,
  created_At: Date
});

usersSchema.pre('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
    next();
  });
});

usersSchema.methods.comparePassword = function (attemptedPassword, callback){
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

var User = db.model('User', usersSchema);

module.exports = User;
