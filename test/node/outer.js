var utils = require('../utils');

var tests = [
    // browser
    // अ & visarga changes to ओ+avagraha when followed by अ;
    {sutra: 'visarga-ah-a',
     descr: 'aH+a => o-ऽ',
     only: 'browser',
     tests: [
         ['शिवोऽहम्', 'शिवः', 'अहम्'],
         ['रामोऽस्ति', 'रामः', 'अस्ति'],
         ['गच्छतोऽश्वौ', 'गच्छतः', 'अश्वौ'],
         ['शिवोऽहम्', 'शिवः', 'अहम्'],
         ['देवोऽस्ति', 'देवः', 'अस्ति'],
         ['नरोऽश्वः', 'नरः', 'अश्वः'],
         ['', '', ''],
     ]
    },

    // browser
    {sutra: 'visarga-ah-soft',
     descr: 'अ & visarga (for अस्) followed by a soft consonant -> changes to ओ',
     only: 'browser',
     tests: [
         ['नमो नारायणाय', 'नमः', 'नारायणाय'],
         ['रामो गच्छति', 'रामः', 'गच्छति'],
         ['नरो गच्छति', 'नरः', 'गच्छति'],
         ['नरो यच्छति', 'नरः', 'यच्छति'],
         ['नरो हसति', 'नरः', 'हसति'],
         ['रुद्रो वन्द्यः', 'रुद्रः', 'वन्द्यः'],
         ['प्राणायामो हितः', 'प्राणायामः', 'हितः'],
     ]
    },

    // browser
    {sutra: 'visarga-ah-other',
     descr: 'अ & visarga (standing for अस्) followed by a vowel except अ -> visarga is dropped',
     only: 'browser',
     tests: [
         ['राम इच्छति', 'रामः', 'इच्छति'],
         ['राम उवाच', 'रामः', 'उवाच'],
         ['नर इच्छति', 'नरः', 'इच्छति'],
         ['शिव एति', 'शिवः', 'एति'],
         // ['शिवयेति', 'शिवः', 'एति'], // optional y after diphtong
         ['', '', ''],
     ]
    },

    // browser
    // आ & visarga  (for आस्) is followed by a vowel or soft consonant - > dropped.
    {sutra: 'visarga-aah-vow',
     descr: '',
     only: 'browser',
     tests: [
         ['नरा अटन्ति', 'नराः', 'अटन्ति'],
         ['नरा गच्छन्ति', 'नराः', 'गच्छन्ति'],
         ['देवा निस्तारयन्ति', 'देवाः', 'निस्तारयन्ति'],
         ['अश्वा भवन्ति', 'अश्वाः', 'भवन्ति'],
         ['योगा आवश्यकाः', 'योगाः', 'आवश्यकाः'],
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

describe('visarga_sandhi', function() {
    tests.forEach(function(t) {
        return;
        if (t.sutra == '') return;
        // if (t.only != 'ext') return;
        var descr = [t.sutra, t.descr, t.only].join(' - ');
        describe(descr, function() {
            t.tests.forEach(function(test, idx) {
                if (t.only) test.push(t.only);
                utils.test(test, idx);
            });
        });
    });
});
