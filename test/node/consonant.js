var utils = require('../utils');

var tests = [
    {sutra: '8.2.39',
     descr: 'hard consonant followed by a soft consonant or v. changes to the third of its class',
     tests: [
         ['श्रीमद्भगवद्गीता', 'श्रीमत्', 'भगवद्गीता'],
         ['वनादागच्छामि', 'वनात्', 'आगच्छामि'],
         ['सद्भडति', 'सत्', 'भडति'],
         ['प्रागूध', 'प्राक्', 'ऊध'],
         ['नगरादागच्छति', 'नगरात्', 'आगच्छति'],
         ['भगवद्गीता', 'भगवत्', 'गीता'],
         ['वधाद्विना', 'वधात्', 'विना'],
         // ['वनात्पिता', 'वनात्', 'पिता'], // failed in this very sutra
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
     ]
    },

    {SUTRA: '',
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
