/**
 *
 * The MIT License (MIT)
 *
 * https://www.flowchain.co
 *
 * Copyright (c) 2016-present Jollen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

'use strict';

var Debug = require('./debug');

/**
 * Chord Node Class
 */
var Node = require('../p2p');

/*
 * Chord protocols
 */
var Chord = require('../p2p/libs/message');

/**
 * Chord Utils
 */
var ChordUtils = require('../p2p/libs/utils');

/**
 * Web of Things Framework
 */
var Framework = require('../wot/framework')
  , WebsocketBroker = require('../wot/broker')
  , WebsocketRouter = require('../wot/router')
  , WebsocketRequestHandlers = require('../wot/requestHandlers');

/**
 * Util Modules
 */
var merge = require('utils-merge');
var uuid = require('uuid');
var util = require('util');
var WebSocketClient = require('websocket').client;

/*
 * Chord utils
 */
var serialize = JSON.stringify;
var deserialize = JSON.parse;


/*
 * Blockchain system
 */
var Miner = require('../block/mining');      // Import flowchain miner
var block = require('../block/genesis');     // Import flowchain genesis block

/**
 * WebSocket URL Router
 */
var wsHandlers = {
   "/object/([A-Za-z0-9-]+)/viewer": WebsocketRequestHandlers.viewer,
   "/object/([A-Za-z0-9-]+)/status": WebsocketRequestHandlers.status,
   "/object/([A-Za-z0-9-]+)/send": WebsocketRequestHandlers.send,

   "/node/([A-Za-z0-9-]+)/receive": WebsocketRequestHandlers.receive
};

/*
 * Constructor - bind a Chord node
 *
 * @param {Object} Chord server
 */
function Server() {
  this.port = process.env.PORT || 8000;
  this.host = process.env.HOST || 'localhost';
  this.endpoint = process.env.ENDPOINT || null;
  this.thingid = process.env.THINGID || '5550937980d51931b3000009';

  // initialize the public attributes
  this.nodes = {};

  // initialize the private attributes
  this._options = {}

  // Websocket connection of endpoint
  this.endpointConnection = null;

  /*
   * Create a unique ID for the new node.
   *
   *  1. The ID of the node can be hashed by IP address.
   *  2. Hased by URI at this project.
   */
  if (process.env.ENV === 'development')
    var id = ChordUtils.hashTestId(process.env.ID);
  else
    var id = ChordUtils.hash(uuid.v4());

  // Create a new Chord node with the ID
  var node = new Node(id, this);

  // The Node instances
  this.node = this.nodes[id] = node;
  this.last_node = id;

  // Create a new miner
  this.miner = new Miner();
  // Blocks
  this.blockchain = [];
};

/**
 * The server event handlers
 */
Server.prototype.onData = function(payload) {
  // Parse the data received from Chord node (WebSocket client)
  var packet = deserialize(payload.data);

  // Request URI
  var pathname = payload.pathname;

  if (typeof packet.message === 'undefined'
        || typeof packet.message.type === 'undefined') {
    // Not a chord message
    if (typeof this._options.ondata === 'function') {
        var req = {
          node: {}
        };
        var res = {
          save: function() {},
          read: function() {}
        };

        req.node = this.node;
        req.data = packet;
        res.save = this.save.bind(this);
        res.read = this.read.bind(this);

        return this._options.ondata(req, res);
    }
  }

  /*
   * Format of 'packet'.
   *
   *  { message: { type: 0, id: '77c44c4f7bd4044129babdf235d943ff25a1d5f0' },
   *  from: { id: '77c44c4f7bd4044129babdf235d943ff25a1d5f0' } }
   */

  // Get last node's instance by ID
  var to = this.nodes[this.last_node];

  // Forward the message
  if (packet.to) {
    // Forward this message to the node ID
    to = this.nodes[packet.to];
  }

  var tx = {};

  if (typeof packet.message.data !== 'undefined') {
    tx = packet.message.data;
  }

  // This message is for me to query data of my blocks
  if (typeof this._options.onquery === 'function'
        && typeof tx !== 'undefined'
        && typeof tx.origin !== 'undefined'
        && packet.message.type === Chord.MESSAGE) {
    var req = {
      node: {}
    };
    var res = {
      save: function() {},
      read: function() {},
      send: function() {}
    };

    req.node = this.node;
    req.payload = payload;
    req.block = this.blockchain[this.blockchain.length - 1];
    req.tx = tx;

    res.save = this.save.bind(this);
    res.read = this.read.bind(this);
    res.send = this.sendAsset.bind(this);

    return this._options.onquery(req, res);

  // The message is for me
  } else if (typeof this._options.onmessage === 'function'
        && packet.message.type === Chord.MESSAGE) {
    var req = {
      node: {}
    };
    var res = {
      save: function() {},
      read: function() {},
      send: function() {}
    };

    req.node = this.node;
    req.payload = payload;
    req.block = this.blockchain[this.blockchain.length - 1];

    res.save = this.save.bind(this);
    res.read = this.read.bind(this);
    res.send = this.sendAsset.bind(this);

    return this._options.onmessage(req, res);
  }

  // Get node instance by ID and dispatch the message
  if (to) {
    to.dispatch(packet.from, packet.message);
  }
};

/**
 * Web of things framework event handlers
 */
Server.prototype.onNewThing = function(thing) {
  if (Debug.Verbose)
    console.info('onNewThing:', thing);

  // Invoke framework API to register new thing
  this.registerThing(thing);
};

/**
 * Start a Websocket server
 *
 * @param options {Object} - Configuration file
 * @returns {None}
 * @api public
 */
Server.prototype.start = function(options) {
  var self = this;
  var options = options || {};

  for (var prop in options) {
    if (options.hasOwnProperty(prop)
        && typeof(this._options[prop]) === 'undefined')
      this._options[prop] = options[prop];
  }

  // Prepare to start Websocket server
  var server = new WebsocketBroker({
    port: this.port,
    host: this.host
  });

  var router = new WebsocketRouter();

  // Websocket server events (the protocol layer)
  server.on('data', this.onData.bind(this));

  // Web of things framework event aggregation (the things layer)
  server.on('newThing', this.onNewThing.bind(this));

  // Connect to a subsequent Chord node
  if (typeof options.join === 'object') {
    this.node.join(options.join);
  }

  server.start(router.route, wsHandlers);

  console.log('----- Genesis Block -----');
  console.log( JSON.stringify(block) );

  console.log('----- Start mining -----');
  var miner = this.miner;

  miner.setTransactions([this.node]);
  miner.setPreviousBlock(block);

  // Start to generate a hash
  setInterval(function() {
      miner.generateHash();

      // A success hash is generated
      if (miner.isSuccess()) {
          var block = miner.getNewBlock();

          // Successful mined and save the new block
          self.blockchain.push(block);

          miner.setPreviousBlock(block);

          console.log('Difficulty: ' + block.difficulty)
          console.log('Block #' + block.no + ': ' + block.hash);
      } else {
          var block = miner.getMiningBlock();
          //console.log('current difficulty = ' + block.difficulty)
      }
  }, 50);

  // Event callbacks
  if (typeof this._options.onstart === 'function') {
    var req = {
      node: {}
    };
    var res = {
      save: function() {},
      read: function() {}
    };

    req.node = this.node;
    res.save = this.save.bind(this);
    res.read = this.read.bind(this);

    this._options.onstart(req, res);
  }
};

/*
 * CRUD of data query
 *
 * @param {Object} { address: '127.0.0.1', port: 8000 }
 * @param {Object} { type: 2, id: 'b283326930a8b2baded20bb1cf5b6358' }
 */
Server.prototype.save = function(data) {
  return this.node.save(data);
};

/*
 * CRUD of data query
 *
 * @param key {String} -
 */
Server.prototype.read = function(key) {
  return this.node.read(key);
};

/**
 * Send Chord message.
 *
 * @param to {Object} - { address: '127.0.0.1', port: 8000 }
 * @param packet {Object} - { type: 2, id: 'b283326930a8b2baded20bb1cf5b6358' }
 * @returns {None}
 * @api public
 */
var connections = [];

Server.prototype.sendChordMessage = function(to, packet) {
  var uri = util.format('ws://%s:%s/node/%s/receive', to.address, to.port, packet.message.id);
  var host = util.format('ws://%s:%s', to.address, to.port);
  var payload = {
    message: packet.message,
    from: packet.from
  };
  var connection = connections[host] || null;

  if (ChordUtils.DebugServer)
    console.info('send to ' + uri);

  if (connection) {
    if (connection.connected) {
      connection.sendUTF(JSON.stringify(payload));
    } else {
      delete connections[host];
    }

    return 0;
  }

  var client = new WebSocketClient();

  client.on('connect', function(connection) {
    if (connection.connected) {
      connection.sendUTF(JSON.stringify(payload));
      connections[host] = connection;
    } else {
      delete connections[host];
    }
  });

  client.connect(uri, '');
};

/**
 * Give an asset to endpoint.
 *
 * @param asset {Object} - Issued asset to be gave out
 * @returns {Object}
 * @api public
 */
Server.prototype.sendAsset = function(asset) {
    // Start forward data to endpoint
    var endpoint = this.endpoint;
    var connection = this.endpointConnection;
    var self = this;

    if (!endpoint) return;

    if (!/^(ws|wss):\/\//.test(endpoint)) {
        endpoint = 'ws://' + endpoint;
    }

    if (connection === null) {
        var wsClient = new WebSocketClient();

        wsClient.on('connectFailed', function(error) {
            self.endpointConnection = null;
        });

        wsClient.on('connect', function(conn) {
            conn.on('error', function(error) {
                self.endpointConnection = null;
            });
            conn.on('close', function() {
                self.endpointConnection = null;
            });
            conn.on('message', function(message) {
            });

            self.endpointConnection = conn;
        });

        var uri = util.format('%s/object/%s/send', endpoint, this.thingid);

        // initial websocket connection
        return wsClient.connect(uri, '');
    }

    if (typeof asset === 'object')
        asset = JSON.stringify(asset);

    // Send data to endpont
    connection.sendUTF(asset);
};

/**
 * Create a web of things server
 *
 * @returns {Object}
 * @api public
 */
function createServer() {
    var _server = new Server();

    // Combined Websocket server with web of things framework
    var server = new Framework({
        server: _server
    });

    return server;
}

/**
 * Export the server.
 */
module.exports = createServer();
