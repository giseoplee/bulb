var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var router = express.Router();

router.get('/', function(req, res, next) {
	if(!req.session.authorized){
		res.redirect("/");
	}else{

		var connection = mysql.createConnection({
		    'host':'bulbcommunocations.cj9khjm7u6ic.ap-northeast-1.rds.amazonaws.com',
		    'user':'admin',
		    'password':'Bcomms0116!',
		    'database':'services'
		});

		connection.query("select id, name, version, memo from applications;", function(error, cursor){
			if(error==null){
				res.render('main/admin/list', {rows : cursor});				
			}else{
				res.status(503).json({"message":"Fail"});
			}
		});
	}
});

module.exports = router;