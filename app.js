var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express_session = require('express-session');

var routes = require('./routes/index');
var main = require('./routes/main/main');
var admin_list = require('./routes/main/admin/list');
var notification_enroll = require('./routes/main/admin/enroll');
var push_send = require('./routes/main/admin/send');
var ready_push = require('./routes/main/admin/readyPush');
var notificationEdit = require('./routes/main/admin/notificationEdit');
var notificationSend = require('./routes/main/admin/notificationSend');
var notifySend = require('./routes/main/admin/notifySend');
var test = require('./routes/main/admin/test');
var test1 = require('./routes/main/admin/test1');
var contents = require('./routes/temp/contents');
var thumbnail = require('./routes/temp/thumbnails');
//var test2 = require('./routes/main/admin/test2');
//var push_test = require('./routes/main/admin/push_test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended : false}));
//app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express_session({
  name : 'session_id',
  saveUninitialized  : true,
  secret : 'keyboard cat',
  resave : false,
}));

app.use('/', routes);
app.use('/main', main);
app.use('/main/admin/list', admin_list);
app.use('/main/admin/enroll', notification_enroll);
app.use('/main/admin/send', push_send);
app.use('/main/admin/readyPush', ready_push);
app.use('/main/admin/notificationEdit', notificationEdit);
app.use('/main/admin/notificationSend', notificationSend);
app.use('/main/admin/notifySend', notifySend);
app.use('/main/admin/test', test);
app.use('/main/admin/test1', test1);
app.use('/contents', contents);
app.use('/thumbnails', thumbnail);
//app.use('/main/admin/test2', test2);

//app.use('/main/admin/push_test', push_test);
//app.use('/main/admin/push_test', admin_push);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// server2 git pull test

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
app.listen(3000);