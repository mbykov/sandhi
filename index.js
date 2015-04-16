/*
  node.js and component
*/

var util = require('util');
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

// здесь я не имею механизма while - для дальнейшей обработки и исходной пары, и добавленной. Где-то встретится случай, где это станет необходимо
//

sandhi.prototype.add = function(test) {
    // var test = {first: a.split(''), fin: a.slice(-1), second: b.split(''), beg: b[0]};

    // // FIXME: определение типа теста - vowel - или согласная, или лига, или долгая лига
    // var type = (u.c(Const.consonants, test.fin) && u.c(Const.fullVowels, test.beg)) ? true : false;
    // log('=====TEST====', JSON.stringify(test));
    // test.vtype = true;

    var vow_rules = vowRules;

    var first = test[0].split('');
    var second = test[1].split('');
    var only = test[2];
    var fin = first.slice(-1)[0];
    var matra = Const.liga2vow[fin] ||fin; // only one vowel
    var results = []; // FIXME: пока что накопитель тут не нужен - неск решений дает сам метод при ोपतिोनाल

    var test, res;
    for (var name in vow_rules) {
        var test = {first: first, fin: fin, matra: matra, second: second, beg: second[0], only: only};
        var rule = vow_rules[name];
        // log('ONLY', only, rule.id, rule.sutra);
        var res = rule.method(test);
        if (!res) continue;
        results = results.concat(res);
    }

    if (fin == Const.virama) {
        first.pop();
        fin = first.slice(-1)[0];
    }
    consRules.forEach(function(rule) {
        test = {first: first, fin: fin,  second: second, beg: second[0], only: only};
        // log('R', test);
        var res = rule.method(test);
        if (!res) return;
        results = results.concat(res);
    });



    // log('RESULTS=>', results); // а зачем мне в add - массив? Пока пусть будет
    return results;
}
