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
    var query = "select push.id, app.name, push.send_count, push.image_flag, push.checked, push.title, push.description, push.url, push.param1, push.param2 from notifications as push inner join applications as app on app.id=push.application_id order by id desc;";
    connection.query(query, function(error, cursor){
      if(error==null){
        res.render('main/admin/send', {rows : cursor});           
      }else{
        res.status(503).json(error);
      }
    });
  }
});

module.exports = router;