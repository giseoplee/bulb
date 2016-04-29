var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
    'host':'bulbcommunocations.cj9khjm7u6ic.ap-northeast-1.rds.amazonaws.com',
    'user':'admin',
    'password':'Bcomms0116!',
    'database':'services'
});

router.post('/', function(req, res, next) {
  
});

module.exports = router;