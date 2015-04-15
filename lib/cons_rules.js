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
            if (!u.c(Const.jhal, test.matra) || !(u.c(Const.jaS, test.starts) || u.c(Const.allvowel, test.starts) )) return;
            test.first.pop();
            var virama = (test.first[0]) ? Const.virama : '';
            var vow = test.second.shift();
            var semi = Const.vow2semi[test.matra];
            var liga = Const.vow2liga[vow];
            log('=====METHOD 8.2.39 ====');
            return test.first.concat(virama, semi, liga, test.second).join('');
        }
    }


];

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
