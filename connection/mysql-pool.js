// Create a MySQL connection pool with
// a max of 10 connections, a min of 2, and a 30 second max idle time
var Pool = require('../node_modules/generic-pool').Pool;
var mysql = require('mysql'); // v2.10.x
var Promise = require('bluebird');
Promise.promisifyAll(Pool.prototype);

var pool = new Pool({
	name: 'mysql',
	create: function (callback) {
		var c = mysql.createConnection(require('../config.js').mysql);
		// parameter order: err, resource
		callback(null, c);
	},
	destroy: function (client) {
		client.end();
	},
	max: 100,
	// optional. if you set this, make sure to drain() (see step 3)
	min: 10,
	// specifies how long a resource can stay idle in pool before being removed
	idleTimeoutMillis: 300000,
	// if true, logs via console.log - can also be a function
	// log: true
	log: false
});

pool.destroy = Pool.prototype.destroy;
pool.acquire = Pool.prototype.acquire;
pool.borrow = Pool.prototype.borrow;
pool.release = Pool.prototype.release;
pool.returnToPool = Pool.prototype.returnToPool;
pool.drain = Pool.prototype.drain;
pool.destroyAllNow = Pool.prototype.destroyAllNow;
pool.pooled = Pool.prototype.pooled;
pool.getPoolSize = Pool.prototype.getPoolSize;
pool.getName = Pool.prototype.getName;
pool.availableObjectsCount = Pool.prototype.availableObjectsCount;
pool.inUseObjectsCount = Pool.prototype.inUseObjectsCount;
pool.waitingClientsCount = Pool.prototype.waitingClientsCount;
pool.getMaxPoolSize = Pool.prototype.getMaxPoolSize;
pool.getMinPoolSize = Pool.prototype.getMinPoolSize;

exports = module.exports = pool;