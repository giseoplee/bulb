var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var ejs = require('ejs');
var crypto = require('crypto');
var mysql = require('mysql');
var uuid = require('node-uuid');
var router = express.Router();

var connection = mysql.createConnection({
    'host':'bulbcommunocations.cj9khjm7u6ic.ap-northeast-1.rds.amazonaws.com',
    'user':'admin',
    'password':'Bcomms0116!',
    'database':'administrators'
});

router.get('/', function(req, res, next) {

	var context = {};
	context.title = "Login";

	if(req.session.key == undefined){
		req.session.authorized = false;
		res.render('index', context);	
	}else{
		res.render('main/main', {User: req.session.user_name});	
	}
});

router.post('/login', function(req, res, next){

	auth_key = req.body.key1+"Get ouT HackeR GO aWay";

	var encrypt = encryption(auth_key, "Are you done with the report?",'RSA-SHA512');
	encrypt = encryption(encrypt, "I think I like this place.",'RSA-SHA1');
	encrypt = encryption(encrypt, "When do you expect to leave work?",'whirlpool');
	encrypt = encryption(encrypt, "I have something to ask you.",'DSA-SHA');
	encrypt = encryption(encrypt, "Why are you so depressed?",'dsaWithSHA');
	encrypt = encryption(encrypt, "Is it possible that you´re wrong?",'ecdsa-with-SHA1');
	encrypt = encryption(encrypt, "Can you show me the specials?",'ripemd160WithRSA');
	encrypt = encryption(encrypt, "You have an eye for fashion.",'sha512WithRSAEncryption');
	encrypt = encryption(encrypt, "I don't want to be the only oddball.",'RSA-SHA1-2');
	encrypt = encryption(encrypt, "Let's have a heart-to-heart talk!",'RSA-SHA384');

	connection.query("select * from users where authenticationID=?;",
		[req.body.name], function(error, cursor){
			if(cursor.length > 0){
				if(error==null){
					if(cursor[0].password==encrypt){
						if(req.session.key==undefined){
							req.session.key = uuid.v4();
							req.session.authorized = true;
							req.session.user_name = cursor[0].name;
						}
						res.redirect("/main");
					}else{
						res.send("<script>alert('로그인에 실패하였습니다. 아이디, 패스워드를 확인해주세요.'); location.replace('/');</script>");
					}	
				}else{
					res.status(200).json(error);
				}
			}
			else{
				res.send("<script>alert('로그인에 실패하였습니다. 아이디, 패스워드를 확인해주세요.'); location.replace('/');</script>");
			}
		});

	function encryption(auth, key, algorithm){
	    var hash = crypto.createHash(algorithm); 
	    var hashedContent = hash.update(auth+key);
	    hashedContent = hash.digest('hex');
	    return hashedContent;
	}
});

module.exports = router;

