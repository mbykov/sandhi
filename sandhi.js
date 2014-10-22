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
    var re = new RegExp(flex + '$');
    var stem = form.replace(re, '');
    //log('---------', form, flex, cflex, stem)
    if (stem == form) return [];
    /* здесь тоже - не просто вызов набора функций _t_th_etc_, а вызов в цикле
       постоянные - hash.prima, hash.second,
       вычисляются - hash.ultima == hash.first
     */

    stems.push(stem); // default stem
    var first = cflex[0];
    //var start = stem[0];
    var clean = stem.replace(/्$/, '');
    var last = clean.slice(-1);

    var hash = {};
    hash.stems = [stem];
    //hash.stem = stem;
    hash.prima = stem[0];
    hash.ultima = u.ultima(stem);
    hash.second = cflex[0];

    // Aspirated Letters:
    if (isIN(t_th, first)) stems = aspirated_t_th(stems);
    if (isIN(t_th_dh, first) && true)  h_2_t_th_dh(hash);

    log('STEMS ASP========', stems);
    return stems;
}

// The h both ends a root that starts with d and is in front of t, th, or dh
function h_2_t_th_dh(hash) {
    var res = [];
    log('==== HHHH', hash.first)
    /* NOW: ==================================================================
       вместо многих переменных - один hash,
       и главное - stems обрабатываются в цикле. И нужно каждый раз вычислять first-second для условий вызова обработчика
     */
    return res;
}

// t- and th-, when they are the second letter, become dh-
function aspirated_t_th(stems) {
    var res = [];
    var virama = true;
    _.each(stems, function(stem) {
        var clean = stem.replace(/्$/, '');
        if (clean == stem) virama = false;
        var last = clean.slice(-1);
        var asp = u.unasp2asp(last);
        var tail = (virama) ? [last, Const.virama].join('') : last;
        if (virama) {
            last = [last, Const.virama].join('');
            asp = [asp, Const.virama].join('');
        }
        var newStem = stem.replace(reEnd(tail), asp);
        res.push(stem);
        res.push(newStem);
    });
    return res;
}



sandhi.prototype.join = function(first, last) {
    // склеивание
}

sandhi.prototype.splitAll = function(samasa) {
    // разбиение на все возможные пары
}

function ulog (obj) {
    console.log(util.inspect(obj, showHidden=false, depth=null, colorize=true));
}

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

function reEnd(str) {
    return new RegExp(str + '$');
}

function log() { console.log.apply(console, arguments) }
