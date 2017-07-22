var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
	path: String,
	fileName: String
});


var FileStorage = mongoose.model('FileStorage', fileSchema);

module.exports = FileStorage;   