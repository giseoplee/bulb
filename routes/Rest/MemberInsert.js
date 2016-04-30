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
    'database':'services'
});

var date_instance = new Date();
var insert_date = date_instance.toFormat("YYYY-MM-DD HH24:MI:SS");

router.post('/', function(req, res, next) {

  console.log(req.body);

  connection.query("")

  var query = connection.query("insert users set application_id=?, registration_key=?, device_key=?, nickname=?, created_at=?, updated_at=?;",
    [req.body.application_id, req.body.registration_key, req.body.device_key, req.body.nickname, insert_date, insert_date],function(error, cursor){
      if(error==null){
        res.status(200).json({"message" : "member_insert_success"});
      }else{
        console.log(query.sql);
        res.status(200).json({"message" : "member_insert_fail"});
      }
  });
});

module.exports = router;