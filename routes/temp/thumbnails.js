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

router.get('/', function(req, res, next){
  connection.query('select id, title, timestamp from board '+'order by timestamp desc;', function (error, cursor) {
    res.json(cursor); 
  });
});

module.exports = router;