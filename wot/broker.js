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

/*
 * Module dependencies.
 */
var http = require("http")
  , url = require("url")
  , cluster = require('cluster')
  , WebSocketServer = require('websocket').server
  , EventEmitter = require('events').EventEmitter
  , util = require('util');

/**
 * Expose `WebsocketBroker` constructor.
 */
if (typeof(module) != "undefined" && typeof(exports) != "undefined") {
  exports = module.exports = WebsocketBroker;
}

/**
 * Initialize a new `WebsocketBroker` with the given `options`.
 *
 * @param {Object} options
 * @api private
 */
function WebsocketBroker(options) {
  // Superclass Constructor
  EventEmitter.call(this);

  options = options || {};
  this.clientsPath = [];
  this.host = options.host || 'localhost';
  this.port = options.port || 8000;
  this.endpoint = options.endpoint || null;
  this.thingid = options.thingid || '5550937980d51931b3000009';
  this.wsServer = null;
  this.httpServer = null;
}

util.inherits(WebsocketBroker, EventEmitter);

/**
 * Initialize a new `WebsocketBroker` with the given `options`.
 *
 * @param {Object} request
 * @param {Object} response
 * @api private
 */
WebsocketBroker.prototype.onRequest = function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end();
};

/**
 * Initialize a new `WebsocketBroker` with the given `options`.
 *
 * @param {String} path
 * @param {Object} data
 * @api private
 */

WebsocketBroker.prototype.dispatchData = function(path, data) {
  var connections = this.clientsPath[path];

  if (typeof(connections) === 'undefined')
    return;

  for (var i = 0; i < connections.length; i++) {
    connections[i].sendUTF(data);
  }
};

/**
 * Initialize a new `WebsocketBroker` with the given `options`.
 *
 * @param {Object} request
 * @param {Object} response
 * @api private
 */

WebsocketBroker.prototype.dispatchStatus = function(path, data) {
  var connections = this.clientsPath[path];

  if (typeof connections === 'undefined')
    return;

  for (var i = 0; i < connections.length; i++) {
    connections[i].sendUTF(data);
  }
};

/**
 * Start the Websocket server.
 *
 * @param {Object} route
 * @return {}
 * @api public
 */
WebsocketBroker.prototype.start = function(route, handlers) {
  var self = this;

  // Use options or environment variables
  var port = self.port || process.env['PORT'];
  var host = self.host || process.env['HOST'];
  var endpoint = self.endpoint || process.env['ENDPOINT'];

  // Update attributes
  this.port = port;
  this.host = host;
  this.endpoint = endpoint;

  var httpServer = http.createServer(this.onRequest).listen(port, host, function() {
      console.info('node is running at ws://' + self.host + ':' + self.port);
  });

  var wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
  });

  this.httpServer = httpServer;
  this.wsServer = wsServer;

  /**
   * handlers
   */
  var onWsRequest = function(request) {
    var connection = request.accept('', request.origin);

    // bind information
    connection.server = self;

    route(request.resource, connection, handlers, self.clientsPath);

    // register this thing
    self.emit('newThing', {
      name: connection.pathname
    });

    connection.on('message', onWsConnMessage);
    connection.on('close', onWsConnClose);

    if (typeof (connection.statusViewer) !== 'undefined')
      self.dispatchStatus(connection.statusViewer, JSON.stringify({ isAlive: true }));
  };

  var onWsConnMessage = function(message) {
    // Dispatching request message
    self.emit('data', {
      data: message.utf8Data,
      pathname: this.pathname
    });

    // Is it a sender ? Yes, then push data to all viewers.
    if (typeof (this.viewer) !== 'undefined')
      self.dispatchData(this.viewer, message.utf8Data);

    if (typeof (this.statusViewer) !== 'undefined')
      self.dispatchStatus(this.statusViewer, JSON.stringify({ isAlive: true }));
  };

  var onWsConnect = function(webSocketConnection) {
  };

  var onWsConnClose = function(reasonCode, description) {
    if (typeof (this.statusViewer) !== 'undefined')
        self.dispatchStatus(this.statusViewer, JSON.stringify({ isAlive: false }));
  };

  wsServer.on('request', onWsRequest);
  wsServer.on('connect', onWsConnect);
};

/**
 * Shutdown the Websocket server.
 *
 * @param cb {Function} The complete callback
 * @return {}
 * @api public
 */
WebsocketBroker.prototype.shutdown = function(cb) {
    var self = this;

    this.httpServer.close(function() {
        self.wsServer.shutDown();
        if (typeof cb === 'function') return cb();
    });
};
