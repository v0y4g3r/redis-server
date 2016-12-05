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

/**
 * This is a very awkward solution due to redis is pure K-V based;
 * First we use redis 'keys' method to get all keys start with 'OID_UID',
 * then use eventproxy to query the corresponding values, and compare the values(uids)
 * to find one that matches user query.
 */
router.get('/', function (request, response, next) {
  var uid = request.query.uid;
  if (!uid) return next(errorCode.ENULLUID);

  // var startTime = process.hrtime();
  thisRedisClient.keys('OID_UID:*', function (err, oiduids) {
    if (err) return next(errorCode.ENORES);

    //register handler when all queries finished
    ep.after('E_QUERYFIN', oiduids.length, function (pairs) {
      //now got all the uid
      if (!pairs) return next({"sign": "0", "message": "数据为空", "status": "404"});
      var length = pairs.length;
      var count = 0;
      pairs.forEach(function (item) {
        count++;
        if (item.uid == uid) {
          // var timeDiff = process.hrtime(startTime);
          // console.log((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6 + " ms elapsed..");
          var result = item.oid;
          response.json({status: 1, info: result});
        } else if (count == length) {
          return next(errorCode.ENORES);
        }
      })
    })

    //map the query action to all array members
    oiduids.map(function (oid) {
      thisRedisClient.get(oid, function (err, uid) {
        var res = {'oid': oid, 'uid': uid};
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
