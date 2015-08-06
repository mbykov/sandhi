/*
  module flakes - чешуйки - не используется больше
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

// 16-15, 16-26, ---->  17-29, 17-48

/*
   rasp aka scrape - строгать, скоблить - создает чешуйки
   берем samasa, создаем чешуйки-flakes от каждого символа до - двух-трех слогов, (пока без учета приставок и флексий, эх)
 */
function scrape(samasa) {
    var anchors = [];
    var trn = salita.sa2slp(samasa);
    var syms = samasa.split('');
    syms.forEach(function(sym, idx) {
        var tail = syms.slice(idx);
        anchors.push(shredder(tail));
    });

    log('=========== FLAKES', samasa, trn);
    translit(anchors);
    return anchors;
}

/*
  main method - cuts tails into flakes with sandhi
*/
function shredder(tail) {







    // TMP method:
    var vows = (u.c(Const.allvowels, u.vowel(tail[0]))) ? 1 : 0;
    var flakes = [];
    tail.forEach(function(s, idy) {
        if (u.c(Const.hal, s)) vows+=1;
        else if (Const.virama == s) vows-=1;
        var flake = tail.slice(0, idy+1).join('');
        // log('->', s, u.vowel(s), vows);
        if (vows < 4) flakes.push(flake);
    });
    // log('F', idx, vows);
    return flakes;
}

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
