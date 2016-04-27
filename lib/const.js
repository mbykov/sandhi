//

var shiva = require('shiva-sutras');

var Const = {};


Const.diphtongs = shiva('एच्').end();
Const.gunas = shiva('एङ्').end();
Const.vriddhis = shiva('ऐच्').end();

Const.oM = 'ॐ';
Const.virama = Const.V = '्';
Const.candra = 'ँ';
Const.anusvara = Const.M = 'ं';
Const.avagraha = 'ऽ';
Const.visarga = Const.H = 'ः';
Const.anunasika = 'xxx'; // FIXME:
Const.special = [Const.virama, Const.anusvara, Const.avagraha, Const.candra];

Const.cannotbeg = ['ॠ', 'ऌ', 'ङ', 'ञ', 'ण', Const.anusvara, Const.visarga];
Const.cannotfinvow = ['ॠ', 'ऌ'];
Const.cannotfinligas = ['ॄ', 'ॢ'];
Const.shouldfincons = ['क', 'ट', 'त', 'प', 'ङ', 'ण', 'न', 'म', 'ल', 'स', 'द', Const.visarga];
// द् in  here is for etad in tests, so FinCons should include all soft cons also?
Const.doubledns = ['ङ्ङ', 'ण्ण', 'न्न'];
// Const.doubledns = ['ङ', 'ण', 'न'];


Const.vowels = shiva('अच्').end();
Const.ligas = shiva('अच्').liga().end();
Const.dirgha = shiva('अक्').dirgha().end();
Const.hrasva = shiva('अक्').hrasva().end();
Const.dirgha_ligas = shiva('अक्').dirgha().liga().end();
Const.hrasva_ligas = shiva('अक्').hrasva().liga().end();
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

Const.h = 'ह';
Const.D = 'ध';
Const.G = 'घ';
Const.S = 'श';
Const.z = 'ष';
Const.s = 'स';
Const.Szs = ['श', 'ष', 'स'];
Const.C = 'छ';
Const.cC = ['च', 'छ'];
Const.wW = ['ट', 'ठ'];
Const.tT = ['त', 'थ'];
Const.cCwWtT = ['च', 'छ', 'ट', 'ठ', 'त', 'थ']; // как-то переименовать, а то путаница
Const.o = 'ो';
Const.e = 'े';
Const.yalava = ['य', 'ल', 'व'];
Const.jJ = ['ज', 'झ'];

// semivow, vow, liga, dirgha, dl, guna, gl, vriddhi, vl
Const.vowtable = [
    '-अ-आा',
    'यइिईीएेऐै',
    'वउुऊूओोऔौ',
    'रऋृॠॄ',
    'लऌॢ--', // dirgha-F? dliga?
];



Const.jhal = Const.Jal = shiva('झल्').end(); // 4th. 3rd. 2nd. & 1st. letters of class consonants, the sibilant and the aspirate
Const.JaS = Const.onlysoft = Const.voiced = shiva('झश्').end(); // 4th. & 3rd. letters of class consonants, soft झ,भ,घ,ढ,ध,ज,ब,ग,ड,द
Const.Jay = shiva('झय्').end(); // cons. hard+soft, 4321, mute
Const.Nay = shiva('ञय्').end(); // cons. nas + hard+soft
Const.Nam = shiva('ङम्').end(); // ङ,ण,न - three nasals
Const.jaS = Const.class3 = shiva('जश्').end(); // soft unaspirate - ज,ब,ग,ड,द
Const.aS = shiva('अश्').end(); // (a) the Vowels, (b) the aspirate h and the  semi-vowels (c) the 5th., 4th. & 3rd. letters of five class consonants - // i.e. अ,इ,उ,ऋ,ऌ,ए,ओ,ऐ,औ,ह,य,व,र,ल,ञ,म,ङ,ण,न,झ,भ,घ,ढ,ध,ज,ब,ग,ड,द
Const.Kar = shiva('खर्').end(); // hard stops - ख,फ,छ,ठ,थ,च,ट,त,क,प,श,ष,स
Const.Kay = Const.hard = Const.unvoiced= shiva('खय्').end(); // hard - unvoiced stops - ख,फ,छ,ठ,थ,च,ट,त,क,प
Const.car = shiva('चर्').end(); // hard unaspirate = 1class + sibilants = च,ट,त,क,प,श,ष,स
Const.yam = shiva('यम्').end(); // semivowels + nasals
Const.yay = shiva('यय्').end(); // const but sibilants, but h - य,व,र,ल,ञ,म,ङ,ण,न,झ,भ,घ,ढ,ध,ज,ब,ग,ड,द,ख,फ,छ,ठ,थ,च,ट,त,क,प
Const.yaS = shiva('यश्').end(); // soft stops +
Const.semivows = Const.semivowels = Const.yaR = shiva('यण्').end();
Const.yava = Const.yaR.slice(0,2);
Const.rala = Const.yaR.slice(-2);
Const.ra = 'र';
Const.haS = Const.soft = shiva('हश्').end(); // all soft consonants ह,य,व,र,ल,ञ,म,ङ,ण,न,झ,भ,घ,ढ,ध,ज,ब,ग,ड,द ; i.e. has semivowels, onlysoft has not
Const.yar = shiva('यर्').end(); // all consonants ex. h
Const.cay = shiva('चय्').end(); // 1st class, hard unaspirated [ 'च', 'ट', 'त', 'क', 'प' ]
Const.hal = Const.consonants = Const.cons = shiva('हल्').end(); // all consonants
// ===================
Const.way = shiva('टय्').end(); // ट,त,क,प - k t ṭ p - 1st class ex. c
Const.mam = shiva('मम्').end(); // म ङ ण न - 5st class ex. N
Const.baS = shiva('बश्').end(); // ब ग ड द श्
Const.Yam = Const.nasals = shiva('ञम्').end(); // ञ म ङ ण न
Const.YaNaRa = ['ञ', 'ङ', 'ण'];
Const.nm = ['न', 'म'];
Const.n = 'न';
Const.m = 'म';
Const.Sal = Const.sibs_h = shiva('शल्').end(); // श,ष,स,ह - sibilant + h
Const.Sar = Const.sibilants = shiva('शर्').end(); // श,ष,स - sibilant

Const.gutturals = ['क', 'ख', 'ग', 'घ', 'ङ'];
Const.palatals = ['च', 'छ', 'ज', 'झ', 'ञ', 'श'];
Const.cerebrals = ['ट', 'ठ', 'ड', 'ढ', 'ण', 'ष'];
Const.dentals = ['त', 'थ', 'द', 'ध', 'न', 'स'];
Const.labials = ['प', 'फ', 'ब', 'भ', 'म', 'व'];

// if (inc(c.cC, mark.beg)) fin = 'श';
// else if (o.fin == 'ष' && inc(c.wW, o.beg));
// else if (o.fin == 'स' && inc(c.tT, o.beg));

Const.cCtTwW = {
    'च': 'श',
    'छ': 'श',
    'त': 'स',
    'थ': 'स',
    'ट': 'ष',
    'ठ': 'ष'
}

Const.constable = [
    'कखगघङ  ह',
    'चछजझञयश',
    'टठडढणरष',
    'तथदधनलस',
    'पफबभमव'
];


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

// ============= OLD - пока нельзя убрать - сюда завязан Morpheus
//Const.nasals = shiva('ञम्').end(); // ञ म ङ ण न म्
Const.voiced_asp = shiva('झष्').end();
Const.unvoiced_asp = shiva('खव्').del('चव्').end();
Const.asps = Const.voiced_asp.concat(Const.unvoiced_asp).sort();
Const.voiced_unasp = shiva('जश्').result.sort();
Const.unvoiced_unasp = shiva('चय्').result.sort();
Const.unasps = Const.voiced_unasp.concat(Const.unvoiced_unasp).sort();
// Const.unvoiced;
Const.gdb = ['ग', 'द', 'ब'];
Const.GDB = ['घ', 'ध', 'भ'];
//Const.voiced_asp_h = shiva('झष्').add(['ह']).end();
Const.BsDv = ['भ', 'स', 'ध्व'];
Const.zq = ['ष', 'ड'];
Const.tT = ['त', 'थ'];
Const.tTD = ['त', 'थ', 'ध'];
Const.t_h = ['त', 'ह'];
Const.wW = ['ट', 'ठ'];
Const.zS = ['ष', 'श'];
//Const.retroflex = ['ट', 'ठ', 'ड', 'ढ', 'ण', 'र', 'ष'];
Const.qQ = ['ड', 'ढ'];


module.exports = Const;
