var db = require('../config');
var crypto = require('crypto');

var urlsSchema = new db.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
  updated_At: Date,
  created_At: Date
});

urlsSchema.pre('save', function(next){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Link = db.model('Link', urlsSchema);

module.exports = Link;
