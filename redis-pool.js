//var redis = require('redis'),
//	Pool = require('generic-pool').Pool;
//
//var config = require('./config.js');
//
//
//var RedisPool = {
//	// Acquire resource.
//	//
//	// - `database` {String} redis database name
//	// - `callback` {Function} callback to call once acquired. Takes the form
//	//   `callback(err, resource)`
//	acquire: function(database, callback) {
//		if (!this.pools[database]) {
//			this.pools[database] = this.makePool(database);
//		}
//
//		console.log(this.pools)
//		console.log(this.pools[database]);
//
//		this.pools[database].acquire(function(resource) {
//			callback(resource);
//		});
//	},
//
//	// Release resource.
//	//
//	// - `database` {String} redis database name
//	// - `resource` {Object} resource object to release
//	release: function(database, resource) {
//		this.pools[database] && this.pools[database].release(resource);
//	},
//
//	// Cache of pools by database name.
//	pools: {},
//
//	// Factory for pool objects.
//	makePool: function(database) {
//		return Pool({
//			name: database,
//			create: function(callback) {
//				var client = redis.createClient(config.redis);
//				client.on('connect', function() {
//					client.send_anyway = true;
//					client.select(database);
//					client.send_anyway = false;
//				});
//				return callback(client);
//			},
//			destroy: function(client) {
//				return client.quit();
//			},
//			max: 50,
//			idleTimeoutMillis: 10000,
//			reapIntervalMillis: 1000,
//			log: false
//		});
//	}
//}
//
//
//module.exports = RedisPool;