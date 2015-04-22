/*
  node.js and component
*/

var util = require('util');
// var typeOf = require('typeof');
// var shiva = require('mbykov/shiva-sutras');
// var shiva = require('shiva-sutras');
var Const = require('./lib/const');
var u = require('./lib/utils');
var vowRules = require('./lib/vowel_rule');
var consRules = require('./lib/cons_rules');
var log = u.log;

var debug = (process.env.debug == 'true') ? true : false;

module.exports = sandhi();

function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

/*
  берем тест, смотрим тип правила: vowel, visarga, cons
  массив условий для правила => if vowel + частные условия
  применение следующего правила, но уже для массива x,y
  какие прерывают? как?
*/

sandhi.prototype.suffix = function() {
    log('==============SUFFIX');
}

/*
  короче, выходит, нужно все переделать. Сутра должна выполнять только то, что в сутре, и возвращать обе части - с пометкой - сливать-не-сливать
  либо возвращить optional вариант.
  Пусть есть два типа методов - сначала выполняются предварительные, - и после них финальные, возвращают false
*/

sandhi.prototype.add = function(arr) {
    var results = [];
    consRules.every(function(rule) {
        var test = makeTests(arr);
        results = rule.method(test);
    });

    log('R=>', results);
    // log('R=>', results.map(function(r) { return JSON.stringify(r.split(''))}));
    return results;
}

function makeTests(arr) {
    var first = arr[0].split('');
    var second = arr[1].split('');
    var fin = first.slice(-1)[0];
    var beg = second[0];
    var vir = false;
    if (fin == Const.virama) {
        first.pop();
        fin = first.slice(-1)[0];
        vir = true;
    }
    return {first: first, fin: fin, vir: vir, second: second, beg: beg};
}

function p(sutra, test) {
    console.log('=>', sutra, JSON.stringify(test));
}

sandhi.prototype.add_ = function(test) {
    // var test = {first: a.split(''), fin: a.slice(-1), second: b.split(''), beg: b[0]};

    // // FIXME: определение типа теста - vowel - или согласная, или лига, или долгая лига
    // var type = (u.c(Const.consonants, test.fin) && u.c(Const.fullVowels, test.beg)) ? true : false;
    // log('=====TEST====', JSON.stringify(test));
    // test.vtype = true;

    // var vow_rules = vowRules;

    // var first = test[0].split('');
    // var second = test[1].split('');
    // var only = test[2];
    // var fin = first.slice(-1)[0];
    // var matra = Const.liga2vow[fin] ||fin; // only one vowel
    // var results = []; // FIXME: пока что накопитель тут не нужен - неск решений дает сам метод при ोपतिोनाल

    // var test, res;
    // for (var name in vow_rules) {
    //     var t = {first: first, fin: fin, matra: matra, second: second, beg: second[0], only: only};
    //     var rule = vow_rules[name];
    //     // log('ONLY', only, rule.id, rule.sutra);
    //     var res = rule.method(t);
    //     if (!res) continue;
    //     results = results.concat(res);
    // }

    /*
      короче, выходит, нужно все переделать. Сутра должна выполнять только то, что в сутре, и возвращать обе части - с пометкой - сливать-не-сливать
      либо возвращить optional вариант. Т.е. метод в сутре
      а на выходе - слить все
     */

    var test, res;
    var first, second, only, fin, beg, matra, vir;

    first = test[0].split('');
    second = test[1].split('');
    only = test[2];
    fin = first.slice(-1)[0];
    if (fin == Const.virama) {
        first.pop();
        fin = first.slice(-1)[0];
        vir: true;
    }

    consRules.forEach(function(rule) {
        var t = {first: first, fin: fin,  second: second, beg: second[0], only: only, vir: vir};
        // log('R test', t);
        var res = rule.method(t);
        // log('r=>', res);
        // тут стратегии - либо накопитель, либо тест затирает предыдущий
        if (res) results = [res];
        // if (!res) return;
        // results = results.concat(res);
    });
    // log('R=>', results.map(function(r) { return r.split('')}));
    return results;
}
