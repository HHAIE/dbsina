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
    // console.log(req.body)
    let busboy = new Busboy({ headers: req.headers });
    let keys = [];
    let values = [];
    let table = '';
    let base64data = [];
    var chunks = [];
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename);
      // file.pipe(base64.encode()).pipe(output);
      //   var chunks = [];
      //   output.on('data', function(data) {
      //     chunks.push(data);
      // });
      // output.on('end', function(){
      //   base64data.push(Buffer.concat(chunks));
      //   console.log('File [' + fieldname + '] Finished');
      //   keys.push(fieldname)
      //   values.push(base64data)
      // });
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
      // console.log('Done parsing form!');
      // res.writeHead(303, { Connection: 'close', Location: '/' });
      // res.end();
    });
    req.pipe(busboy);
    // req.pipe(req.busboy);
    // req.busboy.on('image', function (fieldname, file, filename) {
    //     console.log("Uploading: " + filename); })
    //     req.files.complete(function(err, fields, files) {
    //         if (err) { next(err); }
    //         else {
    //         console.log(fields);
    //         console.log('---------------');
    //         console.log(files);
    //         res.redirect(req.url);
    //         }
    //         });
    // console.log(req.files)
    // const {table, row} =req.body
    // let keys = Object.keys(row);
    // let kMarks=''
    // for(let key of keys){
    // kMarks+='? , ';
    // }
    // let values = keys.map((key)=> row[key]);
    // let qMarks=''
    // for(let value of values){
    // qMarks+='? , ';
    // }
    
    // // let values = [value];
    // let keysF =[]
    // for(let key of keys){
    // let val = '"'+key+'"'
    // keysF.push(val.replace(/['"]+/g, ""))
    // }
    // let sqlquery = `INSERT INTO ${table} ( ${kMarks.substring(0, kMarks.length - 2)}) VALUES ( ${qMarks.substring(0, qMarks.length - 2)});`;

    // let all = keysF.concat(values)
    // let query = db.query(sqlquery, all).sql
    // let queryStart = query.substring(0, query.indexOf("VALUES")).replace(/['"]+/g, '')
    // let queryFinal = queryStart + query.substring(query.indexOf("VALUES"))

    // console.log(queryFinal)
    // return db.query(queryFinal, (err, result) => {
    //     if (err || result.length == 0) {
    //         // display a message when the keyword was not found in the database
    //         console.log("Data not successfully")
    //         return console.error(err.message);
    //     } else {
    //     console.log("Data added successfully")
    //     res.send("Data added successfully")
    //     }
    // })
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
  
app.get("/updateTableRow", (req, res)=> {
    const {table, row, rowId} =req.query
    let keys = Object.keys(row);
    let stringArray = keys.map((key)=> `${key} = ${row[key]}`);
    let string = '';
    stringArray.forEach((str)=>{string+=str})
    let sqlquery = `UPDATE ${table} SET ${string} WHERE id = ${rowId}`;
    return db.query(sqlquery, (err, result) => {
        if (err || result.length == 0) {
            // display a message when the keyword was not found in the database
            return console.error(err.message);
        } else {
        res("Data updated successfully")
        }
    });
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
  
// https.createServer({
//     key: fs.readFileSync('server/server.key'),
//     cert: fs.readFileSync('server/server.cert')
//   }, app)
//   .listen(3001, function () {
//     console.log('Example app listening on port 3000! Go to https://localhost:3001/')
//   });