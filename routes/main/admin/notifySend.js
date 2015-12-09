var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var gcm = require('node-gcm');
var async = require('async');
//var sleep = require('sleep');
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
                /* 신형 데이터
                 title: cursor[0].title,
                 description: cursor[0].description,
                 image_flag: cursor[0].image_flag,
                 url: cursor[0].url,
                 param1: cursor[0].param1,
                 param2: cursor[0].param2 
                 */

                no : "1",
                code : "1", // 이미지 플래그 { 1 : 앱 실행 / 4 : 구글 아이콘}
                title : cursor[0].title,
                msg : cursor[0].description,
                ticker : "힌트받고 게임 즐기세요!",
                url : cursor[0].url
             }
          });

        //var server_api_key =  'AIzaSyBJ2X4eC4i66kTHHG8ymmC3Ffq_KDCk5kM'; // 신버전
        var server_api_key =  'AIzaSyDa1JpGKQZYNvecZzUe3PEcZ4mQqAKzjv0'; // 구버전, 현재 알케미
        var sender = new gcm.Sender(server_api_key);
        var registrationIds = [], size=1000;
        var token = [];

        connection.query("select registration_key from users where application_id=?;",[cursor[0].application_id]
          ,function(error, cursor){

                  var loop = cursor.length;
                  var batchLimit = 1000;
                  var tokenBatches = [];

                  for(var start=0; start < loop; start+=batchLimit){

                    //console.log(cursor[0]);
                    //console.log(cursor[batchLimit-1]);
                    var sliceTokens = cursor.splice(0, batchLimit);
                    tokenBatches.push(sliceTokens);

                  }

                  var sendLimit = tokenBatches.length;

                  for(var i=0; i<sendLimit; i++){

                    var sendIds = new Array();

                    for(var j=0; j<tokenBatches[i].length; j++){
                      sendIds.push(tokenBatches[i][j].registration_key);
                    }
                    
                    //console.log(sendIds); 
                    Sending(sender, message, sendIds, i, batchLimit);

                    // sender.send(message, sendIds, 4, function (error, result){
                    //   if(error==null){
                    //     //console.log("\n"+"발송 / 발송 reg_id = "+"\n\n"+sendIds+"\n\n");
                    //     console.log(result);  
                    //     //res.status(200).json({"message" : "send_all_complete"});
                    //     if(i==(sendLimit-1)){
                    //       res.status(200).json({"message" : "send_all_complete"});
                    //     }
                    //   }else{
                    //     res.status(200).json({"message" : "send_fail"});
                    //   }
                    // });

                  }

                  //console.log(tokenBatches.length);
                  //console.log(tokenBatches[0]);
                  
                  //res.status(200).json({"message" : "send_all_complete"});

              });
             }else{
                  res.status(200).json({"message" : "send_fail"});
                }
           });
          }

    function Sending(sender, message, sendIds, count, limit){
      //console.log(message);
      //console.log(sendIds);

       sender.send(message, sendIds, 4, function (error, result){
        if(error==null){
          //console.log("\n"+"발송 / 발송 reg_id = "+"\n\n"+sendIds+"\n\n");
          console.log(result);  
          //res.status(200).json({"message" : "send_all_complete"});
          if(count==(limit-1)){
            res.status(200).json({"message" : "send_all_complete"});
          }
        }
      });

      sleep(1000);
    }

    function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }

});


module.exports = router;