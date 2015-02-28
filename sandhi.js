/*
  node (only, not component) module for sandhi processing
*/

var _ = require('underscore');
var util = require('util');
var shiva = require('shiva-sutras');
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

function removeSuffix(form, flex, cflex, krit) {

    // ======================================== FILTER
    var stems = [];
    var re = new RegExp(flex + '$');
    var stem = form.replace(re, '');
    if (stem == form) return [stem];

    var cfirst = cflex[0];
    var clean = stem.replace(/्$/, '');
    // if (stem == clean && flex != 'ढ') return [stem]; // wrong idea
    var last = clean.slice(-1);
    var flex0 = flex[0];

    var hash = {form: form, stem: stem, flex: flex, cflex: cflex};

    hash.stemUlt = u.ultima(stem);

    // ========================= START =================
    // EXTERNAL SANDHI THAT MATTER
    // Stops become unvoiced and unaspirated =>
    var stops = Const.unvoiced_unasp;
    // if (u.isIN(stops, hash.stemUlt) && !u.isIN(nosandhi, flex[0])) unvoiced2voiced(hash);
    if (u.isIN(stops, hash.stemUlt)) unvoiced2voiced(hash);

    // === Aspirated Letters ===:
    // === Aspirated letters become unaspirated
    if (u.isIN(Const.voiced_unasp, hash.stemUlt) && u.isIN(Const.asps, flex[0])) unaspirated2aspirated(hash);

    // === move_aspirate_forward
    // t- and th-, when they are the second letter, become dh-
    var flex_starts_D = (flex[0] == 'ध');
    var cflex_in_tT = (u.isIN(Const.tT, cflex[0]));
    if (cflex_in_tT && flex_starts_D) move_aspirate_forward(hash);

    // === move_aspirate_backward
    var stem_ends_voiced_unasp = (u.isIN(Const.voiced_unasp, hash.stemUlt));
    var stem_starts_asp = (u.isIN(Const.asps, hash.stem[0]));
    var flex_starts_BsDv = (u.isIN(Const.BsDv, flex[0]) || /^ध्व/.test(flex) );
    if (stem_starts_asp && stem_ends_voiced_unasp && flex_starts_BsDv) move_aspirate_backward(hash);

    // === h is treated like gh:
    var cflex_in_tTD = (u.isIN(Const.tTD, cflex[0]));
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
    if (cflex_in_tTD && flex_starts_Q) {
        h_like_gh_other(hash);
    }

    // === final letters ===
    // === final_s - A final s changes in one of two ways: 1 - s changes to t
    // TODO: The s in vas and ghas becomes t when in front of the s of a verb suffix,
    // TODO: s also becomes t in some parts of the reduplicated perfect
    if (!krit) krit = true;
    var stem_ends_t = (hash.stemUlt == 'त');
    var flex_starts_s = (flex[0] == 'स');
    // TODO: only vas and ghas ==> if (stem_ends_t && flex_starts_s && krit) final_s_t(hash);

    // s disappears when in front of d or dh.
    var dD = ['द', 'ध'];
    var flex_starts_dD = (u.isIN(dD, flex[0]));
    if (flex_starts_dD) final_s_zero(hash); // no second filter, śās + dhi → śādhi

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
    var flex_in_tT = (u.isIN(Const.tT, flex[0]));
    if (stem_ends_k && cflex_in_tT && flex_in_tT) cavarga_c(hash);
    // cavarga_c addendum vazwe
    var stem_ends_z = (hash.stemUlt == 'ष');
    var flex_starts_wW = (u.isIN(Const.wW, flex[0]));
    // if (stem_ends_z && cflex_in_tT && flex_starts_wW) cavarga_cw(hash); // == no tests

    // A final ś changes in these ways - In front of t or th, it becomes ṣ and shifts the letter that follows it to ṭavarga.
    if (stem_ends_z && cflex_in_tT && flex_starts_wW) cavarga_z_t_w(hash);

    // cavarga_c addendum two_lat_atm_vac - vaSe, vaSvahe, etc
    var stem_ends_S = (hash.stemUlt == 'श');
    // if (stem_ends_S && cflex_in_tT && flex_starts_wW) cavarga_cS(hash); // == no tests

    // cavarga_c addendum two_lat_atm_vac - vaSe, vaSvahe, etc

    // cavarga_c addendum draS - drakzyasi
    var flex_starts_y = (flex[0] == 'य');
    if (stem_ends_z && flex_starts_y) cavarga_z_y(hash);

    // FIXME: krit
    if (!krit) krit = true;
    // In front of the s of a verb suffix, it becomes k
    // if (krit && flex_starts_z && stem_ends_k) cavarga_SW(hash);

    // Changing flex _n to _Y (ñ) - the same stem

    //Retroflex letters
    // retroflex letter, if followed by a tavarga letter, shifts it to ṭavarga - the same stem

    // ṣ becomes k when followed by s
    if (flex_starts_z && cflex_starts_s && stem_ends_k) retroflex_k(hash);


    // When the second letter letter is a vowel, a nasal, or a semivowel, no sandhi change of any kind will occur
    var nosandhi = Const.nasals.concat(Const.semivowels).concat(['म', Const.virama]);
    if (u.isIN(nosandhi, flex[0])) {
        if (!hash.stems) hash.stems = [];
        hash.stems.push(stem);
    }

    for (var key in Const.exceptions) {
        if (key != hash.stem) continue;
        var exep = Const.exceptions[key];
        hash.stems = [exep];
    }

    // =============================== END ============
    if (!hash.stems || hash.stems.length == 0) hash.stems = [stem]; // sTA, etc
    return _.uniq(hash.stems);
}

function final_s_t(hash) {
    var stem = hash.stem.replace(/त्$/, 'स्');
    if (stem == hash.stem) return;
    hash.stems = [stem];
}

// final_s_zero
function final_s_zero(hash) {
    var stem = [hash.stem, 'स्'].join('');
    if (stem == hash.stem) return;
    if (!hash.stems) hash.stems = [];
    hash.stems.push(stem);
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


// flex_starts_z && cflex_starts_s && stem_ends_k
function retroflex_k(hash) {
    var stemh = hash.stem.replace(/क्$/, 'ह्');
    var stemz = hash.stem.replace(/क्$/,'ष्');
    var stemj = hash.stem.replace(/क्$/,'ज्');
    var stemc = hash.stem.replace(/क्$/,'च्');
    if (stemh == hash.stem && stemz == hash.stem  && stemj == hash.stem) return;
    hash.stems = [stemh, stemz, stemj, stemc];
    if (debug) log('mod: retroflex_k', hash.stems);
}

function h_like_gh_t_D(hash) {
    var stem = hash.stem.replace(/ग्$/, 'ह्');
    if (stem == hash.stems) return;
    hash.stems = [stem];
    if (debug) log('mod: h_like_gh_s_z', stem);
}

// three things: 1) changes t, th, and dh — if they follow the h — into ḍh, 2) lengthens the vowel in front of it, if possible, 3) disappears
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
    var stem = hash.stem;
    var stemS = stem.replace(/ष्$/,'श्');
    var stemc = stem.replace(/ष्$/,'च्');
    var stemj = stem.replace(/ष्$/,'ज्');
    if (stemS == stem) return;
    hash.stems = [stem, stemS, stemc, stemj];
    if (debug) log('mod: cavarga_z_t_w', hash.stems);
}

function unaspirated2aspirated(hash) {
    var asp = u.unasp2asp(hash.stemUlt);
    var stem = u.replaceEnd(hash.stem, hash.stemUlt, asp);
    if (stem == hash.stem) return;
    hash.stems = [stem];
    if (debug) log('mod: unaspirated2aspirated', hash.stem, hash.stemUlt);
}

function unvoiced2voiced(hash) {
    var voiced = u.unvoiced2voiced_unasp(hash.stemUlt);
    if (!voiced) return;
    var avoiced = u.unasp2asp(voiced);
    var vstem = u.replaceEnd(hash.stem, hash.stemUlt, voiced);
    var avstem = u.replaceEnd(hash.stem, hash.stemUlt, avoiced);
    if (!vstem || vstem == hash.stem) return;
    hash.stems = [hash.stem, vstem, avstem];
    if (debug) log('mod: unvoiced2voiced', hash.stems);
}

function k2cSh(hash) {
    var stem;
    var cSh = ['च्', 'श्', 'ह्'];
    _.each(cSh, function(lett) {
        stem = hash.stem.replace(/क्$/, lett) ;
        hash.stems.push(stem);
    });
}

sandhi.prototype.join = function(first, last) {
    // TODO: join
}

sandhi.prototype.splitAll = function(samasa) {
    // TODO:
}
