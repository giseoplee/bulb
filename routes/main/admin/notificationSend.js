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
        var registrationIds = [], size=4;
        var token = [];

        connection.query("select registration_key from users where application_id=?;",[cursor[0].application_id]
          ,function(error, cursor){

            for(var i=0; i<cursor.length; i++){
              token[i] = cursor[i].registration_key;
            }
            
            var success_cnt = 0;
            var notification_cnt = Math.ceil(token.length/size);
            var sender_check = 0;
            
            var j = 0;

            while(token.length > 0){
              registrationIds.push(token.splice(0,size));
            }

            for(var k=0; k<registrationIds.length; k++){
              var sendIds = new Array();

              for(var l=0; l<size; l++){
                //sendIds.splice(0,size);
                sendIds.push(registrationIds[k][l]);
                //console.log("\n"+"발송 직전"+"\n\n"+sendIds+"\n\n");
                //console.log("\n"+"발송 전"+"\n\n"+registrationIds[k][l]+"\n\n");

                if(l==(size-1)){
                  //console.log("\n\n 조건 발동 \n\n");
                  sender.send(message, sendIds, 4, function (error, result){
                    

                    if(error==null){
                      // console.log("\n"+"발송 된 값들"+"\n\n"+sendIds+"\n\n");
                      // console.log(result);  
                      sender_check++;
                      
                      if(notification_cnt==sender_check){
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