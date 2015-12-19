var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var date = require('date-utils');
var router = express.Router();

var connection = mysql.createConnection({
    'host':'bulbcommunocations.cj9khjm7u6ic.ap-northeast-1.rds.amazonaws.com',
    'user':'admin',
    'password':'Bcomms0116!',
    'database':'sopt'
});

router.get('/:content_id', function(req, res, next) { 
  connection.query('select * from board where id=?;', [req.params.content_id], function (error, cursor) {
    if (cursor.length > 0) res.json(cursor[0]);
    else
    res.status(503).json({ result : false, reason : "Cannot find selected article" });
  }); 
});

router.post('/', function(req, res, next) {
  connection.query('insert into board(title, content) values (?, ?);', [req.bod y.title, req.body.content], function (error, info) {
    if (error == null) {
      connection.query('select * from board where id=?;', [info.insertId], function (error, cursor) {
    if (cursor.length > 0) { res.json({
      result : true, id : cursor[0].id, title : cursor[0].title,
      timestamp : cursor[0].timestamp, });
    } else
      res.status(503).json({ result : false, reason : "Cannot post article" }); });
    } else
      res.status(503).json(error); });
    });

module.exports = router;