var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = express.Router();

router.get('/', function(req, res, next) {
	if(!req.session.authorized){
		res.redirect("/");
	}else if(req.session.authorized && req.session.user_name){
		res.render('main/main', { User: req.session.user_name });		
	}else{
		res.status(503).json({"Message" : "Forbidden"})
	}
});

module.exports = router;