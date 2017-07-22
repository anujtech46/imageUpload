var mongoose = require('mongoose');
var dbPath = 'mongodb://localhost/fileUpload';

mongoose.connect(dbPath);

mongoose.connection.on("connected", function() {
	console.log("Mongoose db connected");
})