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

var key = "a710e3bd9b08eb4f51a284e17b9c875db7d6425ba9417c15c4b62e6b43598b3389878c278002a380c26edf72c4d838a34b6f221da21fab890030bb3c387af627";
var image_flag;
var date_instance = new Date();
var insert_date = date_instance.toFormat("YYYY-MM-DD HH24:MI:SS");


router.post('/', function(req, res, next) {

  var context = {};
  context.title = "Login";

  if(req.session.key == undefined){
    req.session.authorized = false;
    res.render('index', context); 
  }else{
    if(req.body.push_pw!=key){
      res.status(200).json({"message" : "auth_fail"});
    }else{
      if(req.body.image_flag=="default"){
        image_flag = 0;
      }
      else if(req.body.image_flag=="app_icon"){
        image_flag = 1;
      }
      connection.query("insert notifications set application_id=?, image_flag=?, send_count=?, created_at=?, updated_at=?;",
        [req.body.application_id, image_flag, req.body.send_count, insert_date, insert_date],function(error, cursor){
          if(error==null){
            res.status(200).json({"message" : "enroll_success"});
          }else{
            res.status(200).json({"message" : "enroll_fail"});
          }
        });
    }
    
  }

});





module.exports = router;