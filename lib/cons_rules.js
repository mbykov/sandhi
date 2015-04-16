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
            if (u.c(Const.dental, test.fin) && u.c(Const.palatal, test.beg)) return;
            if (u.c(Const.palatal, test.fin) && u.c(Const.dental, test.beg)) return; // FIXME: must be second condition 8.4.44 - sa-tavarga - also
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
            var result = test.first.concat(jaS, virama, beg, test.second).join('');
            log('=====METHOD 8.2.39 ====', second);
            return result;
        }
    },

    /*
      22. naśchavyapraśān || 8.3.7 ||
      p.108. Excepting the w ord - 'prasan', in place of the final 'n' of a 'pada' the 'ru' (r) is to be the substitute, if a letter of 'chav pratyahara' preceded by a letter of 'am pratyahara' follows
    */
    /*
      ru: 23-24-25-26-27()-28-29-30-
     */
    // 33

    /*
      35. mo'nusvāraḥ || 8.3.23 ||
      p.91 - In place of the 'm ' ending in an inflected word , the substitution is to be the 'anusvara' if a consonant follows
     */
    {sutra: '8.3.23',
     cons: true,
     only: 'ext',
     method: function(test) {
         if (!(test.fin == 'म') || !(u.c(Const.consonants, test.beg)) ) return;
         test.first.pop();
         test.first.push(Const.anusvara);
         var result = [test.first.join(''), test.second.join('')].join(' ');
         log('=====METHOD 8.2.23 ====', result);
         return result;
     }
    },

    /* 54. stoḥ ścunāḥ ścuḥ || 8.4.40 || + śāt || 8.4.44 ||
       In the coalition of the dental group of letters (s, t, th, d, dh & n) with the palatal grou p of letters (s, c, c h , j h & n), the substitution is to be the palatal in place of the dentals
       and vice versa, except (8.4.44) when S is followed by tavarga
    */
    {sutra: '8.4.40',
     cons: true,
     only: 'ext',
     method: function(test) {
         var result;
         if (u.c(Const.dental, test.fin) && (u.c(Const.palatal, test.beg))) {
             test.first.pop();
             var palatal = u.den2pal(test.fin);
             result = test.first.concat(palatal, Const.virama, test.second).join('');
             log('=====METHOD 8.4.40 ====', test.fin, palatal, result);
         } else if (!((test.fin == 'श') && u.c(Const.tavarga, test.beg)) && u.c(Const.palatal, test.fin) && (u.c(Const.dental, test.beg))) {
             test.second.shift();
             var palatal = u.den2pal(test.beg);
             result = test.first.concat(Const.virama, palatal, test.second).join('');
             log('=====METHOD 8.4.44 ====', test.first, palatal, test.second, result); // या्ञा = याच्ञा
         }
         return result;
     }
    },




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
