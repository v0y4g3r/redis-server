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
  var openid = req.query.openid;
  if (!openid) return next(errorCode.ENULLOID);//query key does not exist

  var getAsyncPromise = thisRedisClient.getAsync('OID_UID:' + openid);//use promise variable to reserve the result of getAsync
  getAsyncPromise.then((uid)=> {
      if (!uid) throw({
        "toClient": true, "body": ((data)=> {
          data.message = "微信ID未绑定！";
          data.status = '200';
          return data
        })(errorCode.ENULLUID)
      });
      return thisRedisClient.hgetallAsync('sjd_member:' + uid);//Query user info by uid
    })
    .then((userInfo)=> {
      if (!userInfo) throw ({"toClient": true, "body": errorCode.ENORES});
      res.json({"status": "1", "info": userInfo});
    })
    .catch((e)=> {
      if (e.toClient) {
        return next(e.body);
      }
      console.log(e.stack);
    });
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
