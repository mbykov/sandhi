//

var shiva = require('shiva-sutras');
// var shiva = require('../../shiva'); // FIXME - for duo

var Const = {};

Const.consonants = shiva('हल्').result;
Const.diphtongs = shiva('एच्').result;
Const.gudiphs = shiva('एङ्').result; // e-o
Const.vridiphs = shiva('ऐच्').result; // E-O

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
Const.anusvara = 'ं';

Const.vowels = shiva('अच्').result;
Const.ligas = shiva('अच्').liga().result;
Const.dirghas = shiva('अच्').dirgha().result;
Const.allvowels = shiva('अच्').add(shiva('अच्').dirgha()).result; // <== uncorrect sorting !!!
Const.allligas = shiva('अच्').liga().add(shiva('अच्').dirgha().liga()).result;
Const.allsimples = shiva('इक्').add(shiva('इक्').dirgha()).result; // iurl+long

Const.palatal = ['च', 'छ', 'ज', 'झ', 'ञ', 'श'];
Const.dental = ['त', 'थ', 'द', 'ध', 'न', 'स'];
Const.cerebral = ['ट', 'ठ', 'ड', 'ढ', 'ण', 'ष'];
Const.tavarga = ['त', 'थ', 'द', 'ध', 'न'];

Const.A = 'ा';
Const.a = 'अ';
Const.aA = ['अ', 'आ'];
Const.avagraha = 'ऽ';

Const.vow2semi = {
    'इ': 'य',
    'ई': 'य',
    'उ': 'व',
    'ऊ': 'व',
    'ऋ': 'र',
    'ॠ': 'र',
    'ऌ': 'ल'
}

Const.vow2liga = {
    'अ': '',
    'आ': 'ा',
    'इ': 'ि',
    'ई': 'ी',
    'उ': 'ु',
    'ऊ': 'ू',
    'ऋ': 'ृ',
    'ॠ': 'ॄ',
    'ऌ': 'ॢ',
    'ए': 'े',
    'ऐ': 'ै',
    'ओ': 'ो',
    'औ': 'ौ'
}

Const.liga2vow = {
    'ा': 'आ',
    'ि': 'इ',
    'ी': 'ई',
    'ु': 'उ',
    'ू': 'ऊ',
    'ृ': 'ऋ',
    'ॄ': 'ॠ',
    'ॢ': 'ऌ',
    'े': 'ए',
    'ै': 'ऐ',
    'ो': 'ओ',
    'ौ': 'औ'
}

Const.jhal = shiva('झल्').result; // 4th. 3rd. 2nd. & 1st. letters of class consonants, the sibilant and the aspirate
Const.JaS = shiva('झश्').result; // 4th. & 3rd. letters of class consonants
Const.jaS = shiva('जश्').result; // soft unaspirate - ज,ब,ग,ड,द
Const.aS = shiva('अश्').result; // (a) the Vowels, (b) the aspirate h and the  semi-vowels (c) the 5th., 4th. & 3rd. letters of five class consonants - // i.e. अ,इ,उ,ऋ,ऌ,ए,ओ,ऐ,औ,ह,य,व,र,ल,ञ,म,ङ,ण,न,झ,भ,घ,ढ,ध,ज,ब,ग,ड,द
Const.Kar = shiva('खर्').result; // hard stops
Const.car = shiva('चर्').result; // 1st column, hard unaspirate
Const.yam = shiva('यम्').result; // semivowels + nasals
Const.haS = shiva('हश्').result; // soft consonants
Const.yar = shiva('यर्').result; // all consonants ex. h

// JaS - soft - झ,भ,घ,ढ,ध,ज,ब,ग,ड,द
// Kar - hard - ख,फ,छ,ठ,थ,च,ट,त,क,प,श,ष,स
// Const.JaS2Kar = {
//     'घ': 'ख',
//     'झ': 'छ',
//     'ढ': 'ठ',
//     'ध': 'थ',
//     'भ': 'फ',
//     'ग': 'क',
//     'ज': 'च',
//     'ड': 'ट',
//     'द': 'त',
//     'ब': 'प',
// }

Const.palatal_soft2dental_hard = {
    'ज': 'त',
    'झ': 'थ',
}

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
