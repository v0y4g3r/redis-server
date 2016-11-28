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
  var uid = request.query.uid;
  if (!uid) return next(errorCode.ENULLUID);

  thisRedisClient.keys('OID_UID:*', function (err, oiduid) {
    if (err) return next(errorCode.ENORES);

    //register all-query-finished handler
    ep.after('E_QUERYFIN', oiduid.length, function (uids) {
      response.json(uids);
    })

    //map the query action to all array members
    oiduid.map(function (oid) {
      thisRedisClient.get(oid, function (err, res) {
        ep.emit('E_QUERYFIN', res);
      })
    })
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
