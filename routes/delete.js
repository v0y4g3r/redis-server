/**
 *
 * Created by lei on 16-12-5.
 */

var express = require('express');
var promise = require('bluebird');
var router = promise.promisifyAll(express.Router());
var EventProxy = require('eventproxy');
var ep = new EventProxy();

var config = require('../config');
var errorCode = require('../errors/errorCode');
/**
 * @param {function} thisRedisClient.hgetall
 * @param {string} req.body.openid Query string
 */

var thisRedisClient;

router.get('/', function (request, response, next) {
  var passcode = request.query.passcode;
  if (passcode != config.authCode) {
    return next(errorCode.EAUTHFAILED);
  }

  var pattern = request.query.pattern;
  if (!pattern) return next(errorCode.ENORES);

  thisRedisClient.delAsync(pattern)
    .then(function (results) {
      if (results == 1) {
        response.json({'status': '1', 'info': 'OK'});
      } else {
        response.json({'status': '0', 'info': '键不存在'});
      }
    })
});

/**
 *
 * @type {{router: *, setClient: module.exports.setClient}}
 */
module.exports = {
  'router': router,
  setClient: function (inClient) {
    thisRedisClient = inClient;
  }
};

