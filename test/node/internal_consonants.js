var utils = require('../utils');

var savarnadirgha = [
    ['योगानुशासन', 'योग', 'अनुशासन'],
    ['योगानन्द', 'योग', 'आनन्द'],
    ['महामृत', 'महा', 'अमृत'],
    ['महानन्द', 'महा', 'आनन्द'],
    // ['', '', ''],
    // ['', '', ''],
];


describe('vowel sandhi', function() {
    describe('6.1.101 - simple vowel, followed by a similar vowel', function() {
        savarnadirgha.forEach(function(test) {
            utils.test(test);
        });
    });
});
