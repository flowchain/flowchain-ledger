var Server = require('./server');

// Create a node instance and connect to a subsequent Chord node
var server = new Server();

var onmessage = function(payload) {
    // Store *payload* to block
};

var onstart = function(req, res) {
    // Chord node ID
    var id = req.node.id;
    var address = req.node.address;
    var port = req.node.port;

    setTimeout(function() {
        res.save('hello from node1');
    }, 5000);
};

server.start({
    onstart: onstart,
	onmessage: onmessage,
	join: {
		address: 'localhost',
		port: 8000
	}	
});