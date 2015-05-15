var utils = require('../utils');

var tests = [
    {sutra: '4.1.2',
     descr: 'अ & visarga changes to ओ+avagraha when followed by अ',
     only: 'ext',
     tests: [
         ['शिवोऽहम्', 'शिवः', 'अहम्'],
         ['रामोऽस्ति', 'रामः', 'अस्ति'],
         ['', '', ''],
         ['', '', ''], // добавить dropped
         ['', '', ''],
     ]
    },

    {sutra: '4.1.3', // FIXME: !!!! номер 4.1.3 условный!!!
     descr: 'visarga after simple changes to र् when followed by a vowel or soft consonant except र्',
     only: 'ext',
     tests: [
         ['गणपतिरवतु', 'गणपतिः', 'अवतु'],
         ['रविरुदेति', 'रविः', 'उदेति'],
         ['गुरुर्ब्रह्मा', 'गुरुः', 'ब्रह्मा'],
         ['मनुर्गच्छति', 'मनुः', 'गच्छति'],
         ['', '', ''],
         ['', '', ''],
     ]
    },

    {sutra: '',
     descr: '',
     only: 'ext',
     tests: [
         ['', '', ''],
         ['', '', ''],
     ]
    },

    {sutra: '',
     descr: '',
     only: 'ext',
     tests: [
         ['', '', ''],
         ['', '', ''],
     ]
    },

]

describe('vowel sandhi', function() {
    tests.forEach(function(t) {
        if (t.sutra == '') return;
        var descr = [t.sutra, t.descr, t.only].join(' - ');
        describe(descr, function() {
            t.tests.forEach(function(test, idx) {
                if (t.only) test.push(t.only);
                utils.test(test, idx);
            });
        });
    });
});
