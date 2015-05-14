var utils = require('../utils');

var tests = [
    {sutra: '4.1.2',
     descr: 'अ & visarga changes to ओ+avagraha when followed by अ',
     only: 'ext',
     tests: [
         ['शिवोऽहम्', 'शिवः', 'अहम्'],
         ['रामोऽस्ति', 'रामः', 'अस्ति'],
         ['', '', ''],
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
