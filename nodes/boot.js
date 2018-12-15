var Log = require('../utils/Log');
var TAG = 'Flowchain/Ledger';
var TAG_DB = 'Picodb';
var TAG_QUERY = 'Flowchain/Ledger/Query';

// Chord protocols
var Chord = require('../p2p/libs/message');

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
 * The `onmessage` callback. Handling Chord messages
 * which is assigned/forwarded to this node.
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Boolean}
 */
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
        Log.i(TAG, 'No virtual blocks now, ignore #' + key);
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

    // Send ACK back
    /*
    var ack = {
        key: key,
        status: 'ACK'
    };

    if (node.address !== from.address ||
        node.port !== from.port) {
        node.send(from, ack);
    }
    */

    db.put(hash, tx, function (err) {
        if (err) {
            return Log.e(TAG, 'Ooops! onmessage =', err) // some kind of I/O error
        }

        Log.v(TAG, 'Transactions #' + key + ' found in Block#' + block.no);

        // Submit data transactions to the p2p network.
        // The data is sent via our virtual blocks (the local blockchains) to 
        // hybrid node for consensus and verfication.
        // The boot node is a hybrid node.
        node.submitVirtualBlocks([{
            height: block.no,
            merkleRoot: hash,
            miner: {
                id: node.id,
                // add lambda and puzzle solutions
            }
        }]);

        Log.v(TAG, 'Submit virtual blocks #' + hash);                

        // Get the IPFS hash (filename)
        /*var ipfsVideoHash = ipfs.add(tx
            , function(err, res) {
              if (err) {
                Log.i(TAG_IPFS, 'Error: ' + err);
                return;
              }
              var hash = res[0].hash;
              var size = res[0].size;

              Log.i(TAG_IPFS, 'IPFS hash: ' + hash + '. Size: ' + size);  
              Log.v(TAG, 'Transactions #' + key + ' found in Block#' + block.no);                
            }
        );*/

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

/**
 * The `onstart` callback triggered when the server was successfully
 * started.
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Boolean}
 */
var onstart = function(req, res) {
    // Chord node ID
    var id = req.node.id;
    var address = req.node.address;
};

/**
 * The `onquery` callback. Handling ledger queries data in the local blocks.
 * It should check whether the transaction was stored in the local ledgers.
 *
 * req.block:
 *
 *   { origin:
 *       { 
 *           address: '192.168.0.105',
 *           port: 8000,
 *           id: '4b0618b5030220ef616c0b9ee92b2936d695c4e0' 
 *       },
 *     key: 'ce6b87119dc5e92040172eb6045828acb569bacc' 
 *   } 
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Boolean} 
 */
var onquery = function(req, res) {
    var tx = req.tx;
    var block = req.block;

    if (!block) return;

    // Block hash as the secret and data key as the context
    var hash = crypto.createHmac('sha256', block.hash)
                        .update( tx.key )
                        .digest('hex');

    db.get(hash, function (err, value) {
        if (err) {
            return Log.e(TAG, 'Ooops! onmessage =', err) // likely the key was not found
        }

        if (!value || typeof(value) === 'undefined') {
            return ;
        }

        if (value.length < 1) {
            return;
        }

        /*
         * The raw data in the local database:
         *
         *   { temperature: 23,
         *     source: { 
         *       address: '192.168.0.105', port: 8000 
         *     } 
         *   }
         */
        var payload = value[0].tx;

        payload.source = {
            address: req.node.address,
            port: req.node.port
        };

        Log.v(TAG_QUERY, 'Verified #' + tx.key);
    });
};

/**
 * The `ondata` callback.
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Boolean}
 */
var ondata = function(req, res) {
    var data = req.data;
    var put = res.save;

    put(data);
};

/**
 * The `onedge` callback.
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Boolean}
 */
var onedge = function(req, res) {
    return;
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
        onedge: options.onedge || onedge,
        join: {
            address: process.env['PEER_ADDR'] || peerAddr,
            port: process.env['PEER_PORT'] || peerPort
        }
    });
};

if (typeof(module) != "undefined" && typeof(exports) != "undefined") {
    module.exports = PeerNode;
}

// Start the server
if (!module.parent) {
    server.start({
        onstart: onstart,
        onmessage: onmessage,
        onquery: onquery,
        ondata: ondata
    });
}