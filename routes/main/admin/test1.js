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
    connection.query("select * from notifications where id=?;", [req.body.app], function(error, cursor){

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
        //var token = [];

        var tete = connection.query("select id, registration_key from users where application_id=? and id>? limit "+req.body.limit+";",[cursor[0].application_id, req.body.min]
          ,function(error, cursor){

            var next_min = cursor[cursor.length-1].id;
            var loop = cursor.length;
            var batchLimit = 2;
            var tokenBatches = [];

            //console.log(next_min+1);
            // console.log("Start id : "+application_id);
            // console.log("Limit count : "+slice);
            // console.log("쿼리 결과 갯수 "+loop);
            //console.log(cursur[cursor.length-1].id);

            // for(var i=0; i<cursor.length; i++){
            //   token[i] = cursor[i].registration_key;
            // }
            //console.log(token[token.length-1]);
            //console.log(token);
            
            for(var start=0; start < loop; start+=batchLimit){
              var sliceTokens = cursor.splice(0, batchLimit);
              tokenBatches.push(sliceTokens);
              //console.log("발송될 토큰들 갯수 : "+tokenBatches.length);
            }

            //console.log(tokenBatches);

            var sendLimit = tokenBatches.length;

            // for(var i=0; i<sendLimit; i++){

            //   var sendIds = new Array();
            //   //console.log(sendIds);

            //   // for(var j=0; j<tokenBatches[i].length; j++){
            //   //   sendIds.push(tokenBatches[i][j].registration_key);
            //   //   // console.log("배열 첫 번째 값 : "+sendIds[0]);
            //   //   // console.log("배열 마지막 값 : "+sendIds[sendIds.length-1]);
            //   // }
            //   sendIds.push('APA91bHU-fp1KpAwL-m123CcCFFR_OqoT6zaIfeJR7W-idDlVpiT1AztFWagixNIAt-YcYOsKW55N16mk6axpQspMZ_k_XrFWTFtHbA1h1zjUaUH8EaB_GMI7zdcaS-UuoZfn5aX9PTF');
            //   sendIds.push('APA91bGdU3pfYOOt_0gPkUMVROu-IH96FkFIRmcjQSX8gk1Bau1cYAF-dSpumDqQa7LgbS6h4X_NPtXP966C3cIxnwlMVsMO61c66T9cSZKttzNcAcgswszZXodhHc_Yy6x3M8DL6KqD');
            //   sendIds.push('APA91bHAvlVM5M0OSvX3yL-IxAyMbIDB_Zuck0QRpMFwHhH6XbjS3Kh0fS51EbFjlbQqQiL-gBssyP4C45HTEre72u_Tvudgfg3Wd0vYA3UC7g58cNWjto0MzgHw8UGtRYri0bPfJxnV');
            //   sendIds.push('APA91bGkE23mnwtvDWr4wke3J0FkFjM9LOHzj6l6zOfyw7BOUWgo8wFeHeaV2gqR5ftQ-5rtK6K4KsEBrrGdJyX4mMzKc69zUCtWsVQSgTWpwWBUimuLc9Wrh9Jl7VL5IO2DWszCwpOw');
            //   sendIds.push('APA91bFNCfrLVJ4zPw6QUl-vgwDh7g7WFngkRlhTvOwdyyeyQRHsV24OEeip-3qmYNmUwuKfdtuE63Xh_8aSB2h5ykc1ztk5Ep3Kh-j6FRV-QZuFRdRBE-fSmm_SMmeKOCi8xqIkV180');
            //   // console.log("배열 첫 번째 값 : "+sendIds[0]);
            //   // console.log("배열 마지막 값 : "+sendIds[sendIds.length-1]);
            //   console.log(sendIds);
            //   //console.log(sendIds.length);
            //   //console.log("1회에 발송될 갯수 : "+sendIds.length);

            //   // sender.send(message, {sendIds : sendIds}, 4, function (error, result){
            //   //   if(error==null){
            //   //     console.log(result);  
            //   //   }else{
            //   //     console.log(error);
            //   //   }
            //   // });
            // }

            var sendIds = new Array();

            sendIds.push('APA91bHU-fp1KpAwL-m123CcCFFR_OqoT6zaIfeJR7W-idDlVpiT1AztFWagixNIAt-YcYOsKW55N16mk6axpQspMZ_k_XrFWTFtHbA1h1zjUaUH8EaB_GMI7zdcaS-UuoZfn5aX9PTF');
            sendIds.push('APA91bGdU3pfYOOt_0gPkUMVROu-IH96FkFIRmcjQSX8gk1Bau1cYAF-dSpumDqQa7LgbS6h4X_NPtXP966C3cIxnwlMVsMO61c66T9cSZKttzNcAcgswszZXodhHc_Yy6x3M8DL6KqD');
            sendIds.push('APA91bHAvlVM5M0OSvX3yL-IxAyMbIDB_Zuck0QRpMFwHhH6XbjS3Kh0fS51EbFjlbQqQiL-gBssyP4C45HTEre72u_Tvudgfg3Wd0vYA3UC7g58cNWjto0MzgHw8UGtRYri0bPfJxnV');
            sendIds.push('APA91bGkE23mnwtvDWr4wke3J0FkFjM9LOHzj6l6zOfyw7BOUWgo8wFeHeaV2gqR5ftQ-5rtK6K4KsEBrrGdJyX4mMzKc69zUCtWsVQSgTWpwWBUimuLc9Wrh9Jl7VL5IO2DWszCwpOw');
            sendIds.push('APA91bFNCfrLVJ4zPw6QUl-vgwDh7g7WFngkRlhTvOwdyyeyQRHsV24OEeip-3qmYNmUwuKfdtuE63Xh_8aSB2h5ykc1ztk5Ep3Kh-j6FRV-QZuFRdRBE-fSmm_SMmeKOCi8xqIkV180');
            // console.log("배열 첫 번째 값 : "+sendIds[0]);
            // console.log("배열 마지막 값 : "+sendIds[sendIds.length-1]);
            console.log(sendIds);

            sender.send(message, sendIds, 4, function (error, result){
              if(error==null){
                console.log(result);  
              }else{
                console.log(error);
              }
            });

            res.status(200).json({"min" : (next_min+1)});
        });  

        console.log(tete.sql);

      }else{
        res.status(200).json({"message" : "send_fail"});
      }
    });
  }
});



module.exports = router;