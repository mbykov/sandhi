/*
  npm module
*/

var _ = require('underscore');
var util = require('util');
var Const = require('./lib/const');
var u = require('./lib/utils');
var log = u.log;
var salita = require('salita-component'); // FIXME: это нужно убрать

var debug = (process.env.debug == 'true') ? true : false;

module.exports = splitter();

function splitter() {
    if (!(this instanceof splitter)) return new splitter();
    return this;
}

splitter.prototype.split = function(str) {
    log('=========== SPLITTER', str);
}
