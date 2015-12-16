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

        connection.query("select count(registration_key) as count from users where application_id=?;",[cursor[0].application_id]
          ,function(error, cursor){
            console.log(cursor);
            var slice_count = 100000;
            var slicing = parseInt(cursor[0].count/slice_count);
            var last_slice = (cursor[0].count%slice_count);
            var point = 0;

            // console.log(slicing);
            // console.log(last_slice);
            // console.log("\n");
                
                Batch(point, point, sender, message, cursor[0].count, req.body.no, slice_count);
                // for(var part=0; part<(slicing*slice_count); part+=slice_count){
                //   //console.log((part+1)+" ~ "+(part+slice_count));
                //   // connection.query("select registration_key from users where id between "+part+" and "+(part+slice_count)+";"
                //   //   ,function(error, cursor){
                //   //     console.log(cursor);
                //   //   });
                //   // console.log(part+1);
                //   // console.log(part+slice_count);
                //   // console.log("\n");
                //   console.log("for 문 : "+point);
                //   point = Batch(point, (part+slice_count), sender, message, cursor[0].count, req.body.no, slice_count);
                  
                // }

                // var last_send = part;

                // console.log(last_send+1);
                // console.log(last_send+last_slice);0
                // console.log("\n");
                //Batch((last_send+1), (last_send+last_slice), sender, message, cursor[0].count, req.body.no, slice_count);
                


                  // var loop = cursor.length;
                  // var batchLimit = 1000;
                  // var tokenBatches = [];

                  // for(var start=0; start < loop; start+=batchLimit){

                  //   var sliceTokens = cursor.splice(0, batchLimit);
                  //   tokenBatches.push(sliceTokens);

                  // }

                  // var sendLimit = tokenBatches.length;

                  // for(var i=0; i<sendLimit; i++){

                  //   var sendIds = new Array();

                  //   for(var j=0; j<tokenBatches[i].length; j++){
                  //     sendIds.push(tokenBatches[i][j].registration_key);
                  //   }
                    
                  //   Sending(sender, message, sendIds, i, batchLimit);
                  // }
              });
             }else{
                  res.status(200).json({"message" : "send_fail"});
              }
           });
          }

    function Sending(sender, message, sendIds, count, limit){
      // console.log(message);
      // console.log(sendIds.length);
      console.log("발송 예정 reg id");
      console.log(sendIds);
      // console.log(sendIds[0]);
      // console.log(sendIds[999]);
      // console.log(sender);
      console.log("\n");

      sender.send(message, sendIds, 4, function (error, result){
        if(error==null){
          //console.log("\n"+"발송 / 발송 reg_id = "+"\n\n"+sendIds+"\n\n");
          console.log(result);  
          //res.status(200).json({"message" : "send_all_complete"});
          // if(count==(limit-1)){
          //   res.status(200).json({"message" : "send_all_complete"});
          // }
        }else{
          console.log(error);
        }
      });
      // send_count++;
      // console.log(send_count);
      sleep(200);
    }

    function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }

    function Batch(start, end, sender, message, limit, application_id, slice){
      
      var temp = connection.query("select id, registration_key from users where application_id=? and id>? limit "+slice+";",[application_id, start]
      ,function(error, cursor){
        //console.log(cursor);
        //console.log(cursor.length);
        var loop = cursor.length;
        console.log("Start id : "+application_id);
        console.log("Limit count : "+slice);
        console.log("쿼리 결과 갯수 "+loop);
        //console.log("\n\n");
        var batchLimit = 1000;
        var tokenBatches = [];
        var next = cursor[loop-1].id;

        for(var start=0; start < loop; start+=batchLimit){

          var sliceTokens = cursor.splice(0, batchLimit);
          tokenBatches.push(sliceTokens);
          //console.log("발송될 토큰들 갯수 : "+tokenBatches.length);
        }

        var sendLimit = tokenBatches.length;
        //console.log("배열 세팅 횟수 : "+sendLimit);

          for(var i=0; i<sendLimit; i++){

            var sendIds = new Array();
            //console.log(sendIds);

            for(var j=0; j<tokenBatches[i].length; j++){
              sendIds.push(tokenBatches[i][j].registration_key);
              // console.log("배열 첫 번째 값 : "+sendIds[0]);
              // console.log("배열 마지막 값 : "+sendIds[999]);
              
            }
            // console.log(sendIds);
            // console.log("1회에 발송될 갯수 : "+sendIds.length);

            //Sending(sender, message, sendIds, end, limit);
            //  sender.send(message, sendIds, 4, function (error, result){
            //   if(error==null){
            //     //console.log("\n"+"발송 / 발송 reg_id = "+"\n\n"+sendIds+"\n\n");
            //     console.log(result);  
            //     //res.status(200).json({"message" : "send_all_complete"});
            //     // if(count==(limit-1)){
            //     //   res.status(200).json({"message" : "send_all_complete"});
            //     // }
            //   }else{
            //     console.log(error);
            //   }
            // });
          }

          if(loop < slice){
            res.status(200).json({"message" : "send_all_complete"});
          }else{
            Batch(next, end, sender, message, limit, application_id, slice);
          }
          // console.log(next);
          //console.log(cursor);
      });
      //return cursor[cursor.length].id;
      //console.log(temp.sql);
      //console.log(next);
     
    }

});

module.exports = router;