var express = require('express');
var app = express();
var fs = require('fs');
const fse = require('fs-extra');
var port = 10023;

const sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
var recentImg = "";
var data = "";
var serverOn = "F";

app.use(express.static('static-content'));
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

var db = new sqlite3.Database('db/database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

app.get('/getInfo/', function (req, res) {
  res.json({ "filename": recentImg, "data": data, "serverOn": serverOn });
})

app.post('/uploadPic', function (req, res) {
  var result = {};
  console.log("COMES HERE");
  if (serverOn) {
    var obj = JSON.parse(Object.keys(req.body)[0]);
    var date = obj.Date;
    recentImg = date;
    var img = (obj.Image).split(",");

    console.log("Vid came");

    var buffer = Buffer.alloc(img.length);
    for (var i = 0; i < img.length; i++) {
      buffer[i] = img[i];
    }

    console.log("Inserting into db");

    let sql = 'INSERT INTO images(filename) VALUES (?)';
    db.run(sql, [date], function (err) {
      if (err) {
        res.status(409);
        result["error"] = err.message;
      } else {
        res.status(201);
        result["success"] = "Img successfully uploaded!";
      }
    });

    console.log("Saving it");

    fse.outputFile("static-content/images/" + date + ".mp4", buffer, err => {
      if (err) {
        console.log(err);
      } else {
        fs.chmodSync("static-content/images/" + date + ".mp4", 0655);
      }
    });
  }
  res.json(result);
})

app.post('/uploadData', function (req, res) {
  var objStr = Object.keys(req.body)[0];
  data = objStr
  if (objStr != "STOP" && objStr != "START") {
    var index = objStr.indexOf("actions");
    objStr = objStr.slice(0, index + 9) + "[" + objStr.slice(index + 9, objStr.length - 1) + "]}";
    var actions = JSON.parse(objStr).actions;
    actions = actions.map((actions) => {
      elem = Object.entries(actions)[0];
      return [elem[0], elem[1].F, elem[1].S, elem[1].Sensor1, elem[1].Sensor2, elem[1].State, serverOn];
    });
    console.log(actions)
    size = actions.length;
    console.log("Size: " + size)
    while (size > 0) {
      max = Math.min(size, 100);
      let cc_actions = actions.splice(0, max);
      let placeholders = cc_actions.map(() => '(?,?,?,?,?,?,?)').join(',');
      cc_actions = [].concat(...cc_actions);
      let sql = 'INSERT INTO data(time,F,S,Sensor1,Sensor2,State,Valid) VALUES' + placeholders;
      console.log(placeholders);
      console.log(cc_actions);
      db.run(sql, cc_actions, function (err) {
        if (err) {
          console.log(err.message);
        }
      });
      size -= max;
      console.log("Size: " + size)
    }
    res.json({ "success": "Data uploaded" });
  }
  else if (objStr == "STOP"){
    serverOn = "F"
    res.json({ "success": "Server stopped" });
  }
  else if (objStr == "START"){
    serverOn = "T"
    res.json({ "success": "Server started" });
  }
})

app.listen(port, function () {
  console.log('Server running on port: ' + port);
});