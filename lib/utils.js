var Const = require('./const');
var debug = (process.env.debug == 'true') ? true : false;

module.exports = utils();

function utils() {
    if (!(this instanceof utils)) return new utils();
    return this;
}

var self = this;

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

utils.prototype.nasal =
utils.prototype.class5 = function(v) {
    var res;
    Const.constable.forEach(function(str) {
        if (str.indexOf(v) > -1) res = str[4];
    });
    return res;
}

utils.prototype.hard2soft = function(str) {
    var hard = [];
    str.split('').map(function(v) {
        Const.constable.forEach(function(row) {
            if (row.indexOf(v) < 0) return;
            var idx = row.indexOf(v);
            hard.push(idx+2);
        });
    });
    return hard;
}

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

utils.prototype.debug = function() {
    if (!debug) return;
    console.log.apply(console, arguments)
}
