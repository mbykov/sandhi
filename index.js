/*
  node.js and component
*/

var util = require('util');
var shiva = require('mbykov/shiva-sutras');
var Const = require('./lib/const');
var u = require('./lib/utils');
var log = u.log;

var debug = (process.env.debug == 'true') ? true : false;

module.exports = sandhi();

function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

sandhi.prototype.suffix = function() {
    log('==============');
}


/*
  что я хочу: брать правило
*/
