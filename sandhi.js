/*
  node (only, not component) module for sanskrit sandhi processing
*/

var _ = require('underscore');
var util = require('util');
var slp = require('../utils/slp');
var shiva = require('../utils/shivasutra');
var Const = require('./lib/const');
var u = require('./lib/utils');


var voiced_asp = shiva('झष्').result;
var unvoiced_asp = shiva('खव्').del('चव्').result;
var asps = voiced_asp.concat(unvoiced_asp);

module.exports = sandhi();

function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

sandhi.prototype.del = function(form, flex, cflex, prefix) {
    if (prefix) return removePrefix(form, flex, cflex);
    return removeSuffix(form, flex, cflex);
}

/* 1. нужно добавлять -cflex, т.е. исходную форму во все флексии. Может и неплохо, кстати. Как раз резерв ограничения кол-ва результатов.
   2. Неясный код. Ладно.
   3. Последовательность? Как уложить все кейсы?
*/


var t_th = ['त', 'थ'];
var t_th_dh = ['त', 'थ', 'ध'];

// cflex: -ti, flex: -dhi, etc, i.e. variant
function removeSuffix(form, flex, cflex) {
    var stems = [];
    // условие - наружу
    var re = new RegExp(flex + '$');
    var stem = form.replace(re, '');
    //log('---------', form, flex, cflex, stem)
    if (stem == form) return [];


    /* здесь тоже - не просто вызов набора функций _t_th_etc_, а вызов в цикле ? Принцип неясен, вот что
       постоянная величина - hash.second, начало флексии, sign
       вычисляются - hash.ultima == hash.first
       == после каждого преобразования запускается весь список фильтров == ?
     */

    stems.push(stem); // default stem
    var first = cflex[0];
    var clean = stem.replace(/्$/, '');
    var last = clean.slice(-1);

    var hash = {};
    hash.stems = [];
    hash.stem = stem;
    hash.first = u.ultima(stem);
    hash.virama = u.virama(stem);
    hash.second = cflex[0];

    // Aspirated Letters:

    // h is treated like gh: The h both ends a root that starts with d and is in front of t, th, or dh;
    // если стем начинается на d, а флексия на t_th_dh, то gh -> h
    if (isIN(t_th, cflex[0]) && flex[0] == 'ध') asp_tth2dh(hash);

    if (hash.second == 'स' || isIN(t_th_dh, first) && stem[0] == 'द') {
        dh2h_ts(hash);
    } else {
        h_three_thing(hash);
    }
    if (isIN(Const.asps, first)) removeAspEnd(hash);

    log('HASH STEMS', hash.stems);
    return hash.stems;
}

// h is treated like gh: The h both ends a root that starts with d and is in front of t, th, or dh;
// если стем начинается на d, а флексия на t_th_dh, то gh -> h
function dh2h_ts(hash) {
    hash.stems = _.map(hash.stems, function(stem) { return stem.replace(/घ्/, 'ह्') });
}

function h_three_thing(hash) {
    //
}
// t- and th-, when they are the second letter, become dh-
// если флексия t_th стала dh-, то окончание стема аспирируется
function asp_tth2dh(hash) {
    var asp = u.unasp2asp(hash.first);
    if (!asp) return;
    var stem = u.replaceEnd(hash.stem, hash.first, asp);
    if (!stem) return;
    hash.stems.push(stem);
}


// Aspirated letters become unaspirated
// наоборот, окончание стема без придыхания получает придыхание, кроме gh?
function removeAspEnd(hash) {
    for (var stem in hash.stems) {
        //s
    }
    //ulog(hash);
    return;
}




sandhi.prototype.join = function(first, last) {
    // склеивание
}

sandhi.prototype.splitAll = function(samasa) {
    // разбиение на все возможные пары
}

function ulog () {
    var obj = arguments[0];
    if (arguments.length > 1) {
        console.log('==', arguments[0], '==');
        var obj = arguments[1];
    }
    console.log(util.inspect(obj, showHidden=false, depth=null, colorize=true));
}

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

// function reEnd(str) {
//     return new RegExp(str + '$');
// }

function log() { console.log.apply(console, arguments) }
