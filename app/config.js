var db = require('mongoose');
var dbUri = 'mongodb://localhost/joey';
db.connect(dbUri);
module.exports = db;