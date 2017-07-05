/**
 *
 * The MIT License (MIT)
 *
 * https://flowchain.io
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

var gaussian = require('gaussian');

// difficulties
var difficulties = [
    '0000000000000000000000000000000000000000000000000000000000000000',
    '00000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    '0000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    '000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    '00000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    '0000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    '0000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    '000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',

    '00F8888888888888888888888888888888888888888888888888888888888888',
    '00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',

    '0F88888888888888888888888888888888888888888888888888888888888888',
    '0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
];

// the mean (μ) of the distribution
var mean = 0;
//the variance (σ^2) of the distribution
var variance = 0.2;

var distribution = gaussian(mean, variance);

function Difficulty(x) {
    if (!x) x = Math.random();

    x = x - variance;

    var probability = distribution.pdf(x);

    // prepare for difficulties
    var slice = difficulties.length;
    var intervals = [];

    for (var i = 0; i < slice; i++) {
        intervals[i] = i/slice;
    }
    intervals[i] = 1;

    // get diffiiculty
    var difficulty = -1;
    for (i = 0; i < slice ; i++) {
        if (probability > intervals[i]
            &&  probability <= intervals[i+1]) {
            difficulty = difficulties[i];
            break;
        }
    }

    this.x = x;
    this.probability = probability;
    this.difficulty = difficulty;
};

Difficulty.prototype.getDifficulty = function() {
    return this.difficulty;
};

Difficulty.prototype._getProbability = function() {
    return this.probability;
};

Difficulty.prototype._getX = function() {
    return this.x;
};

module.exports = Difficulty;
