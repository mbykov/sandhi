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
    // var test = {first: a.split(''), ends: a.slice(-1), second: b.split(''), starts: b[0]};

    // // FIXME: определение типа теста - vowel - или согласная, или лига, или долгая лига
    // var type = (u.c(Const.consonants, test.ends) && u.c(Const.fullVowels, test.starts)) ? true : false;
    // log('=====TEST====', JSON.stringify(test));
    // test.vtype = true;

    var vow_rules = vowRules;

    var first = test[0];
    var second = test[1];
    var only = test[2];
    var ends = first.slice(-1);
    var matra = Const.liga2vow[ends] ||ends; // only one vowel
    var results = []; // FIXME: пока что накопитель тут не нужен - неск решений дает сам метод при ोपतिोनाल
    for (var name in vow_rules) {
        var test = {first: first.split(''), ends: ends, matra: matra, second: second.split(''), starts: second[0], only: only};
        var rule = vow_rules[name];
        // log('ONLY', only, rule.id, rule.sutra);
        var res = rule.method(test);
        if (!res) continue;
        results = results.concat(res);
    }
    // log('RESULTS=>', results); // а зачем мне в add - массив? Пока пусть будет
    return results;
}
