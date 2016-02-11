var app = require('./server-config.js');
var mongoose = require('mongoose');

var port = 4568;

app.listen(port);

console.log('Joey is now listening on port ' + port);
