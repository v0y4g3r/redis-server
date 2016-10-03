var promise = require('bluebird');

var redis = require('redis');
promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

// var redisPool = require('./redis-pool.js');
var logdate = require('./../logdate.js');
var config = require('./../config.js');
var client = redis.createClient(config.redis);

client.on('connect', function () {
  logdate('Redis connected');
  client.auth(config.redisPasscode, function (err) {
    if (err) {
      console.log("Redis auth error!")
    } else {
      console.log("Redis auth ok!")
    }
  })
  // console.log('' + new Date().toString().green + ' Redis connected');
})

client.on('error', function (error) {
  logdate('Redis client error:\n' + error.stack);
  // console.log('Redis client error!:\n ' + error.stack());
});

// client.del = RedisClient.del;
// client.hmset=RedisClient.hmset;
//TODO is there any better solution to timeout error?
setInterval(function () {
  console.log('\n' + new Date().toString().green + ' Redis heart-beat');
  client.set('redis-keepalive', '1');
}, 60 * 1000);

client.setnxAsync = redis.RedisClient.prototype.setnxAsync;//promisified setnx method
client.getAsync = redis.RedisClient.prototype.getAsync;
client.hgetallAsync = redis.RedisClient.prototype.hgetallAsync;
// function deleteKeys(pattern) {
// 	client.keysAsync(pattern)
// 		.then((data)=> {
// 			data.map((e)=> {
// 				client.delAsync(e)
// 					.then((res)=> {
// 						if (res != '1') return console.log('delete key: ' + e + 'error');
// 						else console.log('done delete key: ' + e)
// 					})
// 			});
// 		})
// }
// deleteKeys('*');

//export redis connection
module.exports = client;