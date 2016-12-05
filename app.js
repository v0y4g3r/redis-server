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
var queryController = require('./routes/query');
queryController.setClient(globalRedisClient);//set redis client for query
var registerController = require('./routes/register');
registerController.setClient(globalRedisClient);//set redis client for update
var bindController = require('./routes/bind');
bindController.setClient(globalRedisClient);
var queryByUidController = require('./routes/queryByUid');
queryByUidController.setClient(globalRedisClient);
var listController = require('./routes/list');
listController.setClient(globalRedisClient);
var deleteController = require('./routes/delete');
deleteController.setClient(globalRedisClient);

var app = express();
app.set('env', config.env);

//app.use(logger('dev'));

app.use(bodyParser.urlencoded({
  extended: false
}));

//Route config
app.use('/query', bodyParser.json(), queryController.router);
app.use('/register', bodyParser.json(), registerController.router);
app.use('/bind', bodyParser.json(), bindController.router);
app.use("/queryByUid", queryByUidController.router);
app.use("/list", listController.router);
app.use('/delete', deleteController.router);

// 404 error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  console.log('In 404 handler:' + process.hrtime());
  err.status = 404;
  return next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      "status": err.sign,
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
