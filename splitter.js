/*
  module flakes - чешуйки
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

splitter.prototype.split = function(samasa) {
    log('=========== SPLITTER', samasa);
}

/* забирает flakes - чешуйки из базы
 */
splitter.prototype.get = function(samasa) {
    // log('=========== SPLITTER', samasa);
    var flakes = scrape(samasa);
}

/*
   rasp aka scrape - строгать, скоблить - создает чешуйки
   берем samasa, создаем чешуйки-flakes от каждого символа до - двух-трех слогов, (без учета приставок и флексий, эх)
 */
function scrape(samasa) {
    var anchors = [];
    var trn = salita.sa2slp(samasa);
    var syms = samasa.split('');
    // var syms = trn.split('');
    syms.forEach(function(sym, idx) {
        var rest = syms.slice(idx);
        log('----', idx, rest.join(''));
        var vows = 0;
        var flakes = [];
        rest.forEach(function(s, idy) {
            // FIXME: подсчет гласных - или слогов - тут неаккуратно
            if (u.c(Const.hal, s)) vows+=1;
            else if (Const.virama == s) vows-=1;
            // log(111, s, u.vowel(s), vows);
            var flake = rest.slice(0, idy+1).join('');
            // log('===', idx, idy, flake);
            if (vows < 4) flakes.push(flake);
        });
        log('F', idx, flakes);
        anchors.push(flakes);
    });

    log('=========== FLAKES', samasa, trn, Const.allvowels);
    // log(anchors);
    translit(anchors);
    return anchors;
}

// function vowCount(str) {
//     var syms = str.split('');
//     var vows = syms.map(function())
// }

function translit(arr) {
    var trows = [];
    arr.forEach(function(row) {
        var tstr = [];
        row.forEach(function(str) {
            tstr.push(salita.sa2slp(str));
        });
        trows.push(tstr);
    });
    log(trows);
    return trows;
}
