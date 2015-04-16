var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;

var rules = [

    /*
      19. saṁyogāntasya lopaḥ || 8.2.23 ||
      If the final consonant of X is preceded by a consonant, then the last consonant is dropped.
      == нет - две согласные в конце слова ==
      1st Rule -   No Sanskrit word can end in two or more consonants. The only exceptions are the endings "rk", "rṭ", "rt" and "rp". (Roots are not to be included in this rule)
      найти примеры, и на rk, rt тоже
    */


    //   Note: The rule sasajuṣo ruḥ || 8.2.66 || debars the application of this rule for words ending in sibilants, and  has been incorporated earlier in Set 1 rules itself.
    /*
      20. jhalām jaśo'nte || 8.2.39 ||  jhal -> jaS if aS
      A hard consonant followed by a soft consonant or vowel changes to the third of its class, i.e  4th. 3rd. 2nd. & 1st. letters of class consonants, the sibilant and the aspirate -> soft
      LAGHU. KAU:  A letter of jhal-pratyahara is to be substituted by a letter of jaS-pratyahara, if  follows a letter of aS-pratyahara - viz. -
      (a) the Vowels, (b) the aspirate h and the  semi-vowels (c) the 5th., 4th. & 3rd. letters of five class consonants
    */
    {sutra: '8.2.39',
        cons: true,
        method: function(test) {
            if (!u.c(Const.jhal, test.fin) || !(u.c(Const.aS, test.beg) || u.c(Const.dirghas, test.beg) ) ) return;
            var jhal = test.first.pop();
            var jaS = u.jhal2jaS(jhal);
            var second = test.second;
            var beg = '';
            var virama = Const.virama;
            if (u.c(Const.allvowels, test.beg)) {
                second.shift();
                beg = Const.vow2liga[test.beg];
                virama = '';
            }
            // log('=====METHOD 8.2.39 ====', (test.first.concat(jaS, Const.virama, test.second).join('') == 'श्रीमद्भगवद्गीता')); //
            var result = test.first.concat(jaS, virama, beg, test.second).join('');
            log('=====METHOD 8.2.39 ====', beg);
            return result;
        }
    }


];

// श्रीमद्भगवद्गीता
// श्रीमद्भगवद्गीता


/*
  ज,ब,ग,ड,द,
  झ,भ,घ,ढ,ध,
  ख,फ,छ,ठ,थ,
  च,ट,त,क,प,
  श,ष,स,ह

  ज,ब,ग,ड,द

  g - ग, ध,ख,क,ह
  j - ज, झ,छ,च,श,
  b - ब, भ,फ,प,
  D - ड, ढ,ठ,ट,ष,
  d - द, ध,थ,त,स,

*/




module.exports = rules;
