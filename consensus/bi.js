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

var INTERVAL_SIZE = 5;

function BI(options) {
    // initialize the private attributes
    this.options = {
        interval: 1000,          /* measurement time interval in ms */
        faulty: 0,               /* the number of faulty sensors */
        local_measurements: [],  /* local interval measurements */
        data_id: 0,              /* the data ID */
    };

    // copy the attributes
    if (typeof(options) === 'object') {
        for (var prop in options) {
            if(options.hasOwnProperty(prop))
                this.options[prop] = options[prop];
        }
    }

    return this;
};

/**
 * Get a measurement value over time interval
 *
 * @param {Function} Complete callback function
 * @api private
 */
BI.prototype.getMeasure = function (cb) {
    setInterval(function get_measurement_over_time_interval() {
        // generate the *sorted* simulating sensor data
        for (var i = 0; i < INTERVAL_SIZE; i++) {
            this.local_measurements[i] = Math.floor((Math.random() + i) * 100) / 100;
        }
        if (typeof(cb) === 'function')
          cb(this.local_measurements);
    }.bind(this), this.interval);
};

/**
 * Fuse all of the sensor data
 *
 * @api private
 */
BI.prototype.fuse = function (cb) {
    var min = this.local_measurements[0].data;
    var max = this.local_measurements[INTERVAL_SIZE - 1].data;
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
        this.node.broadcast(message);
        break;
    case PBFT_PROTOCOLS.COMMIT:
    }
};

if (typeof(module) != "undefined" && typeof(exports) != "undefined") {
    module.exports = {
        // Brooks–Iyengar algorithm (BI)
        BI: BI
    };
};
