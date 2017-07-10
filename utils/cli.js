// Import Websocket server
var server = require('./server');

// Application event callbacks
var ondata = function(req, res) {
    var data = req.data;

    console.log('[CLI] verifying key =', data.key);
    res.read(data.key);
};

// Start the server
server.start({
    ondata: ondata,
    join: {
        address: 'localhost',
        port: '8000'
    }
});
