//

var shiva = require('shiva-sutras');
// var shiva = require('../../shiva'); // FIXME - for duo

var Const = {};

Const.consonants = shiva('हल्').end(); // .hal
Const.diphtongs = shiva('एच्').end();
Const.gunas = shiva('एङ्').end();
Const.vriddhis = shiva('ऐच्').end();

Const.virama = '्';
Const.candra = 'ँ';
Const.anusvara = 'ं';
Const.avagraha = 'ऽ';
Const.visarga = 'ः';
Const.special = [Const.virama, Const.anusvara, Const.avagraha, Const.candra];

Const.vowels = shiva('अच्').end();
Const.ligas = shiva('अच्').liga().end();
Const.dirgha = shiva('अक्').dirgha().end();
Const.dirgha_ligas = shiva('अक्').dirgha().liga().end();
Const.allvowels = shiva('अच्').add(shiva('अच्').dirgha()).end(); // <== uncorrect sorting !!!
Const.allligas = shiva('अच्').liga().add(shiva('अच्').dirgha().liga()).end();
Const.allexa = shiva('इच्').add(shiva('अच्').dirgha()).end(); //
Const.allsimples = shiva('इक्').add(shiva('इक्').dirgha()).end(); // iurl+long
Const.allsimpleligas = shiva('इक्').add(shiva('इक्').dirgha()).liga().end(); // iurl+long

Const.A = 'ा';
Const.a = 'अ';
Const.aA = ['अ', 'आ'];
Const.aAliga = ['', 'ा'];
Const.avagraha = 'ऽ';
Const.iI = ['इ', 'ई'];
Const.uU = ['उ', 'ऊ'];
Const.fF = ['ऋ', 'ॠ'];
Const.L = 'ऌ';

// semivow, vow, liga, dirgha, dl, guna, gl, vriddhi, vl
Const.vowtable = [
    '-अ-आा',
    'यइिईीएेऐै',
    'वउुऊूओोऔौ',
    'रऋृॠॄ',
    'लऌॢ--', // dirgha-F? dliga?
];



Const.jhal = shiva('झल्').end(); // 4th. 3rd. 2nd. & 1st. letters of class consonants, the sibilant and the aspirate
Const.JaS = shiva('झश्').end(); // 4th. & 3rd. letters of class consonants
Const.Jay = shiva('झय्').end(); // cons. hard+soft, 4321, mute
Const.Nay = shiva('ञय्').end(); // cons. nas + hard+soft
Const.Nam = shiva('ङम्').end(); // ङ,ण,न - three nasals
Const.jaS = Const.class3 = shiva('जश्').end(); // soft unaspirate - ज,ब,ग,ड,द
Const.aS = shiva('अश्').end(); // (a) the Vowels, (b) the aspirate h and the  semi-vowels (c) the 5th., 4th. & 3rd. letters of five class consonants - // i.e. अ,इ,उ,ऋ,ऌ,ए,ओ,ऐ,औ,ह,य,व,र,ल,ञ,म,ङ,ण,न,झ,भ,घ,ढ,ध,ज,ब,ग,ड,द
Const.Kar = shiva('खर्').end(); // hard stops - ख,फ,छ,ठ,थ,च,ट,त,क,प,श,ष,स
Const.Kay = shiva('खय्').end(); // unvoiced stops - ख,फ,छ,ठ,थ,च,ट,त,क,प
Const.car = shiva('चर्').end(); // 1st column, hard unaspirate
Const.yam = shiva('यम्').end(); // semivowels + nasals
Const.semivows = Const.yaR = shiva('यण्').end();
Const.yava = Const.yaR.slice(0,2);
Const.haS = shiva('हश्').end(); // soft consonants
Const.yar = shiva('यर्').end(); // all consonants ex. h
Const.cay = shiva('चय्').end(); // 1st class, hard unaspirated [ 'च', 'ट', 'त', 'क', 'प' ]
Const.hal = shiva('हल्').end(); // all consonants
// ===================
Const.way = shiva('टय्').end(); // ट,त,क,प - k t ṭ p - 1st class ex. c
Const.mam = shiva('मम्').end(); // म ङ ण न - 5st class ex. N
Const.baS = shiva('बश्').end(); // ब ग ड द श्
Const.Yam = Const.nasals = shiva('ञम्').end(); // ञ म ङ ण न म्
Const.nm = ['न', 'म'];
Const.Sal = shiva('शल्').end(); // श,ष,स,ह - sibilant + h
// Const.nasal_nm = shiva('मम्').shiva(['न', 'म']).end();
// Const.finalhard_nm = shiva('टय्').shiva(['न', 'म']).end();


Const.palatal = ['च', 'छ', 'ज', 'झ', 'ञ', 'श'];
Const.dental = ['त', 'थ', 'द', 'ध', 'न', 'स'];
Const.cerebral = ['ट', 'ठ', 'ड', 'ढ', 'ण', 'ष'];
Const.tavarga = Const.labial =['त', 'थ', 'द', 'ध', 'न'];


Const.constable = [
    'कखगघङ  ह',
    'चछजझञयश',
    'टठडढणरष',
    'तथदधनलस',
    'पफबभमव'
];

// look u.palatal(), etc


Const.palatal_soft2dental_hard = {
    'ज': 'त',
    'झ': 'थ',
}

Const.palatal_soft2dental_hard = {
    'ज': 'त',
    'झ': 'थ',
}

Const.cerebral_soft2dental_hard = {
    'ड': 'त',
    'ढ': 'थ',
}

Const.unvoiced2voiced = {
    'क': 'ग',
    'च': 'ज',
    'ट': 'ड',
    'त': 'द',
    'प': 'ब',
    'ख': 'घ',
    'छ': 'झ',
    'ठ': 'ढ',
    'थ': 'ध',
    'फ': 'भ',
    '': '',
}

// ============= OLD
// xxx
// //Const.nasals = shiva('ञम्').end(); // ञ म ङ ण न म्
// Const.voiced_asp = shiva('झष्').end();
// Const.unvoiced_asp = shiva('खव्').del('चव्').end();
// Const.asps = Const.voiced_asp.concat(Const.unvoiced_asp).sort();
// Const.voiced_unasp = shiva('जश्').result.sort();
// Const.unvoiced_unasp = shiva('चय्').result.sort();
// Const.unasps = Const.voiced_unasp.concat(Const.unvoiced_unasp).sort();
// // Const.unvoiced;
// Const.gdb = ['ग', 'द', 'ब'];
// Const.GDB = ['घ', 'ध', 'भ'];
// //Const.voiced_asp_h = shiva('झष्').add(['ह']).end();
// Const.BsDv = ['भ', 'स', 'ध्व'];
// Const.zq = ['ष', 'ड'];
// Const.tT = ['त', 'थ'];
// Const.tTD = ['त', 'थ', 'ध'];
// Const.t_h = ['त', 'ह'];
// Const.wW = ['ट', 'ठ'];
// Const.zS = ['ष', 'शे'];
// //Const.retroflex = ['ट', 'ठ', 'ड', 'ढ', 'ण', 'र', 'ष'];


// Const.longshort = {
//     //'आ': 'अ', // A a
//     'ई': 'इ', // I i
//     'ऊ': 'उ', // U u
//     'ू': 'ु', // U u
//     'ी': 'ि', // I i
//     //'': '',
// }

// Const.exceptions = {
//     'स्निग्': 'स्निह्',
//     // '': '',
//     // '': '',
//     // '': '',
// }

module.exports = Const;
