var router = require('express').Router();

/**
 * @param {function} thisClient.hset
 */
var thisClient;

/**
 * Handle redis K-V update request
 * @param {string} request.body.field
 */
router.post('/', function (request, response, next) {
	if (!thisClient) return next({'message': 'ESERVERERR', 'status': 500});
	if (!request.body.k) return next({'meesage': 'ENULLKEY', 'status': 404});

	var key = request.body.k;		//key
	var field = request.body.field;
	var value = request.body.v;	//value

	thisClient.hset(key, field, value, function (err, data) {
		if (err) return next({'message': 'ESERVERERR', 'status': 500});
		response.json({'RES': data, 'NOTE': '0:OVERRIDE,1:CREATE'});
	});
});

module.exports = {
	'router': router,
	'setClient': function (inClient) {
		thisClient = inClient;
	}
}