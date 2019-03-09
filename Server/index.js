var express = require('express');
var app = express();
var fs = require('fs');
const fse = require('fs-extra');
var port = 10024;

const sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
var recentImg = "";
var data = "";

app.use(express.static('static-content'));
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

var db = new sqlite3.Database('db/database.db', (err) => {
        if (err) {
                console.error(err.message);
        }
        console.log('Connected to the database.');
});

app.get('/getInfo/', function(req,res){
    res.json({"filename": recentImg,"data": data});
})

app.post('/uploadPic', function(req,res){
    var obj = JSON.parse(Object.keys(req.body)[0]);
    var date = obj.Date;
    recentImg = date;
    var img = (obj.Image).split(",");
    var result = {};

    var buffer = Buffer.alloc(img.length);
    for (var i = 0; i < img.length; i++) {
        buffer[i] = img[i];
    }

    let sql = 'INSERT INTO images(filename) VALUES (?)';
    db.run(sql, [date], function (err){
    	if (err) {
        	res.status(409);
                result["error"] = err.message;
        } else {
        	res.status(201);
                result["success"] = "Img successfully uploaded!";
        }
    });

    fse.outputFile("static-content/images/"+date+".jpg", buffer,  err => {
        if(err) {
          console.log(err);
        } else {
          fs.chmodSync("static-content/images/"+date+".jpg", 0655);
        }
    });
   
    res.json(result);
})

app.post('/uploadData', function(req,res){
    var objStr = Object.keys(req.body)[0];
    var index = objStr.indexOf("actions");
    objStr = objStr.slice(0,index + 9) + "[" + objStr.slice(index + 9,objStr.length-1) + "]}";

    var actions = JSON.parse(objStr).actions;
    actions = actions.map((actions) => Object.entries(actions)[0]);
   
    console.log(actions.length); 
    let sql = 'INSERT INTO data(time,action) VALUES (?,?)'
    for (var i = 0; i < actions.length; i++){
       console.log(actions[i]);
       db.run(sql, actions[i], function(err) {
        if (err) {
          console.log(err.message);
        }
        else {
          console.log(`Rows inserted`);
        }
       });
    }
    
    res.json({"success":"Data uploaded"});
})

app.listen(port, function () {
    console.log('Server running on port: '+port);
});