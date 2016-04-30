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

// var date_instance = new Date();
// var insert_date = date_instance.toFormat("YYYY-MM-DD HH24:MI:SS");

router.get('/:application_id', function(req, res, next) {

  var query = connection.query("select id,name,version from applications where application_id=?;",
    [req.params.application_id],function(error, cursor){
      if(error==null){
        res.status(200).json({"version" : cursor[0].version, "message" : "success"});
      }else{
        console.log(query.sql);
        res.status(200).json({"version" : 0, "message" : "query_fail"});
      }
  });
});

module.exports = router;