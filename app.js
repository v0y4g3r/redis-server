var express = require('express');
var config = require('./config.js');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var colors = require('colors');
var errorCode = require('./errors/errorCode');

//global redis connection
var globalRedisClient = require('./connection/redis.js');

//Init router/controller and there redis connection
var query = require('./routes/query');
query.setClient(globalRedisClient);//set redis client for query
var register = require('./routes/register');
register.setClient(globalRedisClient);//set redis client for update
var bind = require('./routes/bind');
bind.setClient(globalRedisClient);

var app = express();
app.set('env', config.env);

app.use(logger('dev'));

app.use(bodyParser.urlencoded({
	extended: false
}));

//Route config
app.use('/query', bodyParser.json(), query.router);
app.use('/register', bodyParser.json(), register.router);
// app.use('/register', register.router);
app.use('/bind', bodyParser.json(), bind.router);

// 404 error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	console.log('In 404 handler:' + process.hrtime())
	err.status = 404;
	return next(err);
});

if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			"status": err.status < 400 ? '1' : '0',
			"info": err.message
		});
	});
} else {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.json('error', {
			code: err.status,
			message: err.stack
		});
	});
}

module.exports = app;
