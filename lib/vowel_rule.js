var u = require('./utils');

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
        // test.first.pop();
        test.second.shift();
        return test.first.concat(u.dirgha(test.starts), test.second).join('');
    }
}

module.exports = rules;
