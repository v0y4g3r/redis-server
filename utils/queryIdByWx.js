#! /usr/local/bin/node
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
      console.log("Redis auth error!");
      return;
    }
    process.stdin.setEncoding('utf8');
    process.stdin.on("data", ()=> {
      var input = process.stdin.read().toString().trim().split(' ');
      if (!input) {
        console.err("Please input commmand!")
      }
      var cmd = input[0];
      var params = input.slice(1);

      switch (cmd) {
        case "del": {
          client.del(params[0], function (err, data) {
            if (err) console.log("Error while deleting key: " + params[0])
            else console.log(data)
          })
          break;
        }

        case "q": {
          client.keys(params[0], function (err, data) {
            console.log(data)
          })
          break;
        }

        default:
          console.error("No such command!")
      }

      //resume command line input
      process.stdin.resume();
    })
  })
})

function deleteByUid(client, uid) {
  // client.del(uid)
  process.stdout.write(uid);
  console.log(uid)
}

// process.stdin.on('end', () => {
//   process.stdout.write('end');
// });