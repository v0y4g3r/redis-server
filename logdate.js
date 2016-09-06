var colors=require('colors');
module.exports = function(str) {
	return (typeof str != 'string') ? null : console.log('' + new Date().toString()['green'] + ': ' + str);
}