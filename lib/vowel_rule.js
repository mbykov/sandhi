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
        if (!u.similar(test.ends, test.starts)) return;
        if (!u.c(Const.consonants, test.ends)) test.first.pop();
        test.second.shift();
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
        var eoEO = Const.eo.concat(Const.EO);
        if (!u.aA(test.ends) && !(u.c(eoEO, test.starts))) return;
        if (!u.c(Const.consonants, test.ends)) test.first.pop();
        test.second.shift();
        return test.first.concat(Const.vriddhi[test.starts], test.second).join('');
    }
}





module.exports = rules;
