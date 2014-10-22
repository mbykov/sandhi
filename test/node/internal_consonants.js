// http://learnsanskrit.org/references/sandhi/internal

var utils = require('../utils');
//var descr = 'int_cons';

// form, flex, stem = result
var tests = [
    ['रुन्द्ध्वे', 'ध्वे', 'रुन्ध्'],
];

describe('Internal consonants', function() {
    describe('Aspirated letters become unaspirated', function() {
        utils.test(tests);
    });
});

// describe(descr, function() {
//     utils.test(tests);
// });
