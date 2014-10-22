/*
  node (only, not component) module for sanskrit sandhi processing
*/

var _ = require('underscore');
var util = require('util');
var slp = require('../utils/slp');
var shiva = require('../utils/shivasutra');
var Const = require('lib/Const');


var voiced_asp = shiva('झष्').result;
var unvoiced_asp = shiva('खव्').del('चव्').result;
var asps = voiced_asp.concat(unvoiced_asp);

module.exports = sandhi();

function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

sandhi.prototype.del = function(form, flex, suff, prefix) {
    if (prefix) return removePrefix(form, flex, suff);
    return removeSuffix(form, flex, suff);
}

/* ну пусть флексия в исходной форме, -ti. Тогда в сандхи передаются две формы, -ti и -Dhi

*/

// suff: -ti, flex: -dhi, etc, i.e. variant
function removeSuffix(form, flex, suff) {
    var stems = [];
    var re = new RegExp(flex + '$');
    var stem = form.replace(re, '');
    log('---------', form, flex, suff, stem)
    if (stem == form) return [];
    stems.push(stem); // default stem
    var first = suff[0];
    var clean = stem.replace(/्$/, '');
    var last = clean.slice(-1);
    log('LAST', last);
    // теперь - придыхания тут еще нет. bud-dha.
    // если suff = -ti,-th, и flex на -dh, то
    // Aspirated Letters:
    // t- and th-, when they are the second letter, become dh- ==> when suff
    var tiSuff = ['त', 'थ'];
    if (isIN(tiSuff, first)) stems = aspirated(stems, flex, suff);
    return stems;
}

function aspirated(stems) {
    var res = [];
    _.each(stems, function(stem) {
        var last = stem.slice(-1);
        var newStem = stem.replace(reEnd(last), 'A');
        res.push(stem);
        res.push(newStem);
    });
    log('STEMS ASP========', res);
    return res;
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

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

function reEnd(str) {
    return new RegExp(str + '$');
}
