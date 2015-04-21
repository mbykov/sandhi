var utils = require('../utils');

var tests = [
    {sutra: '8.2.39',
     descr: 'hard consonant followed by a soft consonant or v. changes to the third of its class',
     tests: [
         ['श्रीमद्भगवद्गीता', 'श्रीमत्', 'भगवद्गीता'],
         ['वनादागच्छामि', 'वनात्', 'आगच्छामि'],
         ['सद्भडति', 'सत्', 'भडति'],
         ['प्रागूध', 'प्राक्', 'ऊध'], // 4.40 ?
         ['नगरादागच्छति', 'नगरात्', 'आगच्छति'],
         ['भगवद्गीता', 'भगवत्', 'गीता'],
         ['वधाद्विना', 'वधात्', 'विना'],
         // ['वनात्पिता', 'वनात्', 'पिता'], // failed in this very sutra
         ['', '', ''],
         ['', '', ''],
     ]
    },

    {sutra: '8.3.23',
     descr: 'In place of the "m" ending in an inflected word , the substitution is to be the "anusvara" if a consonant follows',
     only: 'ext',
     tests: [
         ['शिवं नमः', 'शिवम्', 'नमः'],
         ['नरं पृच्छामि', 'नरम्', 'पृच्छामि'],
         ['नरं यच्छति', 'नरम्', 'यच्छति'],
         ['पुष्पं दत्तम्', 'पुष्पम्', 'दत्तम्'],
         ['', '', ''],
     ]
    },

    {sutra: '8.4.40',
     descr: 'Dental + Palatal / Palatal (ex S) + Dental -> Palatal',
     tests: [
         ['शिवश्च', 'शिवस्', 'च'], // dental + palatal - 8.4.40 -> corr -> 8.4.55 -> err, wtf?
         ['तच्च', 'तत्', 'च'],
         ['तज्जह', 'तत्', 'जह'], // 8.4.40 -> 4.4.53
         ['रामश्शेते', 'रामस्', 'शेते'],
         ['नगरादागच्छति', 'नगरात्', 'आगच्छति'],
         ['', '', ''],
         ['', '', ''],
     ]
    },

    {sutra: '8.4.44',
     descr: 'Dental + Palatal / Palatal (ex S) + Dental -> Palatal, except - 8.4.44',
     tests: [
         ['याच्ञा', 'याच्', 'ना'], // palatal + dental
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
     ]
    },

    {sutra: '',
     descr: '',
     only: 'int',
     tests: [
         ['', '', ''], //
         ['', '', ''],
     ]
    },

    {sutra: '',
     descr: '',
     only: 'int',
     tests: [
         ['', '', ''], //
         ['', '', ''],
     ]
    },

    {sutra: '',
     descr: '',
     only: 'int',
     tests: [
         ['', '', ''], //
         ['', '', ''],
     ]
    },

]

describe('consonant sandhi', function() {
    tests.forEach(function(t) {
        if (t.sutra == '') return;
        var descr = [t.sutra, t.descr, t.only].join(' - ');
        describe(descr, function() {
            t.tests.forEach(function(test) {
                if (t.only) test.push(t.only);
                utils.test(test);
            });
        });
    });
});
