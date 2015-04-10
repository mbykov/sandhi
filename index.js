/*
  node.js and component
*/

var util = require('util');
// var shiva = require('mbykov/shiva-sutras');
var shiva = require('shiva-sutras');
var Const = require('./lib/const');
var u = require('./lib/utils');
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
sandhi.prototype.add = function(test) {
    log('==============ADD====', test);
    return 'योगानुशासन';
}


//Common name: savarṇadīrgha sandhi
//7. akaḥ savarṇe dīrghaḥ || 6.1.101 || (vowel sandhi)
// If a simple vowel, short or long, be followed by a similar vowel, short or long, both of them will merge into the similar long vowel
