var utils = require('../utils');

var savarnadirgha = [
    ['योगानुशासन', 'योग', 'अनुशासन'],
    ['योगानुशासन', 'योग', 'अनुशासन'],
];


describe('vowel sandhi', function() {
    describe('6.1.101 - simple vowel, followed by a similar vowel', function() {
        savarnadirgha.forEach(function(test) {
            utils.test(test);
        });
    });
});
