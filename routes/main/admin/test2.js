var express = require('express');
var session = require('express-session');
var gcm = require('node-gcm');
var router = express.Router();

// create a message with default values
var message = new gcm.Message();

// or with object values
var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
         no : "1",
         code : "1", // 이미지 플래그 { 1 : 앱 실행 / 4 : 구글 아이콘}
         title : "추운날에는 집에서 나만의 실험실!!",
         msg : "힌트 받고 실험을 더 신나게 해보세요!",
         ticker : "힌트받고 게임 즐기세요!",
         url : "http://www.naver.com"
    }
});

var server_access_key =  'AIzaSyBJ2X4eC4i66kTHHG8ymmC3Ffq_KDCk5kM'; // 신버전
//var server_access_key = 'AIzaSyDa1JpGKQZYNvecZzUe3PEcZ4mQqAKzjv0'; // 구버전
var sender = new gcm.Sender(server_access_key);
var registrationIds = [];

// var registration_id = '안드로이드 registration_id 값';
// registrationIds.push(registration_id);

registrationIds.push('APA91bHU-fp1KpAwL-m123CcCFFR_OqoT6zaIfeJR7W-idDlVpiT1AztFWagixNIAt-YcYOsKW55N16mk6axpQspMZ_k_XrFWTFtHbA1h1zjUaUH8EaB_GMI7zdcaS-UuoZfn5aX9PTF');
registrationIds.push('APA91bGdU3pfYOOt_0gPkUMVROu-IH96FkFIRmcjQSX8gk1Bau1cYAF-dSpumDqQa7LgbS6h4X_NPtXP966C3cIxnwlMVsMO61c66T9cSZKttzNcAcgswszZXodhHc_Yy6x3M8DL6KqD');
registrationIds.push('APA91bHAvlVM5M0OSvX3yL-IxAyMbIDB_Zuck0QRpMFwHhH6XbjS3Kh0fS51EbFjlbQqQiL-gBssyP4C45HTEre72u_Tvudgfg3Wd0vYA3UC7g58cNWjto0MzgHw8UGtRYri0bPfJxnV');
registrationIds.push('APA91bGkE23mnwtvDWr4wke3J0FkFjM9LOHzj6l6zOfyw7BOUWgo8wFeHeaV2gqR5ftQ-5rtK6K4KsEBrrGdJyX4mMzKc69zUCtWsVQSgTWpwWBUimuLc9Wrh9Jl7VL5IO2DWszCwpOw');
registrationIds.push('APA91bFNCfrLVJ4zPw6QUl-vgwDh7g7WFngkRlhTvOwdyyeyQRHsV24OEeip-3qmYNmUwuKfdtuE63Xh_8aSB2h5ykc1ztk5Ep3Kh-j6FRV-QZuFRdRBE-fSmm_SMmeKOCi8xqIkV180');
registrationIds.push('eVEXz_3hKrg:APA91bHCf0yg2ehYf9WPYZpW-imJI_qnD0FAYrFouJ9L-YTVfCNd8hByqJE4fpoLagdgYgfRHSteFaNWpd38bfrPiygKDB_fLboFNdewJkpZp0tTWpOuRPltm62wxUz8oTZCoDqOZz4N');


sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
});

module.exports = router;