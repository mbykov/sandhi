// http://learnsanskrit.org/references/sandhi/internal

var utils = require('../utils');

// form, flex, canon.flex, stem = result
var test1 = [
    ['रुन्द्ध्वे', 'ध्वे', 'रुन्ध्'],
];

var move_aspirate_forward = [
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

// h_like_gh_other
var test4 = [
    ['मूढ', 'ढ', 'त', 'मुह्'],
    ['लीढ', 'ढ', 'त', 'लिह्'],
    ['ऊढ', 'ढ', 'त', 'ऊह्'],
];

// final_s
var final_s = [
    ['वत्स्यति', 'स्यति', 'xxx', 'वस्'],
    ['जिघत्सति', 'सति', 'xxx', 'जिघस्'],
    ['शाधि', 'धि', 'xxx', 'शास्'],
];

var move_aspirate_backward = [
    ['भुद्ध्वम्', 'ध्वम्', 'xxx', 'बुध्'], // अभुद्ध्वम् - w/o affix
    ['', '', '', ''],
    ['', '', '', ''],
];



describe('Internal consonants sandhi', function() {
    describe('Aspirated letters become unaspirated', function() {
        //utils.test(test1);
    });
    describe('move_aspirate_backward', function() {
        utils.test(move_aspirate_backward);
    });
    describe('move_aspirate_forward', function() {
        utils.test(move_aspirate_forward);
    });
    describe('h_like_gh_t_or_s', function() {
        utils.test(test3);
    });
    describe('h_like_gh_other', function() {
        utils.test(test4);
    });
    describe('final_s', function() {
        utils.test(final_s);
    });
});



// describe(descr, function() {
//     utils.test(tests);
// });
