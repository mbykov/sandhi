var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;

var rules = {};

/*
 *7. akaḥ savarṇe dīrghaḥ || 6.1.101 || (vowel sandhi)
 * Common name: savarṇadīrgha sandhi
 *  If a simple vowel, short or long, be followed by a similar vowel, short or long, both of them will merge into the similar long vowel
 */
rules.savarnadirgha = {
    id: 7,
    sutra: '6.1.101',
    vowel: true,
    method: function(test) {
        // log('SIM', test.ends, test.starts, u.similar(test.ends, test.starts))
        if (!u.similar(test.ends, test.starts)) return;
        if (!u.c(Const.consonants, test.ends)) test.first.pop();
        test.second.shift();
        log('=====METHOD 101====');
        return test.first.concat(Const.dirghaLiga[test.starts], test.second).join('');
    }
}

/*
  8. omāṅośca || 6.1.95 || (vowel sandhi)
  Common name: pararūpa sandhi
  If a or ā is followed by o of the word om or oṁ, then o replaces both
  FIXME: нужен пример бы - посмотреть в Моньере
*/

/*
  9. etyedhatyūṭhsu || 6.1.89 || (vowel sandhi)
  Common name: vṛddhi sandhi
  For this rule, in all cases the resultant letter replaces x and y.
  i) If a or ā is followed by eti or edhati, then vṛddhi letter ai replaces both
  ii) If the preposition pra is followed by eṣa or eṣy, then vṛddhi letter ai replaces both
  iii) If a or ā is followed by ūh, then vṛddhi letter au replaces both
  iv) If preposition pra is followed by ūḍh, then vṛddhi letter au replaces both
  v) If word sva is followed by īr, then vṛddhi letter ai replaces both
*/

/*
  12. vṛddhireci || 6.1.88 || (vowel sandhi)
  Common name: vṛddhi sandhi
  If a or ā is followed by e, o, ai or au, then the corresponding vṛddhi letter ai or au replaces both
*/
rules.s6_1_88 = {
    id: 12,
    sutra: '6.1.88',
    vowel: true,
    method: function(test) {
        if (!u.aA(test.ends) || !u.c(Const.diphtongs, test.starts)) return;
        if (!u.c(Const.consonants, test.ends)) test.first.pop();
        test.second.shift();
        log('=====METHOD 88====');
        return test.first.concat(Const.vriddhiLiga[test.starts], test.second).join('');
    }
}

/*
  13. ādguṇaḥ || 6.1.87 || (vowel sandhi)
  Common name: guṇa sandhi
  If a or ā is followed by i, ī, u, ū, ṛ, ṝ or ḷ, then the corresponding guṇa letter e, o, ar or al replaces both.
*/
rules.s6_1_87 = {
    id: 13,
    sutra: '6.1.87',
    vowel: true,
    method: function(test) {
        if (!u.aA(test.ends) || !u.c(Const.iurlIUR, test.starts)) return;
        if (!u.c(Const.consonants, test.ends)) test.first.pop();
        test.second.shift();
        log('=====METHOD 87====');
        return test.first.concat(Const.gunaLiga[test.starts], test.second).join('');
    }
}

/*
  14. ecoyavāyāvaḥ || 6.1.78 || (vowel sandhi)
  Common name: ayāyāvāvādeśa sandhi
  diphthong followed by any vowel, including itself, changes to its semi-vowel equivalent
*/
rules.s6_1_78 = {
    id: 14,
    sutra: '6.1.78',
    vowel: true,
    method: function(test) {
        if (test.only != 'int') return;
        // log('=====METHOD 78====', u.c(Const.diphtongs, u.matra(test.ends)), u.c(Const.allvowels, test.starts));
        if (!u.c(Const.diphtongs, u.matra(test.ends)) || !u.c(Const.allvowels, test.starts)) return;
        var idx = Const.diphtongs.indexOf(u.matra(test.ends));
        var semivow = ['य', 'व', 'ाय', 'ाव'][idx];
        test.first.pop();
        test.second.shift();
        log('=====METHOD 78====');
        return test.first.concat(semivow, u.liga(test.starts), test.second).join('');
    }
}

// the same, but external / optional
rules.s6_1_78_ext = {
    id: 15,
    sutra: '6.1.78',
    vowel: true,
    method: function(test) {
        if (test.only == 'int') return;
        if (u.c(Const.gudiphs, u.matra(test.ends)) && Const.a == test.starts) return; // 6.1.109
        // log('=====METHOD 78====', u.c(Const.diphtongs, u.matra(test.ends)), u.c(Const.allvowels, test.starts));
        if (!u.c(Const.diphtongs, u.matra(test.ends)) || !u.c(Const.allvowels, test.starts)) return;
        log('=====METHOD 78 ext ====');
        var idx = Const.diphtongs.indexOf(u.matra(test.ends));
        var semivow = ['य', 'व', 'य', 'व'][idx];
        test.first.pop();
        if (idx > 1) test.first.push(Const.A);
        // log('T1', test.first, 'T2', test.second, 'IDX', idx, semivow, u.matra(test.ends));
        var res1 = [test.first.join(''), test.second.join('')].join(' ');
        test.second.shift();
        var res2 = test.first.concat(semivow, u.liga(test.starts), test.second).join('');
        // log('R1', res1, 'R2', res2);
        return [res1, res2];
    }
}

/*
  6. eṅaḥ padāntādati || 6.1.109 || (vowel sandhi)
  Common name: pūrvarūpa sandhi
  If e or o at the end of a word is followed by a, then e or o remains, and the avagraha (') replaces a.
*/
rules.s6_1_109 = {
    id: 16,
    sutra: '6.1.109',
    vowel: true,
    method: function(test) {
        // log('109', test)
        if (test.only != 'ext') return;
        if (!u.c(Const.gudiphs, u.matra(test.ends)) || !(Const.a == test.starts)) return;
        test.second.shift();
        // log('=====METHOD 109 ====', test.first, '===', Const.avagraha, '===', test.second);
        log('=====METHOD 109 ====');
        return test.first.concat(Const.avagraha, test.second).join('');
    }
}

/*
  15. iko yaṇaci || 6.1.77 || (vowel sandhi)
  If i, ī, u, ū, ṛ, ṝ or ḷ is followed by a vowel, then the corresponding semi-vowel (y, v, r, l) replaces the first.
  simple vowel except A or a followed by a dissimilar vowel changes to semi-vowel
*/
rules.s6_1_77 = {
    id: 17,
    sutra: '6.1.77',
    vowel: true,
    method: function(test) {
        if (u.c(Const.aA, test.matra)) return;
        if (u.similar(test.ends, test.starts)) return;
        // if (!u.c(Const.allsimples, test.matra) || !u.c(Const.allvowels, test.starts)) return;
        test.first.pop();
        var virama = (test.first[0]) ? Const.virama : '';
        var vow = test.second.shift();
        var semi = Const.vow2semi[test.matra];
        var liga = Const.vow2liga[vow];
        log('=====METHOD 77 ====', test.first, '=');
        return test.first.concat(virama, semi, liga, test.second).join('');
    }
}

module.exports = rules;
