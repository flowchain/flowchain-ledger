/**
 *
 * The MIT License (MIT)
 *
 * https://flowchain.co
 *
 * Copyright (c) 2017-present Jollen
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

var merge = require('utils-merge');

// The PBFT protocols
var PBFT_PROTOCOLS = require('./message');

function PBFT(options) {
};

PBFT.prototype.broadcast = function(message) {
};

/**
 *
 * @param {Function} Complete callback function
 * @api private
 */
PBFT.prototype.dispatch = function(_from, _message) {
    var from = _from;
    var message = _message;

    switch (message.type) {
    case PBFT_PROTOCOLS.INIT:
    case PBFT_PROTOCOLS.PREPARE:
        message.type = PBFT_PROTOCOLS.COMMIT;
        this.broadcast(message);
        break;
    case PBFT_PROTOCOLS.COMMIT:
    }
};

if (typeof(module) != "undefined" && typeof(exports) != "undefined") {
    module.exports = PBFT;
};
