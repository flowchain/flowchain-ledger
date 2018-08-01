// Import Websocket server
var PeerNode = require('../index').PeerNode;
var node = new PeerNode();

// Application event callbacks
var ondata = function(req, res) {
    var data = req.data;

    console.log('[CLI] verifying key =', data.key);
    res.read(data.key);
};

// Start the server
node.start({
    ondata: ondata,
    join: {
        address: 'localhost',
        port: '8000'
    }
});
