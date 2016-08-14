var pool = require('./mysql-pool');
pool.acquire(function (err, client) {
	if (err) {
		console.log('Get MySQL client from pool failed!');
		console.log(err.stack);
	}
	client.query('SELECT * FROM sjd_ucenter_member limit 10;', function (err, data) {
		console.log(data);
		pool.release(client);
	});
})
pool.drain(function () {
	pool.destroyAllNow();
})