/*
  node.js and component
*/

var util = require('util');
// var shiva = require('mbykov/shiva-sutras');
var shiva = require('shiva-sutras');
var Const = require('./lib/const');
var u = require('./lib/utils');
var vowRules = require('./lib/vowel_rule');
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

sandhi.prototype.add = function(a, b) {
    var test = {first: a.split(''), ends: a.slice(-1), second: b.split(''), starts: b[0]};

    // FIXME: определение типа теста - vowel - или согласная, или лига, или долгая лига
    var type = (u.c(Const.consonants, test.ends) && u.c(Const.fullVowels, test.starts)) ? true : false;
    log('=====TEST====', JSON.stringify(test));
    test.vtype = true;
    var rules = vowRules;

    var results = [];
    for (var name in rules) {
        var rule = rules[name];
        var res = rule.method(test);
        if (!res) continue;
        results.push(res);
    }
    log('RR=>', results, (results == 'महामृत')); // महामृत - महाामृत
    // results = ['योगानुशासन'];
    return results;
}