var redis = require('redis');
// var redisPool = require('./redis-pool.js');
var logdate = require('./logdate.js');
var config = require('./config.js');
var client = redis.createClient(config.redis);

client.on('connect', function () {
	logdate('Redis connected');
	// console.log('' + new Date().toString().green + ' Redis connected');
})

client.on('error', function (error) {
	logdate('Redis client error:\n' + error.stack);
	// console.log('Redis client error!:\n ' + error.stack());
});

 setInterval(function() {
	 console.log('\n' + new Date().toString().green + ' Redis hreart-beat');
	 client.set('redis-keepalive', '1');
 }, 60 * 1000);

//export redis connection
module.exports = client;