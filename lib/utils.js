var _ = require('underscore');
var shiva = require('shiva-sutras');
var util = require('util');
var Const = require('./const');
var c = require('./const');
var debug = (process.env.debug == 'true') ? true : false;

module.exports = utils();

function utils() {
    if (!(this instanceof utils)) return new utils();
    return this;
}

// var self = this;

utils.prototype.c = utils.prototype.isIN = utils.prototype.include = function(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

utils.prototype.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

utils.prototype.startsWith = function(str, prefix) {
    return str.slice(0, prefix.length) == prefix;
}

utils.prototype.arr2virama = function(arr) {
    return arr.map(function(str) { return [str, Const.virama].join(''); });
}

utils.prototype.wolast = function(str) {
    return str.slice(0,-1);
}

utils.prototype.wolast2 = function(str) {
    return str.slice(0,-2);
}

utils.prototype.wofirst = function(str) {
    return str.slice(1);
}

utils.prototype.wofirst2 = function(str) {
    return str.slice(2);
}

utils.prototype.wofirstIfVow = function(str) {
    var vowel = (c.allvowels.indexOf(str[0]) > -1) ? true : false;
    return (vowel) ? str.slice(1) : str;
}

utils.prototype.first = function(str) {
    return str[0];
}

utils.prototype.last = function(str) {
    return str.slice(-1);
}

utils.prototype.penult = function(str) {
    return str.slice(-2, -1);
}

utils.prototype.isVowel = function(sym) {
    return this.include(c.allligas, sym) || this.include(c.allvowels, sym);
}

utils.prototype.isVowExA = function(sym) {
    return this.include(c.allexa, sym);
}

utils.prototype.isVirama = function(sym) {
    return sym == c.virama;
}

utils.prototype.isVisarga = function(sym) {
    return sym == c.visarga;
}

utils.prototype.isAnusvara = function(sym) {
    return sym == c.anusvara;
}

utils.prototype.isCandra = function(sym) {
    return sym == c.candra;
}

utils.prototype.isSemiVowel = function(sym) {
    return this.include(c.yaR, sym);
}

utils.prototype.vowel = function(sym) {
    var row = vowrow(sym);
    var idx = row.indexOf(sym);
    if (this.c([2,4,6,8], idx)) return row[idx-1];
    if (idx == 0) return row[1];
}

// vow, dirgha, liga, dl, semivow, guna, gl, vriddhi, vl
utils.prototype.liga = function(sym) {
    if (sym == 'अ') return '';
    var row = vowrow(sym);
    var idx = row.indexOf(sym);
    if (this.c([1,3,5,7], idx)) return row[idx+1];
}

utils.prototype.dirgha = function(sym) {
    // должен отдавать долгую полную, только если на входе краткая, к.лига, и долгая лига
    if (this.vowel(sym) == 'ऌ') return 'ॠ'; // FIXME: - или добавить f,F в vowrow?
    var row = vowrow(sym);
    var idx = row.indexOf(sym);
    if (this.c([1,2,3,4], idx)) return row[3];
}

// dirgha-liga
// semivow, vow, liga, dirgha, dl, guna, gl, vriddhi, vl
utils.prototype.dliga = function(sym) {
   // NB ==> должно быть равно u.liga(u.dirgha)
    var row = vowrow(sym);
    var idx = row.indexOf(sym);
    if (this.c([1,2,3,4], idx)) return row[4];
}

// semi-vowel - от любой гласной ряда
utils.prototype.svow = function(sym) {
    return vowrow(sym)[0];
}

utils.prototype.guna = function(sym) {
    // только если на входе краткая, лига, долгая и д.лига - а vriddhi? похоже, тоже?
    var row = vowrow(sym);
    var idx = row.indexOf(sym);
    if (this.c([1,2,3,4], idx)) return row[5];
}

// guna-liga
utils.prototype.gliga = function(sym) {
    var row = vowrow(sym);
    var idx = row.indexOf(sym);
    if (this.c([1,2,3,4], idx)) return row[6];
}

utils.prototype.vriddhi = function(sym) {
    var row = vowrow(sym);
    var idx = row.indexOf(sym);
    if (this.c([1,2,3,4], idx)) return row[7];
}

utils.prototype.vliga = function(sym) {
    var row = vowrow(sym);
    var idx = row.indexOf(sym);
    if (this.c([1,2,3,4], idx)) return row[8];
}

function vowrow(sym) {
    return _.find(Const.vowtable, function(row) {
        return (row.indexOf(sym) > -1);
    }) || '';
}


// base - другой similar - не сравнение, а основной звук
utils.prototype.base = function(sym) {
    return vowrow(sym)[1];
}


utils.prototype.similar = function(a, b) {
    if (a == 'ृ' && b == 'ऌ') return true; // FIXME: all variants needed?
    var arow = vowrow(a);
    var brow = vowrow(b);
    return (arow == brow);
}

// FIXME: в новом стиле
utils.prototype.hrasva = function(sym) {
    return shiva([sym]).hrasva().end()[0];
}

utils.prototype.isHrasva = function(sym) {
    return this.c(c.hrasva, sym);
}

utils.prototype.isConsonant = function(sym) {
    return (this.c(Const.hal, sym));
}

utils.prototype.isSimple = function(sym) {
    return (this.c(Const.allsimples, sym)); //  [ 'इ', 'उ', 'ऋ', 'ऌ', 'ई', 'ऊ', 'ॠ' ]
}

utils.prototype.isaA = function(sym) {
    return (this.c(Const.hal, sym) || sym == Const.A);
}

utils.prototype.endsaA = function(str) {
    var sym = str.slice(-1);
    return (this.c(Const.hal, sym) || sym == Const.A);
}

utils.prototype.startsaA = function(str) {
    return (this.c(Const.aA, str[0]));
}

utils.prototype.vowsound = function(str) {
    var sym = str.slice(-1);
    return (this.c(Const.hal, sym) || this.c(Const.allligas, sym) || this.c(Const.allvowels, sym));
    // return (this.c(Const.hal, sym) || this.c(Const.allligas, sym) || this.c(Const.allvowels, sym) || this.c(Const.dirgha, sym));
    // FIXME: это неверно - почему долгие нужно писать отдельно?
}

utils.prototype.vowshort = function(str) {
    var sym = str.slice(-1);
    return (this.c(Const.hal, sym) || this.c(Const.ligas, sym));
}

utils.prototype.isShortSound = function(sym) {
    return (this.c(Const.hal, sym) || this.c(Const.hrasva_ligas, sym) || this.c(Const.vowels, sym));
}

// ============== CONSONANTS ===============

function consrow(sym) {
    return _.find(Const.constable, function(row) {
        return (row.indexOf(sym) > -1);
    }) || '';
}

utils.prototype.voicing = function(str) {
    for (var uv in Const.unvoiced2voiced) {
        var v = Const.unvoiced2voiced[uv];
        str = str.replace(uv, v);
    }
    return str;
}

utils.prototype.class1 = function(v) {
    var res;
    Const.constable.forEach(function(str) {
        if (str.indexOf(v) > -1) res = str[0];
    });
    return res;
}

utils.prototype.class3 = function(v) {
    var res;
    Const.constable.forEach(function(str) {
        if (str.indexOf(v) > -1) res = str[2];
    });
    return res;
}

utils.prototype.class4 = function(v) {
    var res;
    Const.constable.forEach(function(str) {
        if (str.indexOf(v) > -1) res = str[3];
    });
    return res;
}

utils.prototype.nasal =
utils.prototype.class5 = function(v) {
    var res;
    Const.constable.forEach(function(str) {
        if (str.indexOf(v) > -1) res = str[4];
    });
    return res;
}

utils.prototype.soft2hard = function(v) {
    var hard;
    Const.constable.forEach(function(row) {
        if (row.indexOf(v) < 0) return;
        var idx = row.indexOf(v);
        if (idx != 2 && idx != 3) return;
        hard = row[idx-2];
    });
    return hard || v;
}

utils.prototype.hard2soft = function(v) {
    var hard;
    Const.constable.forEach(function(row) {
        if (row.indexOf(v) < 0) return;
        var idx = row.indexOf(v);
        if (idx != 0 && idx != 1) return;
        hard = row[idx+2];
    });
    return hard || v;
}

// select only soft
utils.prototype.soft = function(table) {
    if (!table) table = Const.constable;
    else if (typeof(table) == 'string') table = [table];
    var res = table.map(function(row) {
        var hard = [];
        row.split('').forEach(function(sym, idx) {
            if (idx > 1 && idx < 4) hard.push(sym);
        });
        return hard.join('');
    });
    return res.join('');
}

utils.prototype.hard = function(table) {
    if (!table) table = Const.constable;
    else if (typeof(table) == 'string') table = [table];
    var res = table.map(function(row) {
        var hard = [];
        row.split('').forEach(function(sym, idx) {
            if (idx < 2) hard.push(sym);
        });
        return hard.join('');
    });
    return res.join('');
}

utils.prototype.eqvarga = function(a, b) {
    return consrow(a) == consrow(b);
}

utils.prototype.cavarga =
utils.prototype.palatal = function() {
    return Const.constable[1];
}

utils.prototype.tavarga =
    utils.prototype.dental = function() {
        return Const.constable[3];
    }

utils.prototype.wavarga =
    utils.prototype.cerebral = function() {
        return Const.constable[2];
    }

utils.prototype.pavarga =
    utils.prototype.labial = function() {
        return Const.constable[4];
    }

utils.prototype.dental2palatal = function(v) {
    return this.palatal()[this.dental().indexOf(v)];
}

utils.prototype.palatal2dental = function(v) {
    return this.dental()[this.palatal().indexOf(v)];
}

utils.prototype.dental2cerebral = function(v) {
    return this.cerebral()[this.dental().indexOf(v)];
}

utils.prototype.cerebral2dental = function(v) {
    return this.dental()[this.cerebral().indexOf(v)];
}


// utils.prototype.spcons = function(a, b) { // spaced consonant
//     return [a, Const.virama, ' ', b].join('');
// }


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

// FIXME: здесь только 1-4 классы должны быть и ya, va, la
utils.prototype.jhar2nasal = function(c) {
    if (isIN(['ग', 'ध', 'ख', 'क'], c)) return 'ङ' //
    else if (isIN(['ज', 'झ', 'छ', 'च', 'य'], c)) return 'ञ' //
    else if (isIN(['ड', 'ढ', 'ठ', 'ट'], c)) return 'ण' // N
    else if (isIN(['द', 'ध', 'थ', 'त', 'ल']), c) return 'न' // n
    else if (isIN(['ब', 'भ', 'फ', 'प', 'व'], c)) return 'म'; // m
    else return '';
}





utils.prototype.den2pal = function(v) {
    return Const.palatal[Const.dental.indexOf(v)];
}

utils.prototype.pal2den = function(v) {
    return Const.dental[Const.palatal.indexOf(v)];
}

utils.prototype.den2cer = function(v) {
    return Const.cerebral[Const.dental.indexOf(v)];
}

utils.prototype.cer2den = function(v) {
    return Const.dental[Const.cerebral.indexOf(v)];
}


// g - 'ग', 'ध', 'ख', 'क', 'ह'
// j - 'ज', 'झ', 'छ', 'च', 'श'
// D - 'ड', 'ढ', 'ठ', 'ट', 'ष'
// d - 'द', 'ध', 'थ', 'त', 'स'
// b - 'ब', 'भ', 'फ', 'प'

utils.prototype.combine = function(first, second, ends, starts) {
    // second = second.slice(1);
    var res = {};
    res.firsts = ends.map(function(e) {
        return [first, e].join('');
    });
    res.seconds = starts.map(function(s) {
        return [s, second].join('');
    });
    return res;
}

utils.prototype.fourBySpace = function(ends, starts) {
    var res = [];
    ends.forEach(function(e) {
        starts.forEach(function(s) {
            res.push([e, s].join(' '));
        });
    });
    return res;
}

utils.prototype.replaceByPos = function(samasa, pattern, sandhi, pos) {
    var first = samasa.slice(0, pos);
    var second = samasa.slice(pos);
    var result = second.replace(pattern, sandhi);
    return [first, result].join('');
}

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

function correct(sects, samasa) {
    var corr = true;
    sects.forEach(function(sect) {
        if (sect.length < 2 ) corr = false;
    });
    return corr;
}

// ===== internal ====

utils.prototype.ultima = function(stem) {
    var clean = stem.replace(/्$/, '');
    return (clean == stem) ? stem.slice(-1) : clean.slice(-1);
}


// internal.js
utils.prototype.unvoiced2voiced_unasp = function(lett) {
    var idx = Const.unvoiced_unasp.indexOf(lett);
    return Const.voiced_unasp[idx];
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

// utils.prototype.virama = function(stem) {
//     var clean = stem.replace(/्$/, '');
//     return (clean == stem) ? false : true;
// }

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

utils.prototype.p = function() {
    var vs = _.values(arguments);
    if (vs.length == 1) vs = vs[0];
    console.log(util.inspect(vs, showHidden=false, depth=null, colorize=true));
}

utils.prototype.debug = function() {
    if (!debug) return;
    console.log.apply(console, arguments)
}
