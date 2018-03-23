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

// Application event callbacks
var onmessage = function(req, res) {
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
        console.log('[Blockchain] no usable block now, data is ignored.');
        return;
    }

    // Block hash as the secret and data key as the context
    var hash = crypto.createHmac('sha256', block.hash)
                        .update( key )
                        .digest('hex');

    // Generate an asset
    var asset = {
        // Data key
        key: key
    };

    // Give out the asset
    //res.send(asset);

    // Establish a linked data description
    var device = {
        '@context': [
            'http://w3c.github.io/wot/w3c-wot-td-contxt.jsonld'
        ],
        'name': '',
    };

    db.put(hash, tx, function (err) {
        if (err)
            return console.log('Ooops! onmessage =', err) // some kind of I/O error
        console.log('[Blockchain]', tx, 'is in Block#' + block.no, ', its data key =', key);                

        // fetch by key
        db.get(hash, function (err, value) {
        console.log('[Database] get err =', err);

            if (err)
                return console.log('Ooops! onmessage =', err) // likely the key was not found

            console.log('[Blockchain] verifying tx =', key);

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

    console.log('[Blockchain] verified tx =', tx);

    if (!block) return;

    // Block hash as the secret and data key as the context
    var hash = crypto.createHmac('sha256', block.hash)
                        .update( tx.key )
                        .digest('hex');

    db.get(hash, function (err, value) {
        if (err)
            return console.log('Ooops! onmessage =', err) // likely the key was not found

        var tx = value[0].tx;

        tx.source = {
            address: req.node.address,
            port: req.node.port
        };

        console.log('[Blockchain]', tx, 'is found at Block#' + block.no);
        res.send(tx);
    });
};

// Application event callbacks
var ondata = function(req, res) {
    var data = req.data;
    var put = res.save;

    put(data);
};

function PeerNode() {
    this.server = server;
}

/**
 * Submit a transaction to the Flowchain p2p network
 *
 * @param {Object} data
 * @return {Object}
 * @api public
 */
PeerNode.prototype.submit = function(data) {
    this.server.save(data);
}

/**
 * Create a Flowchain Ledger node
 *
 * @param {Object} options 
 * @return {Object}
 * @api public
 */
PeerNode.prototype.start = function(options) {
    var peerAddr = 'localhost';
    var peerPort = '8000';
    if (!options) options = {};

    if (options.join) {
        peerAddr = options.join.address || peerAddr;
        peerPort = options.join.port || peerPort;
    }

    this.server.start({
        onstart: options.onstart || onstart,
        onmessage: options.onmessage || onmessage,
        onquery: options.onquery || onquery,
        ondata: options.ondata || ondata,
        join: {
            address: process.env['PEER_ADDR'] || peerAddr,
            port: process.env['PEER_PORT'] || peerPort
        }
    });
};

if (typeof(module) != "undefined" && typeof(exports) != "undefined")
    module.exports = PeerNode;

// Start the server
if (!module.parent)
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
