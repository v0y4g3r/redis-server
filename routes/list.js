/**
 *
 * Created by lei on 16-12-4.
 */

var express = require('express');
var promise = require('bluebird');
var router = promise.promisifyAll(express.Router());
var EventProxy = require('eventproxy');
var ep = new EventProxy();

var errorCode = require('../errors/errorCode');
/**
 * @param {function} thisRedisClient.hgetall
 * @param {string} req.body.openid Query string
 */

var thisRedisClient;

router.get('/', function (request, response, next) {
  var pattern = request.query.pattern;
  if (!pattern) return next(errorCode.ENULLUID);

  thisRedisClient.keys(pattern, function (err, result) {
    if (err) return next(errorCode.EINTERNAL);

  })
})

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

