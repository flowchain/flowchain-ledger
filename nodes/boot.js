var Log = require('../utils/Log');
var TAG = 'Flowchain/Ledger';
var TAG_DB = 'Picodb';

// Import the Flowchain library
var Flowchain = require('../libs');

// Import Websocket server
var server = Flowchain.WoTServer;

// Utils
var crypto = Flowchain.Crypto;

// Database
var Database = Flowchain.DatabaseAdapter;
var db = new Database('picodb');

/**
 * The Application Layer
 */

/**
 * Application event callbacks.
 * I am the successor node of the data.
 */
var onmessage = function(req, res) {
    var submitVirtualBlocks = res.submit;

    var payload = req.payload;
    var block = req.block;
    var node = req.node;

    var data = JSON.parse(payload.data);
    var message = data.message;
    var from = data.from;

    // Key of the data
    var key = message.id;
    // Data
    var tx = message.data;

    // Get a block
    if (!block) {
        Log.i(TAG, 'No blocks now, ignore data.');
        return;
    }

    // Block hash as the secret and data key as the context
    var hash = crypto.createHmac('sha256', block.hash)
                        .update( key )
                        .digest('hex');

    // Generate an asset and send it to the endpoint
    var asset = {
        // Data key
        key: key
    };
    //res.send(asset);

    // Send ACK back
    var ack = {
        key: key,
        status: 'ACK'
    };
    if (node.address !== from.address ||
        node.port !== from.port) {
        node.send(from, ack);
    }

    db.put(hash, tx, function (err) {
        if (err) {
            return Log.e(TAG, 'Ooops! onmessage =', err) // some kind of I/O error
        }

        Log.v(TAG, 'Transactions #' + key + 'found in Block#' + block.no);

        // fetch by key
        db.get(hash, function (err, value) {
            if (err) {
                return Log.e(TAG, 'Ooops! onmessage =', err) // likely the key was not found
            }

            Log.v(TAG, 'Verifying tx =', key);

            res.read(key);
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
var onquery = function(req, res) {
    var tx = req.tx;
    var block = req.block;

    Log.i(TAG, 'verified tx =', tx.key);

    if (!block) return;

    // Block hash as the secret and data key as the context
    var hash = crypto.createHmac('sha256', block.hash)
                        .update( tx.key )
                        .digest('hex');

    db.get(hash, function (err, value) {
        if (err)
            return Log.e(TAG, 'Ooops! onmessage =', err) // likely the key was not found

	if (!value || typeof value !== 'object') {
	    return;
	}

	if (value.length < 1) {
	    return;
	}

        var tx = value[0].tx;

        tx.source = {
            address: req.node.address,
            port: req.node.port
        };

        Log.v(TAG, 'Transaction #' + tx + ' found at Block#' + block.no);
        res.send(tx);
    });
};

/**
 * Application event callbacks.
 * Forward the data over the Chord ring.
 */
var ondata = function(req, res) {
    var data = req.data;
    var put = res.save;

    put(data);
};

function BootNode() {
    this.server = server;
}

/**
 * Submit a transaction to the Flowchain p2p network
 *
 * @param {Object} data
 * @return {Object}
 * @api public
 */
BootNode.prototype.submit = function(data) {
    this.server.save(data);
}

BootNode.prototype.start = function(options) {
    this.server.start({
        onstart: onstart,
        onmessage: onmessage,
        onquery: onquery,
        ondata: ondata
    });
};

if (typeof(module) != "undefined" && typeof(exports) != "undefined") {
    module.exports = BootNode;
}

// Start the server
if (!module.parent) {
    server.start({
        onstart: onstart,
        onmessage: onmessage,
        onquery: onquery,
        ondata: ondata, 
        join: {
            address: process.env['PEER_ADDR'] || 'localhost',
            port: process.env['PEER_PORT'] || '8000'
        }              
    });  
}