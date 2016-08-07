var express = require('express');
var router = express.Router()
var colors = require('colors');
var urlPaser = require('url');
var logdate = require('../logdate.js');


/**
 * @param {function} thisRedisClient.hgetall
 */
var thisRedisClient;

/**
 * @param {function} router.post
 * @param {function} router.get
 */
router.get('/', function (request, response, next) {
	logdate(' Reqeust from: ' + request.connection.remoteAddress + ' for ' + request.originalUrl);
	var queryKey = request.query.q;
	if (!queryKey) return next({'message': 'ENULLKEY', 'status': '404'});//query key does not exist
	thisRedisClient.hgetall(queryKey, function (err, data) {
		if (err) {
			return next({	//error occured
				'message': 'EQUERYERR',
				'status': 500
			});
		} else {//Hit the cache
			if (data) response.json({
				'hit': 1,
				'data': (function (data) {if (data.password) data.password = '';return data;})(data)//mask password? TODO
			});
			else	//no result
				return next({
					'message': 'ENORES',
					'status': 404
				});
		}
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
}