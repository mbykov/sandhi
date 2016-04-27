var utils = require('../utils');

var tests = [

    {sutra: 'visarga-sibilant',
     descr: 'Visarga to श्, ष्, स् when followed by (च् or छ्), (ट् or ठ्), (त् or थ्)',
     only: 'ext',
     tests: [
         ['रामश्चातक', 'रामः', 'चातक'],
         ['नरश्चरति', 'नरः', 'चरति'],
         ['शिवश्छायः', 'शिवः', 'छायः'],

         ['रामष्टीकते', 'रामः', 'टीकते'], // ष
         ['वरष्ठक्कुराणाम्', 'वरः', 'ठक्कुराणाम्'],
         ['सुन्दरष्टङ्कः', 'सुन्दरः', 'टङ्कः'],

         ['नमस्ते', 'नमः', 'ते'],
         ['नरस्तिष्ठति', 'नरः', 'तिष्ठति'],
         ['विष्णुस्त्राता', 'विष्णुः', 'त्राता'],
         ['नरस्थुत्थुकारकः', 'नरः', 'थुत्थुकारकः'],

         ['', '', ''],
         ['', '', ''],
     ]
    },

    {sutra: 'visarga-r',
     descr: 'visarga for र्',
     only: 'ext',
     tests: [
         // visarga (for र्) after any vowel except अ or आ changes to र् when followed by a vowel or soft consonant except र्
         ['गणपतिरवतु', 'गणपतिः', 'अवतु'],
         ['रविरुदेति', 'रविः', 'उदेति'],
         ['गुरुर्ब्रह्मा', 'गुरुः', 'ब्रह्मा'],
         ['मनुर्गच्छति', 'मनुः', 'गच्छति'],
         // अ & visarga changes to अर् when followed by a vowel or soft consonant except र्
         ['पुनरपि', 'पुनः', 'अपि'],
         ['पितर्वदसि', 'पितः', 'वदसि'],
         ['मातरिन्दुं', 'मातः', 'इन्दुं'],
         // आ & visarga changes to आर् when followed by a (vowel or soft consonant except र्)
         ['द्वारत्र', 'द्वाः', 'अत्र'],
         ['द्वार्दृष्टा', 'द्वाः', 'दृष्टा'],
         // C1. (visarga) after any (vowel except अ or आ) changes to र् when followed by a (vowel or soft consonant except र्)
         ['गणपतिरवतु', 'गणपतिः', 'अवतु'],
         ['रविरुदेति', 'रविः', 'उदेति'],
         ['गुरुर्ब्रह्मा', 'गुरुः', 'ब्रह्मा'],
         ['मनुर्गच्छति', 'मनुः', 'गच्छति'],
         ['', '', ''],
         ['', '', ''],
     ]
    },

    // ======== OUTER.js ==========
    // browser
    // अ & visarga changes to ओ+avagraha when followed by अ;
    {sutra: 'visarga-avagraha',
     descr: 'aH+a => o-ऽ',
     first: true,
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

    // browser
    // {sutra: 'visarga-ah-soft',
    // spaced o-sandhi, sometimes written as external sandhi, i.e. as combined word
    {sutra: 'visarga-o',
     descr: 'अ & visarga (for अस्) followed by a soft consonant -> changes to ओ',
     // only: 'browser',
     tests: [
         ['नमोनारायणाय', 'नमः', 'नारायणाय'], // नमो नारायणाय
         ['रामोगच्छति', 'रामः', 'गच्छति'], // रामो गच्छति
         ['नरोगच्छति', 'नरः', 'गच्छति'], // etc
         ['नरोयच्छति', 'नरः', 'यच्छति'],
         // ['नरोहसति', 'नरः', 'हसति'],
         // ['रुद्रोवन्द्यः', 'रुद्रः', 'वन्द्यः'],
         // ['प्राणायामो हितः', 'प्राणायामः', 'हितः'], // प्राणायामो हितः
     ]
    },

    // browser
    // {sutra: 'visarga-ah-other',
    {sutra: '',
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
    // {sutra: 'visarga-aah-vow',
     {sutra: '',
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
        if (t.sutra == '') return;
        var descr = [t.sutra, t.descr].join(' - ');
        var cut = false;
        if (t.first) cut = t.first + '';
        describe(descr, function() {
            t.tests.forEach(function(test, idx) {
                utils.test(test, idx, cut);
            });
        });
    });
});
