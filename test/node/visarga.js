var utils = require('../utils');

var tests = [
    {sutra: 'visarga-ah-a',
     descr: 'अ & visarga changes to ओ+avagraha when followed by अ',
     only: 'ext',
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

    {sutra: 'visarga-ah-soft',
     descr: 'अ & visarga (standing for अस्) followed by a soft consonant -> changes to ओ',
     only: 'ext',
     tests: [
         ['नमो नारायणाय', 'नमः', 'नारायणाय'],
         ['रामो गच्छति', 'रामः', 'गच्छति'],
         ['नरो गच्छति', 'नरः', 'गच्छति'],
         ['नरो यच्छति', 'नरः', 'यच्छति'],
         ['नरो हसति', 'नरः', 'हसति'],
         ['रुद्रो वन्द्यः', 'रुद्रः', 'वन्द्यः'],
         ['प्राणायामो हितः', 'प्राणायामः', 'हितः'],
         ['', '', ''],
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
