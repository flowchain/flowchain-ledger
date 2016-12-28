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

// Database Adapter

// leveldb: key-value pairs persistent data store
var levelup = require('levelup');

// nedb: In-memory only datastore (no need to load the database)
var Datastore = require('nedb')

function DataAdapter(name) {
    this.db = {};
    this._put = function() {};
    this._get = function() {};

    this._use(name);
}

DataAdapter.prototype._use = function(name) {
    if (name === 'leveldb') {
        // Create our database, supply location and options
        this.db = levelup('./mydb');
        this._get = this._get_leveldb
        this._put = this._put_nedb;

        return true;
    }

    if (name === 'nedb') {
        this.db = new Datastore();
        this._get = this._get_nedb;
        this._put = this._put_nedb;

        return true;
    }

    // Default
    this.db = levelup('./mydb');
    this._get = this._get_leveldb
    this._put = this._put_nedb;

    return true;
}

DataAdapter.prototype.put = function(hash, tx, cb) {
    this._put(hash, tx, cb);
};

DataAdapter.prototype.get = function(hash, cb) {
    this._get(hash, cb);
};

DataAdapter.prototype._put_leveldb = function(hash, tx, cb) {
    this.db.put(hash, tx, function (err) {
        cb(err);
    });
};

DataAdapter.prototype._get_leveldb = function(hash, cb) {
    this.db.get(hash, function (err, value) {
        cb(err, value);
    });
};

DataAdapter.prototype._put_nedb = function(hash, tx, cb) {
    var doc = {
        hash: hash,
        tx: tx
    };

    this.db.insert(doc, function (err) {   // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
      cb(err);
    });
};

DataAdapter.prototype._get_nedb = function(hash, cb) {
    this.db.find({ hash: hash }, function (err, docs) {
        cb(err, docs);
    });
};

if (typeof(module) != "undefined" && typeof(exports) != "undefined") {
  exports = module.exports = DataAdapter;
}
