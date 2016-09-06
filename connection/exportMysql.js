var mysql = require('mysql');
var redisClient = require('./redis.js');
var sjd_member_DEF = require('./../models/sjd_members.js');
var sjd_ucenter_member_DEF = require('./../models/sjd_ucenter_member.js');
// var mysqlClient = mysql.createConnection(require('./../config.js').mysql);
var pool = require('./mysql-pool.js');

pool.acquire(function (err, mysqlClient) {
	/**
	 * Make an array like [k1,v1,k1,v2...]
	 * @param {Array} key
	 * @param {Array} value
	 */
	function crossMerge(key, value) {
		//if (key.length != value.length) return null;//Length mismatch
		var res = new Array();
		var thisIndex = 0;
		for (var i = 0; i < key.length; i++) {
			res[thisIndex++] = key[i];
			res[thisIndex++] = value[key[i]] ? value[key[i]].toString() : '';
		}
		return res;
	}

	/**
	 * This stores the names/schema definition files/primary keys of MySQL tables that needs to export to redis
	 * @type {*[]}
	 */
	var mysqlTables = [
		{
			'name': 'sjd_member',			// the table name in mysql
			'schema': sjd_member_DEF,	// the schema definition
			'prikey': 'uid'						// the primary key to store in redis
		},
		{
			'name': 'sjd_ucenter_member',
			'schema': sjd_ucenter_member_DEF,
			'prikey': 'id'
		}];

	mysqlTables.forEach(function (table) {
		mysqlClient.query('SELECT * FROM  ' + table.name + ';',
			function (err, rows, fields) {
				if (err) throw err;
				for (var rowIndex in rows) {
					var id = rows[rowIndex][table.prikey];
					var hashkey = table.name + ':' + id;
					var kvArray = crossMerge(table.schema, rows[rowIndex]);
					redisClient.hmset(hashkey, kvArray, (function (hashkey) {
						return function (err, data) {
							if (err) return console.log('Set ' + hashkey + ' err\n' + err.stack);
							// console.log('Done set ' + hashkey);
						}
					})(hashkey));
				}
			});
	});

	setTimeout(function () {
		pool.release(mysqlClient);
		pool.drain(function () {
			console.log('Destroying all pool objects!'.red)
			pool.destroyAllNow();
		})
	}, 1000);
})

