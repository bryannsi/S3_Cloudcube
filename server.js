var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: 'CSjTaQjuW9guZCarztQG7boa22PWZiaS1KiaQXjX',
    accessKeyId: 'AKIA37SVVXBHQQGI3OSN',
    region: 'us-east-1'
});

var app = express(),
    s3 = new aws.S3();

app.use(bodyParser.json());

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'cloud-cube',
        key: function (req, file, cb) {
            console.log(file.originalname);
            cb(null, 'vystoq0cy0tf/public/testtt.pdf'); //use Date.now() for unique file keys
        }
    })
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');//index.html is inside node-cheat
});

//use by upload form
app.post('/upload', upload.array('myFile',1), function (req, res, next) {
    res.send("Uploaded!");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


const fs = require('fs');
const path = require("path");

/*const s3 = new AWS.S3({
    accessKeyId: 'AKIA37SVVXBHQQGI3OSN',
    secretAccessKey: 'CSjTaQjuW9guZCarztQG7boa22PWZiaS1KiaQXjX'
});*/



const absoluteFilePath = "/home/bismarck/Escritorio/test/pdfeditable.pdf";
const uploadFile = (file) => {
    const filePath = path.normalize(path.join(__dirname, file));
    fs.readFile(filePath, (err, data) => {
     if (err) throw err;
     const params = {
         Bucket: 'cloud-cube', // pass your bucket name
         Key: `vystoq0cy0tf/public/${file}_${new Date().getMilliseconds()}.pdf`, // file will be saved in <folderName> folder
         Body: data
     };
      s3.upload(params, function (s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`);
        return data.Location;
    });
  });
};



app.post("/aws", (req, res) => {
    try {
        const file = req.body.file;
        const urlPDF = uploadFile(file);
        if(urlPDF) {console.log(urlPDF)
            res.statusCode = 200;
            res.send(urlPDF);}	
    } catch (error) {
      res.contentType("json");
      res.json(error.message);
    }
  });


  //const file = "pdfeditable.pdf";
  //const filePath = path.normalize(path.join(__dirname, file
  //const file = req.body.file
