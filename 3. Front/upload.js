var express = require('express');
var fs = require('fs');
var app = express();
var multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function(request,file, callback){
        callback(null, 'uploadFile/');
    },
    filename: function(request, file, callback){
        callback(null, "100"+path.extname(file.originalname));
    }
})

var upload = multer({
    storage: storage
});

const port = 3002;

app.get('/', function(request, response) { 
    return response.send('/');
}); 

app.get('/exam', function(request, response){
    var template = `
        <html>
        <head>
        <body>
        <form id = "ajaxform" action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" id="uploadFile" name="uploadFile" />
            <input type="submit"/>
        </form>
        </body>
        </html>
    `;
response.send(template);
});

app.post('/upload', upload.single('uploadFile'), function(request, response){
    response.send('Upload! : '+ request.file.originalname);
    console.log(request.file);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})