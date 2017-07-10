var WebSocketClient = require('websocket').client;
var key = process.argv[2];
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

        if (connection.connected) {
            var obj = { key: key };

            console.log('Verifying... ' + JSON.stringify(obj));

            connection.sendUTF(JSON.stringify(obj));
        }
});

//client.connect('ws://wot.city/object/5550937980d51931b3000009/send', '');
client.connect('ws://localhost:8001/object/5550937980d51931b3000009/send', '');









