// server/index.js

const express = require("express");
var fs = require('fs')
var https = require('https')
const path = require('path');
const multer = require('multer');
// let form = require('connect-form');
let busboy = require('connect-busboy');
var Busboy = require('busboy');
let inspect = require('util').inspect;
//...


const PORT = process.env.PORT || 3001;

const app = express();
const bodyParser = require('body-parser');

const mysql = require("mysql");

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.bodyParser());
app.use(busboy()); 


// establish connection parameters to foods database
db = mysql.createConnection({
  host: "byun.eunostus.dreamhost.com",
  user: "hazim",
  password: "Meandhim1",
  database: "sinatoursdb"
});

// connect to foods database
db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log("Connected to database");
});


// app.get("/database", (req, res) => {
//     res.json({ message: "Hello from server!" });
// });

global.db = db;


app.get("/getTable", (req, res) => {
    const {table, filter} =req.query
    // get the search keyword inserted by user
    // let word = type;
    // search the database for the keyword
    let sqlquery = filter ? `SELECT * FROM ${table} Where position='${filter}'`
                        : `SELECT * FROM ${table}`;
    // execute sql query
    return db.query(sqlquery, (err, result) => {
        if (err) {
            // display a message when the keyword was not found in the database
            return console.error(err.message);
        } else if (result.length == 0){
        return console.error("No data is available");
        } else {
        res.send({...result})
        }
    });
})

if (module.hot) {
  module.hot.accept();
}
  
app.get("/getTableColumn", (req, res) => {
    const {table} =req.query
    let sqlquery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE
                    TABLE_SCHEMA = Database() AND TABLE_NAME = '${table}'`;
    return db.query(sqlquery, (err, result) => {
        if (err) {
            // display a message when the keyword was not found in the database
            console.log('error1')
            return console.error(err.message);
        } else if (result.length == 0){
        return console.error("No data is available");
        } else {
            console.log({...result})
        res.send({...result})
        }
    });
})
  
app.post("/addTableRow", (req, res) => {
    let busboy = new Busboy({ headers: req.headers });
    let keys = [];
    let values = [];
    let table = '';
    let base64data = [];
    var chunks = [];
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        chunks.push(data);
      });
      file.on('end', function() {
        base64data.push(Buffer.concat(chunks));
        console.log('File [' + fieldname + '] Finished');
        keys.push(fieldname)
        values.push(base64data)
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      if (fieldname !== 'table'){
        keys.push(fieldname)
        values.push(val)
      }
      
      table = fieldname === 'table' && val
      
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      console.log(keys);
      console.log(values);
      qMarks=''
      for(let value of values){
        qMarks+='? , ';
      }
      let sqlquery = `INSERT INTO ${table} ( ${keys}) VALUES ( ${qMarks.substring(0, qMarks.length - 2)});`;
      console.log(sqlquery)
      return db.query(sqlquery, values, (err, result) => {
        if (err || result.length == 0) {
            // display a message when the keyword was not found in the database
            console.log("Data not successfully")
            return console.error(err.message);
        } else {
        console.log("Data added successfully")
        res.end();
        }
    });
    });
    req.pipe(busboy);
})
  
app.get("/removeTableRow", (req, res) => {
    const {table, row, rowId} =req.query
    let sqlquery = `DELETE FROM ${table} WHERE id = ${rowId}`;
    console.log(sqlquery);
    return db.query(sqlquery, (err, result) => {
        if (err || result.length == 0) {
            // display a message when the keyword was not found in the database
            return console.error(err.message);
        } else {
        // res.send("Data removed successfully")
        res.end();
        }
    });
})
  
app.post("/updateTableRow", (req, res)=> {
  console.log("update");
  let busboy = new Busboy({ headers: req.headers });
    let keys = [];
    let values = [];
    let table = '';
    let base64data = [];
    var chunks = [];
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        chunks.push(data);
      });
      file.on('end', function() {
        base64data.push(Buffer.concat(chunks));
        console.log('File [' + fieldname + '] Finished');
        keys.push(fieldname)
        values.push(base64data)
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      if (fieldname === 'image' && val === 'undefined'){
        console.log("No image")
      } else if (fieldname !== 'table' && fieldname !== 'id'){
        keys.push(fieldname)
        values.push(val)
      } else if (fieldname === 'table'){
        table = val
      }else if (fieldname === 'id'){
        rowId = val
      }
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      console.log(keys);
      console.log(values);
      // qMarks=''
      // for(let value of values){
      //   qMarks+='? , ';
      // }
      let stringArray = keys.map((key, index)=> `${key} = ?, `);
      let string = '';
      stringArray.forEach((str)=>{string+=str})
      let sqlquery = `UPDATE ${table} SET ${string.substring(0, string.length - 2)} WHERE id = ${rowId};`;
      console.log(sqlquery)
      return db.query(sqlquery, values, (err, result) => {
        if (err || result.length == 0) {
            // display a message when the keyword was not found in the database
            console.log("Data not successfully")
            return console.error(err.message);
        } else {
        console.log("Data updated successfully")
        res.end();
        }
    });
    });
    req.pipe(busboy);


    
    // let sqlquery = ` ${table} SET ${string} WHERE id = ${rowId}`;
    // return db.query(sqlquery, (err, result) => {
    //     if (err || result.length == 0) {
    //         // display a message when the keyword was not found in the database
    //         return console.error(err.message);
    //     } else {
    //     res("Data updated successfully")
    //     }
    // });
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
  
https.createServer({
    key: fs.readFileSync('server/server.key'),
    cert: fs.readFileSync('server/server.cert')
  }, app)
  .listen(3001, function () {
    console.log('Example app listening on port 3000! Go to https://localhost:3001/')
  });