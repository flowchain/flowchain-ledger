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

var Utils = {
	DebugVerbose: false,

	DebugNodeJoin: false,
	DebugFixFingers: false,
	DebugServer: false,
	DebugSuccessor: false,
	DebugPredecessor: false,
	DebugStabilize: false,
	DebugMessage: false,
    DebugFailureCheck: true,

	DebugPrintFingerTable: true,

	/**
	 * Generate a hash key by SHA1. The key is used as identifier (ID) of each node.
	 *
	 * @param {String} text
	 * @return {String}
	 */
	hash: function(text) {
		var data = ('CHORD..++' + text + new Date() + Math.floor(Math.random()*999999));
		var Crypto = require('crypto');
		var key = Crypto.createHash('sha1').update(data).digest('hex');

		return key;
	},

	/**
	 * Generate a test ID. The key is in [1, 9999] with the length of 4 bytes.
	 *
	 * @param {String} text
	 * @return {String}
	 */
	hashTestId: function(n) {
		if (n)
			return n;

		var data = (Math.floor(Math.random()*9999) + 1).toString();
		var length = data.split('').length - 4;

		// Left pads
		while (length++ < 0)
			data = '0' + data;

		return data;
	},

	/**
	 * Testing if key ∈ (n, successor]
	 *
	 * @param {String} key
	 * @param {String} n
	 * @param {String} successor
	 * @return {Boolean}
	 * @api private
	 */
	isInHalfRange: function(key, n, successor) {
		if (Utils.DebugSuccessor)
			console.info(key + ' isInHalfRange [ ' + n + ', ' + successor + ']')

		if (n < successor) {
			return (key > n && key <= successor) || (n === successor && key < n);
		} else {
			return (key > successor && key <= n) || (n === successor && key < n);
		}
	},

	/**
	 * Testing if key ∈ (left, right)
	 *
	 * @param {String} key
	 * @param {String} left
	 * @param {String} right
	 * @return {Boolean}
	 * @api private
	 */
	isInRange: function(key, left, right) {
		if (Utils.DebugFixFingers || Utils.DebugStabilize)
			console.info(key + ' isInRange [ ' + left + ', ' + right + ']')

		if (left < right) {
			return (key > left && key < right) || (left === right && key !== left);
		} else {
			return (key > right && key < left) || (left === right && key !== left);
		}
	},

	getNextFingerId: function(n, i, m) {
		var result = n + Math.pow(2, i - 1);
		var result = result % Math.pow(2, m);

		return result;
	},

	/**
	 * The new key equals to key + 2 ^ exponent.
	 *
	 * @param {String} key
	 * @param {Integer} exponent
	 */
	getFixFingerId: function(key, exponent) {
	    var id = [];
	    var result = key.split('');
	    var index = result.length - 1;
	    var carry = Math.pow(2, exponent);

	    while (index >= 0) {
	        var d = parseInt(result[index], 16) + carry;
	        carry = 0;
	        if (d > 0xf) {
	            carry = d - (d % 16);
	            carry = carry / 16;

	            d = d % 16;
	        }
	        result[index] = d.toString(16);
	        --index;
	    }
	    return result.join('');
	}
};

if (typeof(module) != "undefined" && typeof(exports) != "undefined")
  module.exports = Utils;
