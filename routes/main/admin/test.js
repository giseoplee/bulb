var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var gcm = require('node-gcm');
var router = express.Router();

var connection = mysql.createConnection({
    'host':'bulbcommunocations.cj9khjm7u6ic.ap-northeast-1.rds.amazonaws.com',
    'user':'admin',
    'password':'Bcomms0116!',
    'database':'services'
});

router.post('/', function(req, res, next) {

  var context = {};
  context.title = "Login";

  if(req.session.key == undefined){
    req.session.authorized = false;
    res.render('index', context); 
  }else{
    connection.query("select * from notifications where id=?;", [req.body.no], function(error, cursor){

        connection.query("select count(registration_key) as count, (select id from users where application_id=? order by id desc limit 1) as id  from users where application_id=?;",[cursor[0].application_id, cursor[0].application_id]
          ,function(error, cursor){


            var result = {};

            result.slice = 100000;
            result.count = cursor[0].count;
            connection.query("update notifications set send_count=? where id=?",[result.count, req.body.no]);
            result.last_id = cursor[0].id;
            result.devided = parseInt(result.count/result.slice);
            result.remainder = result.count%result.slice;

            res.status(200).json(result);
            
        });  
      
    });
  }
});



module.exports = router;