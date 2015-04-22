var Const = require('./const');

module.exports = utils();

function utils() {
    if (!(this instanceof utils)) return new utils();
    return this;
}

utils.prototype.c = utils.prototype.isIN = function(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

utils.prototype.similar = function(a, b) {
    // log('A', a, 'B', b, 'D', Const.dirghaLiga[a], Const.dirghaLiga[b]);
    return ((Const.dirghaLiga[a] && Const.dirghaLiga[a] == Const.dirghaLiga[b]) || ((isIN(Const.consonants, a)) && Const.dirghaLiga[b] == 'ा')) ? true : false;
}

utils.prototype.aA = function(v) {
    return ((isIN(Const.consonants, v)) || v == 'ा') ? true : false;
}

utils.prototype.matra = function(liga) {
    return Const.liga2vow[liga];
}



// /* vowels liga2matra */
// utils.prototype.matra = function(v) {
//     // return Const.allvowels[Const.allligas.indexOf(v)];
// }

// /* vowels matra2liga */
// utils.prototype.liga = function(v) {    // nodejs sorts its incorrect !! Use Const.vow2liga instead
//     // return Const.allligas[Const.allvowels.indexOf(v)];
// }

utils.prototype.jhal2jaS = function(c) {
    if (isIN(['ग', 'ध', 'ख', 'क', 'ह'], c)) return 'ग' // g
    else if (isIN(['ज', 'झ', 'छ', 'च', 'श'], c)) return 'ज' // j
    else if (isIN(['ड', 'ढ', 'ठ', 'ट', 'ष'], c)) return 'ड' // D
    else if (isIN(['द', 'ध', 'थ', 'त', 'स']), c) return 'द' // d
    else if (isIN(['ब', 'भ', 'फ', 'प'], c)) return 'ब'; // b
    else return '';
}

// jhal - झ,भ,घ,ढ,ध, - ज,ब,ग,ड,द, - ख,फ,छ,ठ,थ, - च,ट,त,क,प, - श,ष,स,ह
// car - च,ट,त,क,प,श,ष,स
utils.prototype.jhal2car = function(c) {
    if (isIN(['ग', 'ध', 'ख', 'क', 'ह'], c)) return 'क' // k
    else if (isIN(['ज', 'झ', 'छ', 'च', 'श'], c)) return 'च' // c
    else if (isIN(['ड', 'ढ', 'ठ', 'ट', 'ष'], c)) return 'ट' // w
    else if (isIN(['द', 'ध', 'थ', 'त', 'स']), c) return 'त' // t
    else if (isIN(['ब', 'भ', 'फ', 'प'], c)) return 'प'; // p
    else return '';
}

utils.prototype.den2pal = function(v) {
    return Const.palatal[Const.dental.indexOf(v)];
}

utils.prototype.den2cer = function(v) {
    return Const.cerebral[Const.dental.indexOf(v)];
}


// g - 'ग', 'ध', 'ख', 'क', 'ह'
// j - 'ज', 'झ', 'छ', 'च', 'श'
// D - 'ड', 'ढ', 'ठ', 'ट', 'ष'
// d - 'द', 'ध', 'थ', 'त', 'स'
// b - 'ब', 'भ', 'फ', 'प'






function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}


// ============== OLD =================

utils.prototype.unasp2asp = function(lett) {
    var idx = Const.unasps.indexOf(lett);
    return Const.asps[idx];
}

utils.prototype.asp2unasp = function(lett) {
    var idx = Const.asps.indexOf(lett);
    return Const.unasps[idx];
}

utils.prototype.unvoiced2voiced_unasp = function(lett) {
    var idx = Const.unvoiced_unasp.indexOf(lett);
    return Const.voiced_unasp[idx];
}

utils.prototype.ultima = function(stem) {
    var clean = stem.replace(/्$/, '');
    return (clean == stem) ? stem.slice(-1) : clean.slice(-1);
}

utils.prototype.virama = function(stem) {
    var clean = stem.replace(/्$/, '');
    return (clean == stem) ? false : true;
}

utils.prototype.replaceEnd = function(stem, from, to) {
    from = [from, Const.virama].join('');
    to = [to, Const.virama].join('');
    var re = new RegExp(from + '$');
    return stem.replace(re, to);
}


function ulog () {
    var obj = arguments[0];
    if (arguments.length > 1) {
        console.log('==', arguments[0], '==');
        var obj = arguments[1];
    }
    console.log(util.inspect(obj, showHidden=false, depth=null, colorize=true));
}

function log() { console.log.apply(console, arguments) }

utils.prototype.log = function() {
    console.log.apply(console, arguments)
}
