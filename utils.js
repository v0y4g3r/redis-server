var sjd_member_def = require('./models/sjd_members');
var sjd_ucenter_member_def = require('./models/sjd_ucenter_member');


/**
 * Convert an object to target schema.
 * If the schema defined an atribute that the obj doesn't have, then the attr will be set tp undefined.
 * If the obj has an attr that tarhet schema didn't define, that attr will be disposed;
 * @param {Object} targetSchema
 * @param obj
 */
function partialCast(targetSchema, obj) {
	var res = {};
	for (var index in targetSchema) {
		var attr = targetSchema[index];
		res[attr] = obj[attr] ? obj[attr] : '';//if obj[attr] exists, return it, otherwise return empty string
	}
	return res;
}

/**
 * Return an array with all the duplicate elements of the input array removed.
 * @param array
 * @returns {Array}
 */
function unique(array) {
	if (typeof array != 'object') {
		throw new TypeError('Param must be an array!');
	} else {
		var res = [];
		var hash = {};
		array.forEach(function (e) {
			if (!hash[e]) {//if not previously defined
				hash[e] = true;
				res.push(e);
			}
		});
		return res;
	}
}

/**
 * Convert {k:v,...} object to array like [k,v,...]
 * @param obj
 * @returns {Array}
 */
function flatten(obj) {
	var res = [];
	for (var e in obj) {
		res.push(e);
		res.push(obj[e] ? obj[e] : '');
	}
	return res;
}

module.exports = {
	"partialCast": partialCast,
	"unique": unique,
	"flatten": flatten
};