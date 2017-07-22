var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoConnection = require('./mongoConnection.js');
var fileStorage = require('./fileStorageModal.js');
// var ObjectId = new ongoose().Type.Object();
var fs = require('fs');
var dir = './upload';

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({ storage : storage, limits : {fileSize : 20480000}}).single('file');

/** API path that will upload the files */
app.post('/upload', function(request, response) {
    console.log("Api call", request.file);
    upload(request, response,function(err){
        if(err){
            console.error("Api call error", err);
            return response.json({error_code:1,err_desc:err});
        } else {
            // after uploading you can store filepath in mongodb.
            console.info("file uploaded successfully",request.file);
            var fileModal = new fileStorage({
                path : request.file.path,
                fileName : request.file.fileName
            });
            fileModal.save(function(err) {
                if(err) {
                    console.log("Unable to store file", JSON.stringify(err));
                    return response.json({error_code:1,err_desc:err});
                } else {
                    response.json({error_code:0,responseCode:"OK", responseData: fileModal});
                }
            });
        }
    });
});

app.get('/image/:id', function(request, response) {

    var imageId = request.params.id;
    console.log("id", imageId);
    fileStorage.findOne({_id : imageId}, function(err, res) {
        if(err || !res) {
            console.log("Unable to fetch file", JSON.stringify(err));
            return response.json({error_code:1,err_desc:err});
        } else {
            fs.exists(res.path, function(exists) {
                if(exists) {
                    console.info("image path exist [%s]", res.path);
                    var binaryImageFile = fs.readFileSync(res.path);
                    var base64ImageFile = new Buffer(binaryImageFile, 'binary').toString('base64');
                    return response.send(base64ImageFile);
                } else {
                    console.info("image path not exist [%s]", res.path);
                    return response.json({error_code:1,err_desc:err});
                }
            });
        }
    });
});

app.listen('4000', function(){
    console.log('running on 4000...');
});
