var Server = require('./server');              // Import web of things framework

// Create a node instance and connect to a subsequent Chord node
var server = new Server();

var onmessage = function(payload) {
};

var onstart = function(node) {
    // Chord node ID
    var id = node.id;
    var address = node.address;
    var port = node.port;
};

server.start({
    onstart: onstart,
	onmessage: onmessage,
});
