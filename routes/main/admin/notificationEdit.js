var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var date = require('date-utils');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
    'host':'bulbcommunocations.cj9khjm7u6ic.ap-northeast-1.rds.amazonaws.com',
    'user':'admin',
    'password':'Bcomms0116!',
    'database':'services'
});

if(insert_date){
	insert_date = "";
}else{
	var date_instance = new Date();
	var insert_date = date_instance.toFormat("YYYY-MM-DD HH24:MI:SS");	
}

router.post('/', function(req, res, next) {

	var context = {};
	context.title = "Login";

	if(req.session.key == undefined){
		req.session.authorized = false;
		res.render('index', context); 
	}else{
		console.log(insert_date);
	 	var query = "update notifications set title=?, description=?, url=?, param1=?, param2=?, updated_at=? where id=?;";
	 	var test = connection.query(query, 
	 		[req.body.title, req.body.description, req.body.url, req.body.param1, req.body.param2, insert_date, req.body.no],
	 			function(error, cursor){
		 			if(error==null){
		 				res.status(200).json({"message" : "success"});
		 			}else{
		 				res.status(200).json({"message" : "edit_fail"});
		 			}
	 	});console.log(test);
	}
});

module.exports = router;