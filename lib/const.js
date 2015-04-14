//

var shiva = require('shiva-sutras');
// var shiva = require('../../shiva'); // FIXME - for duo

var Const = {};

Const.consonants = shiva('हल्').result;
Const.diphtongs = shiva('एच्').result;

Const.dirghaLiga = {
    'आ': 'ा', // A
    'अ': 'ा', // a
    'ा': 'ा', // a
    'ई': 'ी', // I
    'इ': 'ी', // i
    'ि': 'ी', // i
    'ी': 'ी', // trivial
    'ऊ': 'ू', // U
    'उ': 'ू', // u
    'ु': 'ू', // u
    'ू': 'ू', // trivial
    'ऋ': 'ॄ', // r
    'ॠ': 'ॄ', // R
    'ृ': 'ॄ', //
    'ॄ': 'ॄ', // trivial
    'ऌ': 'ॄ', // L-R
}

Const.vriddhiLiga = {
    'ए': 'ै', // e-E
    'ऐ': 'ै', // e-E
    'ओ': 'ौ', // o-O
    'औ': 'ौ', // o-O
}

Const.gunaLiga = {
    'इ': 'े',
    'ई': 'े',
    'उ': 'ो',
    'ऊ': 'ो',
    'ऋ': 'र्',
    'ॠ': 'र्',
    'ऌ': 'ल्',
    '': '',
    '': '',
}

// Const.vWOa = shiva('अच्', true).del(['अ', 'आ']).result;
Const.iurlIUR = ['इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ॠ', 'ऌ']

Const.virama = '्';

Const.vowels = shiva('अच्').result;
Const.ligas = shiva('अच्').liga().result;
Const.dirghas = shiva('अच्').dirgha.result;
Const.allvowels = shiva('अच्').add(shiva('अच्').dirgha()).result;
Const.allligas = shiva('अच्').liga().add(shiva('अच्').dirgha().liga()).result;

Const.A = 'ा';

// ============= OLD
// Const.xxx = shiva('यण्').result;
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
    //'आ': 'अ', // A a
    'ई': 'इ', // I i
    'ऊ': 'उ', // U u
    'ू': 'ु', // U u
    'ी': 'ि', // I i
    //'': '',
}

Const.exceptions = {
    'स्निग्': 'स्निह्',
    // '': '',
    // '': '',
    // '': '',
}

module.exports = Const;
