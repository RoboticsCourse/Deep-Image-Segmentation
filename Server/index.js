var express = require('express');
var app = express();
var fs = require('fs');
const fse = require('fs-extra');
var port = 10023;

var bodyParser = require('body-parser');
var recentImg = "";
var data = "";

app.use(express.static('static-content'));
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.get('/getInfo/', function(req,res){
    res.json({"filename": recentImg,"data": data});
})

app.post('/uploadPic', function(req,res){
    var obj = JSON.parse(Object.keys(req.body)[0]);
    var date = obj.Date;
    recentImg = date;
    var img = (obj.Image).split(",");
    
    var buffer = Buffer.alloc(img.length);
    for (var i = 0; i < img.length; i++) {
        buffer[i] = img[i];
    }

    fse.outputFile("static-content/images/"+date+".jpg", buffer,  err => {
        if(err) {
          console.log(err);
        } else {
          fs.chmodSync("static-content/images/"+date+".jpg", 0655);
          console.log('The file was saved!');
        }
    });
})

app.post('/uploadData', function(req,res){
    //console.log(req);
    var actions = req.body.actions;
    data = JSON.stringify(req.body);
    //console.log(actions);
    actions.sort(function(a,b) {
        a = Object.keys(a)[0];
        b = Object.keys(b)[0];
        return a>b ? 1 : a<b ? -1 : 0;
    })
    console.log(actions);
    res.json({"response": "success"});
})

app.listen(port, function () {
    console.log('Server running on port: '+port);
});
