var vows = require('vows'),
    assert = require('assert');

var Flowchain = require('../../libs');

// Import Websocket server
var server = Flowchain.WoTServer;

// Utils
var crypto = Flowchain.Crypto;

// Database
var Database = Flowchain.DatabaseAdapter;

vows.describe('Chord Development Environment').addBatch({
    'Testing Boot Node': {
        'is server started': function () {

            var onstart = function(req, res) {
                // Chord node ID
                var id = req.node.id;
                var address = req.node.address;

                assert.strictEqual(id.length, 40);

                server.shutdown(function() {
                    process.exit(0);
                });
            };

            server.start({
                onstart: onstart
            });
        }
    }
}).export(module);;
