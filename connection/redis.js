var promise = require('bluebird');

var redis = require('redis');
promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

var logdate = require('./../logdate.js');
var config = require('./../config.js');


var client = connectToRedis();

client.on('error', function (error) {
  logdate('Redis client error:\n' + error.stack);
  logdate('Retrying connect to redis server...\n');
  connectToRedis(client);
});

function connectToRedis() {
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
  })
  return client;
}

//TODO is there any better solution to timeout error?
// setInterval(function () {
//   console.log('\n' + new Date().toString().green + ' Redis heart-beat');
//   client.set('redis-keepalive', '1');
// }, 60 * 1000);

setInterval(function () {
  client.ping();
  logdate('Keepalive ping sent...'.yellow)
}, 1000 * 60 * 3);


client.setnxAsync = redis.RedisClient.prototype.setnxAsync;//promisified setnx method
client.getAsync = redis.RedisClient.prototype.getAsync;
client.hgetallAsync = redis.RedisClient.prototype.hgetallAsync;

//export redis connection
module.exports = client;