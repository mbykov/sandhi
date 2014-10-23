// http://learnsanskrit.org/references/sandhi/internal

var utils = require('../utils');

// form, flex, canon.flex, stem = result
var test1 = [
    ['रुन्द्ध्वे', 'ध्वे', 'रुन्ध्'],
];

// Moving the aspirate forward
var test2 = [
    ['बुद्ध', 'ध', 'त', 'बुध्'],
    ['रुन्द्धः', 'धः', 'थः', 'रुन्ध्'],
    ['दुग्ध', 'ध', 'त', 'दुह्'],
];

// h is treated like gh
var test3 = [
    ['लेक्षि', 'षि', 'सि', 'लेह्'], // FIXME: si->zi ?
    ['दग्ध', 'ध', 'त', 'दह्'],
    ['दिग्ध्वे', 'ध्वे', 'ध्वे', 'दिह्'],
];


describe('Internal consonants sandhi', function() {
    describe('Aspirated letters become unaspirated', function() {
        //utils.test(test1);
    });
    describe('t- and th-, when they are the second letter, become_dh', function() {
        utils.test(test2);
    });
    describe('h_like_gh_t_or_s', function() {
        utils.test(test3);
    });
});



// describe(descr, function() {
//     utils.test(tests);
// });
