var u = require('./utils');
var Const = require('./const');
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
        return test.first.concat(u.dirgha(test.starts), test.second).join('');
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
        if (!u.aA(test.ends) || !u.c(Const.eoEO, test.starts)) return;
        if (!u.c(Const.consonants, test.ends)) test.first.pop();
        test.second.shift();
        log('=====METHOD 88====');
        return test.first.concat(Const.vriddhi[test.starts], test.second).join('');
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
        return test.first.concat(Const.guna[test.starts], test.second).join('');
    }
}

/*
  14. ecoyavāyāvaḥ || 6.1.78 || (vowel sandhi)
  Common name: ayāyāvāvādeśa sandhi
  If e, o, ai or au is followed by a vowel, then ay, av, āy,  āv replace the first respectively
  diphthong followed by any vowel, including itself, changes to its semi-vowel equivalent
*/
rules.s6_1_78 = {
    id: 14,
    sutra: '6.1.78',
    vowel: true,
    method: function(test) {
        if (test.only != 'int') return;
        if (u.c(Const.eoEO, test.ends) || '') return;
        // if (!u.c(Const.consonants, test.ends)) test.first.pop();
        // test.second.shift();
        // log('=====METHOD 87====');
        // return test.first.concat(Const.guna[test.starts], test.second).join('');
    }
}



/*
  15. iko yaṇaci || 6.1.77 || (vowel sandhi)
  Common name: yaṇādeśa sandhi
  If i, ī, u, ū, ṛ, ṝ or ḷ is followed by a vowel, then the corresponding semi-vowel (y, v, r, l) replaces the first.

  ==== результат - [xxx, yyy]. А если нет слияния? [xxx, "yyy zzz"]
  ==== как организовать internal / external тесты ?
  ==== как организовать optional ?
  ====


*/

module.exports = rules;
