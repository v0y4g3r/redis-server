var express = require('express');
var config = require('./config.js');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var colors = require('colors');
//global redis connection

var gloabalRedisClient = require('./redis.js');
var routes = require('./routes/index');
var users = require('./routes/users');
var query = require('./routes/query');
query.setClient(gloabalRedisClient);//set redis client for query
var update = require('./routes/update');
update.setClient(gloabalRedisClient);//set redis client for update

var app = express();
app.set('env', config.env);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
app.use('/query', query.router);
app.use('/update', update.router);

// 404 error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers below
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			code: err.status
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {

		code: err.status,
		error: err.stack
	});
});

module.exports = app;