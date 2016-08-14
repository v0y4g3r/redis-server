var router = require('express').Router();
var utils = require('../utils');

var sjdMember_schema = require('../models/sjd_members');

var errorCode = require('../errors/errorCode');

/**
 * @param {function} thisClient.hset
 */
var thisClient;

/**
 * Handle redis K-V update request
 * //TODO
 * @param {string} request.body.field
 */
router.post('/', function (request, response, next) {
	if (!thisClient) return next(errorCode.EREDISERR);
	if (!request.body) return next(errorCode.ENULLREQ);

	var sjdMemberInstance = utils.partialCast(sjdMember_schema, request.body);//trim useless attr(in case)
	var uid = sjdMemberInstance['uid']; //get mobile phone number
	if (!uid) return response.json(errorCode.ENULLUID);

	thisClient.hmset('sjd_member:' + uid, sjdMemberInstance, (function (uid) {
		return function (err, res) {
			if (err) {
				console.log('Set entry: sjd_member:' + uid + ' error!\n' + err.stack);
				return response.json(errorCode.EREDISERR);
			} else {
				console.log('Set entry sjd_member:' + uid + ' success.');
				response.json(errorCode.SUCCESS);
			}
		}
	})(uid));
});

module.exports = {
	'router': router,
	'setClient': function (inClient) {
		thisClient = inClient;
	}
};