/*
  node (only, not component) module for sanskrit sandhi processing
*/

var _ = require('underscore');
var util = require('util');
var slp = require('../utils/slp');
var shiva = require('../utils/shivasutra');

var lat = process.argv.slice(2)[0] || false;
if (!lat) return log('?');

var form;
if (/[a-zA-Z]/.test(lat[0])) {
    form = slp.slp2sk(lat);
} else {
    form = lat;
    lat = slp.sk2slp(form);
}

log('sandhi', lat, form);

module.exports = sandhi();

function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

sandhi.prototype.del = function(form, flex, preffix) {
    if (prefix) return removePrefix(form, flex);
    return removeSuffix(form, flex);
}

sandhi.prototype.join = function(first, last) {
    // склеивание
}

sandhi.prototype.splitAll = function(samasa) {
    // разбиение на все возможные пары
}

function log() { console.log.apply(console, arguments) }

function ulog (obj) {
    console.log(util.inspect(obj, showHidden=false, depth=null, colorize=true));
}
