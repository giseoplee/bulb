var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
    'host':'bulbcommunocations.cj9khjm7u6ic.ap-northeast-1.rds.amazonaws.com',
    'user':'admin',
    'password':'Bcomms0116!',
    'database':'services'
});

router.get('/', function(req, res, next) {
	if(!req.session.authorized){
		res.redirect("/");
	}else{
		
		query = connection.query("select app.id, app.name, count(user.id) as count "+
							"from applications as app inner join users as user on user.application_id=app.id "+ 
								"where app.id=user.application_id group by app.id;", function(error, cursor){

			if(error==null){
				res.render('main/admin/enroll', {rows : cursor});						
			}else{
				res.status(503).json(error);
			}
		});
	}
});

module.exports = router;