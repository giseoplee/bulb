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

      if(error==null){
        var message = new gcm.Message({
          collapseKey: 'demo',
          delayWhileIdle: true,
          timeToLive: 3,
          data: {
                 title: cursor[0].title,
                 description: cursor[0].description,
                 image_flag: cursor[0].image_flag,
                 url: cursor[0].url,
                 param1: cursor[0].param1,
                 param2: cursor[0].param2 
             }
          });

        var server_api_key =  'AIzaSyBJ2X4eC4i66kTHHG8ymmC3Ffq_KDCk5kM';
        var sender = new gcm.Sender(server_api_key);
        var registrationIds = [], size=4;
        var token = [];

        connection.query("select registration_key from users where application_id=?;",[cursor[0].application_id]
          ,function(error, cursor){

            for(var i=0; i<cursor.length; i++){
              token[i] = cursor[i].registration_key;
            }
            
            var success_cnt = 0;
            var notification_cnt = token.length;
            var j = 0;

            while(token.length > 0){
              registrationIds.push(token.splice(0,size));
            }

            for(var k=0; k<registrationIds.length; k++){
              var sendIds = new Array();

              for(var l=0; l<size; l++){
                sendIds.push(registrationIds[k][l]);

                if(l==(size-1)){

                  sender.send(message, sendIds, 4, function (error, result){

                    if(error==null){
                      console.log(result);
                      success_cnt += result.success;

                      if(notification_cnt==success_cnt){
                        res.status(200).json({"message" : "send_all_complete"});
                      }
                    }
                  });      
                }
              }
            }
        });  
      }else{
        res.status(200).json({"message" : "send_fail"});
      }
    });
  }
});



module.exports = router;