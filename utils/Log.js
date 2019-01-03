var moment = require('moment');
var chalk = require('chalk');
var fs = require('fs');
var util = require('util');

var config = JSON.parse( fs.readFileSync(__dirname + '/../package.json') );

/**
 * Log utils
 */
var TAG = 'Flowchain/IPFS';

var getTimeStamp = function(tag) {
    var ts = moment().toISOString();
    var _ts = ts.split(/[T:\.Z]/); // [ '2018-06-24', '03', '55', '14', '303', '' ]    

    return (chalk.grey('[') + chalk.green(tag + '') + ' '
            + chalk.red(
            	_ts[1] + ':' +
            	_ts[2] + ':' +
            	_ts[3])
            + chalk.grey(']'));
}; 

var spread_join = function(msg, ...argv) {
	var result;

	if (typeof msg === 'string') {
		result = msg;
	}

	if (typeof argv === 'object') {
		result = result + ' ' + argv.join(' ');
	}

	return result;
};

var LOGI = function(tag = TAG, msg, ...argv) {
	console.log(getTimeStamp(tag), spread_join(msg, argv));
};

var LOGE = function(tag = TAG, msg, ...argv) {
	console.log(getTimeStamp('Error'), spread_join(tag + '/' + msg, argv));
};

var LOGV = function(tag = TAG, msg, ...argv) {
	console.log(getTimeStamp('Verbose'), spread_join(tag + '/' + msg, argv));
};

console.info = function(tag = TAG, msg, ...argv) {
	if (typeof msg === 'undefined') {
		msg = tag;
		tag = util.format('%s %s', config.name, config.version);
	}
	
	return LOGI(tag, msg, ...argv);
};

console.debug = function(tag = TAG, msg, ...argv) {
	if (typeof msg === 'undefined') {
		msg = tag;
		tag = util.format('%s %s', config.name, config.version);
	}
	
	return LOGV(tag, msg, ...argv);
};

module.exports = {
    i: LOGI,
    e: LOGE,
    v: LOGV
};
