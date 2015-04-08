//

var shiva = require('shiva-sutras');

var Const = {};

Const.virama = '्';
Const.vowels = shiva('अच्').result;
Const.semivowels = shiva('यण्').result;
Const.consonants = shiva('हल्').result;
Const.nasals = shiva('ञम्').result; // ञ म ङ ण न म्
Const.voiced_asp = shiva('झष्').result;
Const.unvoiced_asp = shiva('खव्').del('चव्').result;
Const.asps = Const.voiced_asp.concat(Const.unvoiced_asp).sort();
Const.voiced_unasp = shiva('जश्').result.sort();
Const.unvoiced_unasp = shiva('चय्').result.sort();
Const.unasps = Const.voiced_unasp.concat(Const.unvoiced_unasp).sort();
Const.unvoiced;
Const.gdb = ['ग', 'द', 'ब'];
Const.GDB = ['घ', 'ध', 'भ'];
//Const.voiced_asp_h = shiva('झष्').add(['ह']).result;
Const.BsDv = ['भ', 'स', 'ध्व'];
Const.zq = ['ष', 'ड'];
Const.tT = ['त', 'थ'];
Const.tTD = ['त', 'थ', 'ध'];
Const.t_h = ['त', 'ह'];
Const.wW = ['ट', 'ठ'];
Const.zS = ['ष', 'शे'];
//Const.retroflex = ['ट', 'ठ', 'ड', 'ढ', 'ण', 'र', 'ष'];


Const.longshort = {
    //"आ": "अ", // A a
    "ई": "इ", // I i
    "ऊ": "उ", // U u
    "ू": "ु", // U u
    "ी": "ि", // I i
    //"": "",
}

Const.exceptions = {
    'स्निग्': 'स्निह्',
    // '': '',
    // '': '',
    // '': '',
}

module.exports = Const;
