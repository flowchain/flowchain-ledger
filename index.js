// Import Websocket server
var server = require('./server');

// Application event callbacks
var onmessage = function(payload) {
    var data = JSON.parse(payload.data);
    var message = data.message;
    var from = data.from;

    // Key of the data
    var key = message.id;
    // Data
    var tx = message.data;

    console.log('onmessage:', message);
};

// Application event callbacks
var onstart = function(req, res) {
    // Chord node ID
    var id = req.node.id;
    var address = req.node.address;
    var port = req.node.port;

    setTimeout(function() {
        res.save('hello');
    }, 5000);
};

// Start the server
server.start({
    onstart: onstart,
	onmessage: onmessage,
});
