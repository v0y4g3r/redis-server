var express = require('express');
var promise = require('bluebird');
var router = promise.promisifyAll(express.Router());

var errorCode = require('../errors/errorCode');
/**
 * @param {function} thisRedisClient.hgetall
 * @param {string} req.body.openid Query string
 */

var thisRedisClient;
router.get('/', function (req, res, next) {
  var uid = req.query.uid;
  if (!uid) return next(errorCode.ENULLUID);

  var result = 0;
  var found = 0;
  var finished = 0;

  //TODO 这里的性能可以继续优化
  thisRedisClient.keys('OID_UID:*', function (err, oiduid) {
    for (var oidIndex in oiduid) {
      var oid = oiduid[oidIndex];
      thisRedisClient.get(oid, function (err, thisUid) {
        finished++;
        if (thisUid == uid) {
          result = oid;
          found = 1;
          res.json({"status": 1, "info": oid});
        }
        if (finished == oiduid.length && found == 0) {
          return next(errorCode.ENORES);
          // res.json({"res": "nores"});
        }
      })
    }
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
