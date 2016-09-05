/**
 * Created by lei on 16-8-12.
 *
 * Request example:
 * {
 * 	'openid'	:	'123',
 * 	'uid'			:	'456'
 * }
 */
var express = require('express');
var router = express.Router();
var thisClient;
var mysqlClientPool = require('../connection/mysql-pool');
var Promise = require('bluebird');

var errorCode = require('../errors/errorCode');
//Handle Weixin bind request
router.post('/', function (req, response, next) {
	/**
	 * @param {String} req.body.openid Query string
	 */
	var openid = req.body.openid;
	var uid = req.body.uid;
	if (!openid) return next(errorCode.ENULLOID);
	if (!uid) return next(errorCode.ENULLUID);
	thisClient.setnxAsync('OID_UID:' + openid, uid)
		.then((res)=> {
			if (res == '0') { //entry exists
				throw  {"toClient": true, "body": errorCode.EOIDEXISTS};
			}
			else {//manually promisification
				mysqlClientPool.acquireAsync = Promise.promisify(Object.getPrototypeOf(mysqlClientPool).acquire);
				return mysqlClientPool.acquireAsync();
			}
		})
		.then((mysqlClient)=> {
			mysqlClient.queryAsync = Promise.promisify(Object.getPrototypeOf(mysqlClient).query);
			var sql = 'INSERT INTO sjd_oid_uid(oid,uid) VALUES(\'' + openid + '\',\'' + uid + '\');';
			return mysqlClient.queryAsync(sql);//execute insert to MySQL
		})
		.then((res)=> {
			return next(errorCode.SUCCESS);
		})
		.catch(ER_DUP_ENTRY=> {//if duplicate UNIQUE INDEX found when inserting into mysql
			return next(errorCode.EOIDEXISTS);//TODO 回滚Redis中的插入
		})
		.catch((e)=> {//handle all errors during the redis and mysql ops
			if (e.toClient)  return next(e.body);//if the message is sent to client
			else {
				console.log(e.stack);
				return next({"status":"500","message":"EINTERNAL"})

			}
		});
});

module.exports = {
	'router': router,
	'setClient': function (inClient) {
		thisClient = inClient;
	}
};
