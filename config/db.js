var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/demonosql');

//mongoose.connect('mongodb://192.168.222.139:27017/demonosql');


module.exports = mongoose;
