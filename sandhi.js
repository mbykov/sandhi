/*
  node (only, not component) module for sanskrit sandhi processing
*/

var _ = require('underscore');
var util = require('util');
var slp = require('../utils/slp');
var shiva = require('../utils/shivasutra');
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

sandhi.prototype.del = function(form, flex, cflex, prefix, krit) {
    if (prefix) return removePrefix(form, flex, cflex, krit);
    return removeSuffix(form, flex, cflex);
}

/* 1. нужно добавлять -cflex, т.е. исходную форму во все флексии. Может и неплохо, кстати. Как раз резерв ограничения кол-ва результатов.
   2. Неясный код. Ладно.
   3. Последовательность? Как уложить все кейсы?
*/

// var t_th = ['त', 'थ'];
// var t_th_dh = ['त', 'थ', 'ध'];

// cflex: -ti, flex: -dhi, etc, i.e. variant
function removeSuffix(form, flex, cflex, krit) {
    var stems = [];
    // условие - наружу
    var re = new RegExp(flex + '$');
    var stem = form.replace(re, '');
    //log('---------', form, flex, cflex, stem, (stem == form))
    if (stem == form) return [];

    /* здесь тоже - не просто вызов набора функций _t_th_etc_, а вызов в цикле ? Принцип неясен, вот что
       постоянная величина - hash.second, начало флексии, sign
       вычисляются - hash.ultima == hash.first
       == после каждого преобразования запускается весь список фильтров == ?
     */

    stems.push(stem); // default stem
    var first = cflex[0];
    var clean = stem.replace(/्$/, '');
    var last = clean.slice(-1);

    var hash = {form: form, stem: stem, flex: flex, cflex: cflex};
    hash.stems = [];

    hash.first = u.ultima(stem); // stemUlt
    hash.stemUlt = u.ultima(stem);
    // hash.virama = u.virama(stem);
    // hash.second = cflex[0];

    // FIXME: v ? final_m
    // When the second letter letter is a vowel, a nasal, or a semivowel, no sandhi change of any kind will occur
    var flexStart = flex[0];
    var stops = Const.nasals.concat(Const.semivowels).concat(['म', Const.virama]);
    //log('sem', Const.semivowels)
    //var stops = Const.nasals.concat(['म', Const.virama]);
    //log('NO sandhi', flexStart, stops, isIN(stops, flexStart), stem);
    if (isIN(stops, flexStart)) return [stem];

    // cavarga - c always reduces to k. But j is more irregular. It usually becomes k, but it can also become ṭ or ṣ
    var stem_ends_with_k = (hash.stemUlt == 'क');
    var cflex_in_tT = (isIN(Const.t_th, cflex[0]));
    var flex_in_tT = (isIN(Const.t_th, flex[0]));
    if (stem_ends_with_k && cflex_in_tT && flex_in_tT) cavarga_c(hash);
    var stem_ends_with_kzq = (isIN(Const.kzq, hash.stemUlt));
    var cflex_starts_with_t_h = (isIN(Const.t_th, cflex[0])); // возможно, есть еще значения, кроме _t, _h, наверняка
    if (stem_ends_with_kzq && cflex_starts_with_t_h) cavarga_j(hash);
    if (!krit) krit = true;
    var flex_starts_with_z = (flex[0] == 'ष');
    // In front of the s of a verb suffix, it becomes k.
    if (krit && flex_starts_with_z && stem_ends_with_k) cavarga_S(hash);
    // TODO: In front of t or th, S becomes s and shifts the letter that follows it to ṭavarga
    var stem_ends_with_s = (hash.stemUlt == 'ष');    // есть еще признак - после ш - tavarga
    var flex_starts_with_wW = (isIN(Const.wW, flex[0]));
    if (stem_ends_with_s && cflex_in_tT && flex_starts_with_wW) cavarga_s(hash);
    // Changing flex _n to _Y (ñ) - the same stem

    //Retroflex letters
    // retroflex letter, if followed by a tavarga letter, shifts it to ṭavarga    - the same stem
    // ṣ becomes k when followed by s
    var cflex_starts_with_s = (cflex[0] == 'स');
    if (flex_starts_with_z && cflex_starts_with_s && stem_ends_with_k) retroflex_k(hash);

    // final n
    // n becomes the anusvāra root ends with n && flex starts with s
    var stem_ends_with_anusvara = (hash.stemUlt == 'ं');
    var flex_starts_with_s = (flex[0] == 'स');
    if (stem_ends_with_anusvara && flex_starts_with_s) final_n(hash);
    // final_m - final m becomes n in front of v
    var flex_starts_with_v = (flex[0] == 'व');
    var stem_ends_with_n = (hash.stemUlt == 'न');
    //log('--', flex_starts_with_v, stem_ends_with_n);
    if (stem_ends_with_n && flex_starts_with_v) final_m(hash);

    // Aspirated Letters:
    // move_aspirate_forward
    // t- and th-, when they are the second letter, become dh-
    // если флексия из t_th стала dh-, то окончание стема аспирируется
    var flex_starts_with_D = (flex[0] == 'ध');
    if (cflex_in_tT && flex_starts_with_D) move_aspirate_forward(hash);

    // move_aspirate_backward
    var stem_ends_with_VunAC = (isIN(Const.voiced_unasp, hash.stemUlt));
    var flex_starts_with_BsDv = (isIN(Const.BsDv, flex[0]) || /^ध्व/.test(flex) );
    if (stem_ends_with_VunAC && flex_starts_with_BsDv) move_aspirate_backward(hash);

    // h is treated like gh: The h both ends a root that starts with d and is in front of t, th, or dh;
    // если стем начинается на d, а флексия на t_th_dh или _s, то gh -> h
    var cflex_in_tTD = (isIN(Const.t_th_dh, cflex[0]));
    var stem_starts_with_d = (stem[0] == 'द');
    var flex_starts_with_Q = (flex[0] == 'ढ');
    if (cflex_starts_with_s || (cflex_in_tTD && stem_starts_with_d)) {
        h_like_gh_t_or_s(hash);
    } else if (cflex_in_tTD && flex_starts_with_Q) {
        h_like_gh_other(hash);
    }

    // final_s - s changes to t
    // TODO: s also becomes t in some parts of the reduplicated perfect
    if (!krit) krit = true;
    var stem_ends_with_t = (hash.stemUlt == 'त');
    var flex_starts_with_s = (flex[0] == 'स');
    if (stem_ends_with_t && flex_starts_with_s && krit) final_s_t(hash);
    var dD = ['द', 'ध'];
    var flex_starts_with_dD = (isIN(dD, flex[0]));
    if (flex_starts_with_dD) final_s_zero(hash);

    //if (debug) log('stems', hash.stems);
    if (isIN(Const.asps, first)) removeAspEnd(hash);

    return hash.stems;
}

function final_s_t(hash) {
    var stem = hash.stem.replace(/त्$/, 'स्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
}

// depends on move_aspirate_forward
// final_s_zero FIXME: исключения? s disappears when in front of _d or _dh - не во всех же случаях добавлять s перед _d и _dh?
function final_s_zero(hash) {
    if (hash.stems.length > 0) return; // move_aspirate_forward stems should not be changed
    var stem = [hash.stem, 'स्'].join('');
    if (stem == hash.stem) return;
    //ulog(hash);
    hash.stems = [stem];
}

function final_n(hash) {
    var stem = hash.stem.replace(/ं$/, 'न्');
    if (stem == hash.stems) return;
    hash.stems = [stem];
    //hash.stems.push(stem);
}

function final_m(hash) {
    var stem = hash.stem.replace(/न्$/, 'म्');
    if (stem == hash.stems) return;
    hash.stems = [stem];
    //log(hash.stems)
    //hash.stems.push(stem);
}


// h is treated like gh: The h both ends a root that starts with d and is in front of t, th, or dh;
// если стем начинается на d, а флексия на t_th_dh, то gh -> h
// depends_on aspirate_forward
function h_like_gh_t_or_s(hash) {
    // поскольку здесь речь только про _gh, случаи _k, (_c, _j) -> можно преобразовать _к -> _g
    // _g получается из _gh по общему правилу
    var stem = hash.stem.replace(/क्$/, 'ग्');
    hash.stems.push(stem);
    //var stems = [stem]; // FIXME: это пока нет hash.stems, иначе цикл не нужен
    hash.stems = _.map(hash.stems, function(stem) { return stem.replace(/ग्/, 'ह्') });
    //ulog('-after',hash)
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
    if (stem == hash.stem) return;
    hash.stems.push(stem);
    hash.stems.push(short_stem);
}

// move_aspirate_forward
// t- and th-, when they are the second letter, become dh-
// если флексия t_th стала dh-, то окончание стема аспирируется, d-dh
function move_aspirate_forward(hash) {
    var asp = u.unasp2asp(hash.first);
    if (!asp) return;
    var stem = u.replaceEnd(hash.stem, hash.first, asp);
    if (stem == hash.stem) return;
    if (!stem) return;
    hash.stems.push(stem);
    //ulog(hash);
}

function move_aspirate_backward(hash) {
    var asp = u.unasp2asp(hash.first);
    if (!asp) return;
    var stem = u.replaceEnd(hash.stem, hash.first, asp);
    var stem0 = hash.stem[0];
    var stem0idx = Const.GDB.indexOf(stem0);
    var stem0new = Const.gdb[stem0idx];
    stem = stem.replace(stem0, stem0new);
    if (stem == hash.stem) return;
    hash.stems.push(stem);
    //ulog(hash);
}

function cavarga_c(hash) {
    var stem = hash.stem.replace(/क्$/,'च्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
}

function cavarga_j(hash) {
    var stem_j = hash.stem.replace(/क्$/,'ज्');
    var stem_z = hash.stem.replace(/ष्$/,'ज्');
    var stem_q = hash.stem.replace(/ष्$/,'ज्');
    var stems = [stem_j, stem_z, stem_q];
    stems = _.uniq(_.compact(stems));
    stems = _.without(stems, hash.stem);
    hash.stems = hash.stems.concat(stems);
    //log(hash.stems);
}

function cavarga_S(hash) {
    var stem = hash.stem.replace(/क्$/,'श्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
}

function cavarga_s(hash) {
    // overlapped with cavarga_j
    var stem = hash.stem.replace(/ष्$/,'श्');
    if (stem == hash.stem) return;
    hash.stems.push(stem);
}

function retroflex_k(hash) {
    var stem = hash.stem.replace(/क्$/,'ष्');
    if (stem == hash.stem) return;
    //hash.stems.push(stem);
    hash.stems = [stem];
    //log(hash.stems);
}


// Aspirated letters become unaspirated
// наоборот, окончание стема без придыхания получает придыхание, кроме gh?
function removeAspEnd(hash) {
    if (hash.stems.length > 0) return;
    for (var stem in hash.stems) {
        //s
    }
    //ulog(hash);
    return;
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
