// http://learnsanskrit.org/references/sandhi/internal

var utils = require('../utils');

// form, flex, suffix, stem = result
var test1 = [
    ['रुन्द्ध्वे', 'ध्वे', 'रुन्ध्'],
];

// Moving the aspirate forward
var test2 = [
    ['बुद्ध', 'ध', 'त', 'बुध्'],
    // ['रुन्द्धः', 'धः', 'थः', 'रुन्ध्'],
    // ['दुग्ध', 'ध', 'त', 'दुह्'],
];

describe('Internal consonants sandhi', function() {
    describe('Aspirated letters become unaspirated', function() {
        //utils.test(test1);
    });
    describe('t- and th-, when they are the second letter, become dh-', function() {
        utils.test(test2);
    });
});



// describe(descr, function() {
//     utils.test(tests);
// });
