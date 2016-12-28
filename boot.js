// Import Websocket server
var server = require('./server');

// Utils
var crypto = require('crypto');

// Database
var Database = require('./database');
var db = new Database('nedb');

// Application event callbacks
var onmessage = function(payload, block) {
    var data = JSON.parse(payload.data);
    var message = data.message;
    var from = data.from;

    // Key of the data
    var key = message.id;
    // Data
    var tx = message.data;

    // Get a block
    if (!block) {
        console.log('[Blockchain] no usable block now, data is ignored.');
        return;
    }

    // Block hash as the secret and data key as the context
    var hash = crypto.createHmac('sha256', block.hash)
                        .update( key )
                        .digest('hex');

    db.put(hash, tx, function (err) {
        if (err)
            return console.log('Ooops! onmessage =', err) // some kind of I/O error

        // fetch by key
        db.get(hash, function (err, value) {
            if (err)
                return console.log('Ooops! onmessage =', err) // likely the key was not found

            console.log('[Blockchain]', value, 'is in Block#' + block.no, ', its data key =', key);
        });
    });
};

// Application event callbacks
var onstart = function(req, res) {
    // Chord node ID
    var id = req.node.id;
    var address = req.node.address;
};

// Application event callbacks
var onquery = function(key, block) {
    if (!block) return;

    // Block hash as the secret and data key as the context
    var hash = crypto.createHmac('sha256', block.hash)
                        .update( key )
                        .digest('hex');

};

// Application event callbacks
var ondata = function(req, res) {
    var data = req.data;
    var put = res.save;

    put(data);
};

// Start the server
server.start({
    onstart: onstart,
	onmessage: onmessage,
    onquery: onquery,
    ondata: ondata
});
