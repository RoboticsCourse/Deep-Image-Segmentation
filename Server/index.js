var express = require('express');
var app = express();
var fs = require('fs');
const child_process = require('child_process');
var port = 10023;

const sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
var recentImg = "";
var data = "";
var serverOn = "F";
var pairs = [];

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

app.get('/getFiles/', function (req, res) {
  const folderpath = "./static-content/images/";
  child_process.execSync(`zip -r files *`, {
    cwd: folderpath
  });
  res.download(folderpath + 'files.zip');
})

app.get('/getPairs/', function (req, res) {
  let sql = 'select d.time,d.F,d.S,d.Sensor1,d.Sensor2,d.State,i.filename from imgData as imgD inner join data as d on d.id = imgD.dataId  inner join images as i on i.id = imgD.imgId';
  pairs = [];
  db.all(sql, function (err, rows) {
    if (err != null) {
      console.log(err);
      callback(err);
    }

    rows.forEach((row) => {
      pairs.push({
        "State": row.State,
        "Filename": (row.filename).split(":").join("_"),
        "Sensor2": row.Sensor2,
        "Forward": row.F,
        "Data Time": row.time,
        "Sensor1": row.Sensor1,
        "Image Time": row.filename,
        "Speed": row.S
      });
    });
    
    fs.writeFile("./static-content/images/data.json", JSON.stringify(pairs), 'utf8', err => {
      if (err) {
        console.log(err);
      } else {
        fs.chmodSync("./static-content/images/data.json", 0644);
      }
    });

    res.json({ "success": pairs });
  });
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
  else if (objStr == "STOP") {
    serverOn = "F"
    res.json({ "success": "Server stopped" });
  }
  else if (objStr == "START") {
    serverOn = "T"
    res.json({ "success": "Server started" });
  }
})

app.listen(port, function () {
  console.log('Server running on port: ' + port);
});