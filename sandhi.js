/*
  node (only, not component) module for sandhi processing
*/

var _ = require('underscore');
var util = require('util');
//var slp = require('../utils/slp');
//var shiva = require('../utils/shivasutra');
var shiva = require('../shiva');
var Const = require('./lib/const');
var u = require('./lib/utils');


var voiced_asp = shiva('झष्').result;
var unvoiced_asp = shiva('खव्').del('चव्').result;
var asps = voiced_asp.concat(unvoiced_asp);

var debug = (process.env.debug == 'true') ? true : false;

module.exports = sandhi();

function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

// TODO: результат должен быть уникальным! - _.uniq(res) !!!
// TODO: krit вынести наружу
sandhi.prototype.del = function(form, flex, cflex, prefix, krit) {
    if (prefix) return removePrefix(form, flex, cflex, krit);
    return removeSuffix(form, flex, cflex);
}

// cflex: -ti, flex: -dhi, etc, i.e. variant
function removeSuffix(form, flex, cflex, krit) {
    var stems = [];
    // условие - наружу
    var re = new RegExp(flex + '$');
    var stem = form.replace(re, '');
    // log('---------', form, flex, cflex, stem, (stem == form));
    if (stem == form) return [];

    //stems.push(stem); // default stem
    var first = cflex[0];
    var clean = stem.replace(/्$/, '');
    // log('---------', form, flex, cflex, stem, (stem == clean));
    // if (stem == clean && flex != 'ढ') return [stem]; // нельзя из-за _other - mUQa, lIQa, UQa, т.е можно попробовать все, кроме flex=Qa
    var last = clean.slice(-1);
    var flex0 = flex[0];

    var hash = {form: form, stem: stem, flex: flex, cflex: cflex};
    // hash.stems = [stem];

    //hash.first = u.ultima(stem); // stemUlt
    hash.stemUlt = u.ultima(stem);
    // hash.virama = u.virama(stem);
    // hash.second = cflex[0];


    // ========================= START =================

    // When the second letter letter is a vowel, a nasal, or a semivowel, no sandhi change of any kind will occur
    var nosandhi = Const.nasals.concat(Const.semivowels).concat(['म', Const.virama]);
    //log('sem', Const.semivowels);
    // var no_results = (hash.stems.length == 0);
    if (isIN(nosandhi, flex[0])) hash.stems = [stem];

    // EXTERNAL SANDHI THAT MATTER
    // Stops become unvoiced and unaspirated =>
    var stops = Const.unvoiced_unasp;
    // if (isIN(stops, hash.stemUlt)) unvoiced2voiced(hash);
    // противоречит nosandhi

    // === Aspirated Letters ===:
    // === Aspirated letters become unaspirated
    if (isIN(Const.asps, first)) aspiratedBecomeUnaspirated(hash);

    // === move_aspirate_forward
    // t- and th-, when they are the second letter, become dh-
    // если флексия из tT стала dh-, то окончание стема аспирируется
    var flex_starts_D = (flex[0] == 'ध');
    var cflex_in_tT = (isIN(Const.tT, cflex[0]));
    if (cflex_in_tT && flex_starts_D) move_aspirate_forward(hash);

    // === move_aspirate_backward
    var stem_ends_voiced_unasp = (isIN(Const.voiced_unasp, hash.stemUlt));
    var stem_starts_asp = (isIN(Const.asps, hash.stem[0]));
    var flex_starts_BsDv = (isIN(Const.BsDv, flex[0]) || /^ध्व/.test(flex) );
    if (stem_starts_asp && stem_ends_voiced_unasp && flex_starts_BsDv) move_aspirate_backward(hash);

    // === h is treated like gh:
    // если стем начинается на d, а флексия на tTD или _s, то gh -> h
    var cflex_in_tTD = (isIN(Const.tTD, cflex[0]));
    var stem_starts_d = (stem[0] == 'द');
    var flex_starts_Q = (flex[0] == 'ढ');
    // The second letter is s

    var cflex_starts_s = (cflex[0] == 'स');
    var flex_starts_z = (flex[0] == 'ष');
    var stem_ends_k = (hash.stemUlt == 'क');
    // retroflex_k
    // if (cflex_starts_s && flex_starts_z && stem_ends_k) h_like_gh_s_z(hash);

    // The h both ends a root that starts with d and is in front of t, th, or dh;
    if (cflex_in_tTD && stem_starts_d && flex_starts_D) {
        h_like_gh_t_D(hash);
    }
    // h_ other, i.e. Q
    if (cflex_in_tTD && flex_starts_Q) {
        h_like_gh_other(hash);
    }

    // === final letters ===
    // === final_s - A final s changes in one of two ways: 1 - s changes to t
    if (!krit) krit = true;
    var stem_ends_t = (hash.stemUlt == 'त');
    var flex_starts_s = (flex[0] == 'स');
    if (stem_ends_t && flex_starts_s && krit) final_s_t(hash);
    // s disappears when in front of d or dh.
    var dD = ['द', 'ध'];
    var flex_starts_dD = (isIN(dD, flex[0]));
    if (flex_starts_dD) final_s_zero(hash); // второго признака нет, śās + dhi → śādhi
    // TODO: s also becomes t in some parts of the reduplicated perfect

    // === final n
    // n becomes the anusvāra root ends with n && flex starts with s
    var stem_ends_anusvara = (hash.stemUlt == 'ं');
    if (stem_ends_anusvara && flex_starts_s) final_n(hash);

    // === final_m - final m becomes n in front of v
    var flex_starts_v = (flex[0] == 'व');
    var stem_ends_n = (hash.stemUlt == 'न');
    if (stem_ends_n && flex_starts_v) final_m(hash);

    // === cavarga ===
    //  c always reduces to k. But j is more irregular. It usually becomes k, but it can also become ṭ or ṣ
    // c, ś, and h are converted to k. If the c was a j before this reduction started, it might become ṭ instead. // TODO:
    var flex_in_tT = (isIN(Const.tT, flex[0]));
    // log(stem_ends_k, cflex_in_tT, flex_in_tT);
    if (stem_ends_k && cflex_in_tT && flex_in_tT) cavarga_c(hash);
    // cavarga_c addendum vazwe
    var stem_ends_z = (hash.stemUlt == 'ष');
    var flex_starts_wW = (isIN(Const.wW, flex[0]));
    // if (stem_ends_z && cflex_in_tT && flex_starts_wW) cavarga_cw(hash); // == no tests

    // A final ś changes in these ways - In front of t or th, it becomes ṣ and shifts the letter that follows it to ṭavarga.
    // log('M', stem_ends_z, cflex_in_tT, flex_starts_wW, stem, hash.stemUlt);
    if (stem_ends_z && cflex_in_tT && flex_starts_wW) cavarga_z_t_w(hash);

    // cavarga_c addendum two_lat_atm_vac - vaSe, vaSvahe, etc
    var stem_ends_S = (hash.stemUlt == 'श');
    // if (stem_ends_S && cflex_in_tT && flex_starts_wW) cavarga_cS(hash); // == no tests

    // cavarga_c addendum two_lat_atm_vac - vaSe, vaSvahe, etc

    // cavarga_c addendum draS - drakzyasi
    var flex_starts_y = (flex[0] == 'य');
    if (stem_ends_z && flex_starts_y) cavarga_z_y(hash);

    // WTF?
    // var stem_ends_zq = (isIN(Const.zq, hash.stemUlt)); // == no tests
    // var cflex_starts_tT = (isIN(Const.tT, cflex[0]));
    // if (stem_ends_kzq && cflex_starts_t_h) cavarga_j(hash);

    // FIXME: krit
    if (!krit) krit = true;
    // In front of the s of a verb suffix, it becomes k
    // if (krit && flex_starts_z && stem_ends_k) cavarga_SW(hash);

    // Changing flex _n to _Y (ñ) - the same stem

    //Retroflex letters
    // retroflex letter, if followed by a tavarga letter, shifts it to ṭavarga - the same stem

    // ṣ becomes k when followed by s
    if (flex_starts_z && cflex_starts_s && stem_ends_k) retroflex_k(hash);


    // =============================== END ============
    // временная затычка для гласных сандхи, и вообще необходимо дефолтное значение
    // if (hash.stems.length == 0) hash.stems.push(stem);

    return _.uniq(hash.stems);
}

function final_s_t(hash) {
    var stem = hash.stem.replace(/त्$/, 'स्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: final_s_t', stem);
}

// final_s_zero - that are exceptions?
function final_s_zero(hash) {
    var stem = [hash.stem, 'स्'].join('');
    if (stem == hash.stem) return;
    if (!hash.stems) hash.stems = [];
    hash.stems.push(stem); // <============= PUSH, or exceptions ?
    if (debug) log('mod: final_s_zero', stem);
}

function final_n(hash) {
    var stem = hash.stem.replace(/ं$/, 'न्');
    if (stem == hash.stems) return;
    hash.stems = [stem];
    if (debug) log('mod: final_n', stem);
}

function final_m(hash) {
    var stem = hash.stem.replace(/न्$/, 'म्');
    if (stem == hash.stems) return;
    hash.stems = [stem];
    if (debug) log('mod: final_m', stem);
}

// h is treated like gh: The h both ends a root that starts with d and is in front of t, th, or dh;
// = retroflex_k
function h_like_gh_s_z__(hash) {
    var stem = hash.stem.replace(/क्$/, 'ह्');
    if (stem == hash.stems) return;
    hash.stems = [stem];
    if (debug) log('mod: h_like_gh_s_z', stem);
}

function retroflex_k(hash) {
    var stemh = hash.stem.replace(/क्$/, 'ह्');
    var stemz = hash.stem.replace(/क्$/,'ष्');
    if (stemh == hash.stem && stemz == hash.stem) return;
    hash.stems = [stemh, stemz];
    if (debug) log('mod: retroflex_k', hash.stems);
}


function h_like_gh_t_D(hash) {
    var stem = hash.stem.replace(/ग्$/, 'ह्');
    if (stem == hash.stems) return;
    hash.stems = [stem];
    if (debug) log('mod: h_like_gh_s_z', stem);
}

// three things: 1) changes t, th, and dh — if they follow the h — into ḍh, 2) lengthens the vowel in front of it, if possible, 3) disappears
// укорачиваем гласную перед Q - два варианта, и добавляем h
function h_like_gh_other(hash) {
    // TODO: four exceptions are snih, muh, nah and dṛh
    var vowel_before_Q = hash.stem.slice(-1);
    var short_vowel = Const.longshort[vowel_before_Q];
    var re = new RegExp(vowel_before_Q + '$');
    var short_stem = hash.stem.replace(re, short_vowel);
    short_stem = [short_stem, 'ह्'].join('');
    var stem = [hash.stem, 'ह्'].join('');
    if (stem == hash.stem && short_stem == hash.stem) return;
    hash.stems = _.uniq([stem, short_stem]);
    if (debug) log('mod: h_like_gh_other', stem);
}

// t- and th-, when they are the second letter, become dh-
// если флексия tT стала dh-, то окончание стема аспирируется, d-dh
function move_aspirate_forward(hash) {
    var asp = u.unasp2asp(hash.stemUlt);
    if (!asp) return;
    var stem = u.replaceEnd(hash.stem, hash.stemUlt, asp);
    if (!stem || stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: move_aspirate_forward', stem);
}

function move_aspirate_backward(hash) {
    var asp = u.unasp2asp(hash.stemUlt);
    if (!asp) return;
    var stem = u.replaceEnd(hash.stem, hash.stemUlt, asp);
    var stem0 = hash.stem[0];
    var stem0idx = Const.GDB.indexOf(stem0);
    var stem0new = Const.gdb[stem0idx];
    stem = stem.replace(stem0, stem0new);
    if (stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: move_aspirate_backward', stem);
}

function cavarga_c(hash) {
    var stemc = hash.stem.replace(/क्$/,'च्');
    var stemj = hash.stem.replace(/क्$/,'ज्');
    // if (stemc == hash.stem && stemj == hash.stem ) return;
    hash.stems = [stemc, stemj];
    if (debug) log('mod: cavarga_c', hash.stems);
}

function cavarga_cw(hash) {
    var stem = hash.stem.replace(/ष्$/,'च्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: cavarga_cw', stem);
}

function cavarga_cS(hash) {
    var stem = hash.stem.replace(/श$/,'च्').replace(/श्$/,'च्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: cavarga_cS', stem);
}

function cavarga_j(hash) {
    var stem_z = hash.stem.replace(/ष्$/,'ज्');
    var stem_q = hash.stem.replace(/ष्$/,'ज्');
    var stems = [stem_z, stem_q];
    stems = _.uniq(_.compact(stems));
    if (stems.length == 0) return;
    hash.stems = stems;
    if (debug) log('mod: cavarga_j', stems);
}

function cavarga_SW(hash) {
    var stem = hash.stem.replace(/क्$/,'श्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: cavarga_S', stem);
}

function cavarga_z_y(hash) {
    var stem = hash.stem.replace(/क्ष्$/,'श्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: cavarga_z_y', stem);
}

function cavarga_z_t_w(hash) {
    var stemS = hash.stem.replace(/ष्$/,'श्');
    var stemc = hash.stem.replace(/ष्$/,'च्');
    var stemj = hash.stem.replace(/ष्$/,'ज्');
    // log('STEM', stemS, hash.stem);
    if (stemS == hash.stem) return;
    hash.stems = [stemS, stemc, stemj];
    if (debug) log('mod: cavarga_z_t_w', hash.stems);
}



// Aspirated letters become unaspirated
// наоборот, окончание стема без придыхания получает придыхание, кроме gh?
function aspiratedBecomeUnaspirated(hash) {
    var unasp = u.unasp2asp(hash.stemUlt);
    var stem = u.replaceEnd(hash.stem, hash.stemUlt, unasp);
    if (stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: aspiratedBecomeUnaspirated', stem);
}

function unvoiced2voiced(hash) {
    var voiced = u.unvoiced2voiced_unasp(hash.stemUlt);
    if (!voiced) return;
    var stem = u.replaceEnd(hash.stem, hash.stemUlt, voiced);
    if (!stem || stem == hash.stem) return;
    hash.stems = [stem];
}

function k2cSh(hash) {
    var stem;
    var cSh = ['च्', 'श्', 'ह्'];
    // var cSh = ['च्', 'श्'];
    _.each(cSh, function(lett) {
        stem = hash.stem.replace(/क्$/, lett) ;
        hash.stems.push(stem);
    });
}

sandhi.prototype.join = function(first, last) {
    // склеивание
}

sandhi.prototype.splitAll = function(samasa) {
    // разбиение на все возможные пары
}

function ulog () {
    var obj = arguments[0];
    if (arguments.length > 1) {
        console.log('==', arguments[0], '==');
        var obj = arguments[1];
    }
    console.log(util.inspect(obj, showHidden=false, depth=null, colorize=true));
}

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

// function reEnd(str) {
//     return new RegExp(str + '$');
// }

function log() { console.log.apply(console, arguments) }
