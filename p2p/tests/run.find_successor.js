var to = { address: '127.0.0.1', port: 8000 };
var message = { type: 2, id: '2e9c3bbeb0827d26dd121d014fa34e73' };

var util = require('util');
var WebSocketClient = require('websocket').client;
var hash = require('../libs/utils').hash;
var uuid = require('uuid');

var client = new WebSocketClient();

client.on('connect', function(connection) {
	var payload = {
		to: to.id,
		message: message,
		from: {
			address: '127.0.0.1',
			port: 8001,
			id: message.id
		}		
	};

    if (connection.connected) {
        connection.sendUTF(JSON.stringify(payload));
    }

    process.exit(0);
});

var uri = util.format('ws://%s:%s/node/%s/receive', to.address, to.port, message.id)

console.log(uri);
client.connect(uri, '');

