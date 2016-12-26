/**
 *
 * WoT.City Open Source Project
 * 
 * Copyright 2015 Jollen
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

"use strict";

/**
 * Expose `Automation` class. (NodeJS)
 */
if (typeof(module) !== "undefined" && typeof(exports) !== "undefined") {
  exports = module.exports = Automation;
}

/**
 * Util Modules
 */
var Backbone = require('backbone');
var _ = require('underscore');
var merge = require('utils-merge');

/*
 * Class
 */
function Automation(options) {
  this.super();

  // initialize the private options
  this._options = {};

  // the server implementation
  if (typeof(options.server) === 'object') {
    this._options.server = options.server;
  }
  
  // Merge server instance with the framework instance
  // (copy our methods to server instance).
  return merge(this, this._options.server);
};

/**
 * EventAggregator can be used to decouple various parts
 * of an application through event-driven architecture.
 *
 * Borrowing this code from https://github.com/marionettejs/backbone.wreqr/blob/master/src/wreqr.eventaggregator.js
 */
Automation.EventAggregator = function () {

  var EA = function(){};

  // Copy the *extend* function used by Backbone's classes
  EA.extend = Backbone.Model.extend;

  // Copy the basic Backbone.Events on to the event aggregator
  _.extend(EA.prototype, Backbone.Events);

  return new EA();
};

/**
 * Container
 *
 * The container to store, retrieve child elements.
 * Borrowing this code from https://github.com/marionettejs/backbone.babysitter
 */
Automation.ChildElementContainer = function (context) {

  // Container Constructor
  // ---------------------

  // the container of new things with its given unique name, model and implementation
  // see: https://github.com/wotcity/web-of-things-framework
  var Container = function() {
    this._names = [];
    this._models = [];
    this._implementations = [];
  };

  // Container Methods
  // -----------------
  _.extend(Container.prototype, {
    // Add an element to this container. Stores the element
    // by `cid` and makes it searchable by the model
    // cid (and model itself). 
    add: function(options){
      var name = options.name
        , model = options.model
        , implementation = options.implementation
        , cid = options.cid;

      // save the new things by internal cid
      this._names[cid] = name;
      this._models[cid] = model;
      this._implementations[cid] = implementation;

      this._updateLength();

      return this;
    },

    findNameByCid: function(cid) {
      return this._names[cid];
    },

    updateNameByCid: function(cid, name) {
      this._names[cid] = name;
    },

    findModelByCid: function(cid) {
      return this._models[cid];
    },

    updateModelByCid: function(cid, model) {
      this._models[cid] = model;
    },

    findImplementationByCid: function(cid) {
      return this._models[cid];
    },

    updateImplementationByCid: function(cid, impl) {
      this._implementations[cid] = impl;
    },

    // Remove a cid
    remove: function(cid){
      delete this._names[cid];
      delete this._models[cid];
      delete this._implementations[cid];

      // update the length
      this._updateLength();

      return this;
    },

    // Fetch data of every element
    fetch: function() {
      _.each(this._models, function(model) {
        var cid = model.get('cid');

        model.fetch({
          success: function(model, response, options) {
            if (_.isFunction(model.parseJSON))
              model.parseJSON(response);
          }.bind(model)
        });
      }.bind(this));
    },

    // Call a method on every element in the container,
    // passing parameters to the call method one at a
    // time, like `function.call`.
    call: function(method){
      this.apply(method, _.tail(arguments));
    },

    // Apply a method on every element in the container,
    // passing parameters to the call method one at a
    // time, like `function.apply`.
    apply: function(method, args){
      _.each(this._elements, function(elem){
        if (_.isFunction(elem[method])){
          elem[method].apply(elem, args || []);
        }
      });
    },

    // Update the `.length` attribute on this container
    _updateLength: function(){
      this.length = _.size(this._elements);
    }
  });

  // Borrowing this code from Backbone.Collection:
  // http://backbonejs.org/docs/backbone.html#section-106
  //
  // Mix in methods from Underscore, for iteration, and other
  // collection related features.
  var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
    'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
    'last', 'without', 'isEmpty', 'pluck'];

  _.each(methods, function(method) {
    Container.prototype[method] = function() {
      var elements = _.values(this._elements);
      var args = [elements].concat(_.toArray(arguments));
      return _[method].apply(_, args);
    };
  });

  // return the public API
  return new Container();
}

/*
 * Prototype
 */

// constructor
Automation.prototype.super = function() {
  // private properties
  this._model = Backbone.Model.extend({});
  this._count = 0;
  this._handlers = [];

  // constructor
  this._observer = new Automation.ChildElementContainer();
  this._eventAggragator = new Automation.EventAggregator();

  // notifying listing objects of state changes
  this._eventAggragator.on('forceUpdateAll', function() {
    // update every model in the container
  }.bind(this));
};

/**
 * Create a new thing with its given unique name, model 
 * and implementation. Add `thing` to observer. 
 * A `things` is described in JSON.
 *
 * @param {Object} name
 * @param {Object} model
 * @param {Object} implementation
 * @api private
 */
Automation.prototype._add = function(name, model, implementation) { 
  var _model = new this._model();

  // convert JSON-LD to `Backbone.Model`
  for(var prop in model) {
    if(model.hasOwnProperty(prop))
      _model.set(prop, model[prop]);
  }

  // child ID is automatically increased
  _model.set('cid', this._count);

  // bind model change event
  _model.bind('change', function(model) {
    var cid = model.get('cid');
  }.bind(this), _model);

  // push
  this._observer.add({
    name: name,
    model: model,
    cid: this._count,
    implementation: implementation
  });

  this._count++;

  return _model;
};

Automation.prototype.trigger = function(event) {
  this._eventAggragator.trigger(event);
};

/**
 * Framework APIs
 */

Automation.prototype.registerThing = function(thing) {
  return this._add(thing);
};