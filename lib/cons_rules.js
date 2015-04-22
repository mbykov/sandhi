var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;

var rules = [

    /*
      19. saṁyogāntasya lopaḥ || 8.2.23 ||
      If the final consonant of X is preceded by a consonant, then the last consonant is dropped.
      == две согласные в конце слова ==
      1st Rule -   No Sanskrit word can end in two or more consonants. The only exceptions are the endings "rk", "rṭ", "rt" and "rp". (Roots are not to be included in this rule)
      найти примеры, и на rk, rt тоже
    */


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
    // {sutra: '8.3.23',
    //  cons: true,
    //  only: 'ext',
    //  method: function(test) {
    //      return true;
    //      if (!(test.fin == 'म') || !(u.c(Const.consonants, test.beg)) ) return true;
    //      test.first.pop();
    //      test.first.push(Const.anusvara);
    //      var result = [test.first.join(''), test.second.join('')].join(' ');
    //      // p(this.sutra, result);
    //      test.sutras.push(this.sutra);
    //      return false;
    //  }
    // },

    // lingual == cerebral == w-varga

    /*
    //   Note: The rule sasajuṣo ruḥ || 8.2.66 || debars the application of this rule for words ending in sibilants, and  has been incorporated earlier in Set 1 rules itself.
    /*
      20. jhalām jaśo'nte || 8.2.39 || + || 8.4.55||
      LSK p.81:  A letter of 'jas pratyahara ' is to be the substitute of a letter of 'jhal pratyahara' ending in an inflected word,
      except 8.4.55 - the substitution is to be a letter of 'car pratyahara', if a letter of the 'khar pratyahara' follows
    */
    // {sutra: '8.2.39',
    //  cons: true,
    //  only: 'ext',
    //     method: function(test) {
    //         return true; // странное правило - объединение 8.4.53 & 8.4.55
    //         if (!u.c(Const.jhal, test.fin)) return true;
    //         // p('A: '+this.sutra, test);
    //         if (u.c(Const.Kar, test.beg)) {
    //             test.fin = u.jhal2car(test.fin); // car
    //         } else if (u.c(Const.aS, test.beg) || u.c(Const.dirghas, test.beg)) {
    //             test.fin = u.jhal2jaS(test.fin); // jaS
    //         } else {
    //             return true;
    //         }
    //         test.first.pop();
    //         test.first.push(test.fin);
    //         test.sutras.push(this.sutra);
    //         p('B: '+this.sutra, test);
    //         return true;
    //     }
    // },


    /* stoḥ ścunāḥ ścuḥ || 8.4.40 || - śāt || 8.4.44 ||
       In the coalition of the dental group of letters (s, t, th, d, dh & n) with the palatal group of letters (s, c, c h , j h & n), the substitution is to be the palatal in place of the dentals
       and vice versa, but except - śāt - || 8.4.44 || - when S is followed by tavarga
       s, t, th, d, dh & n => S, c, C , j, J & N
    */
    {sutra: '8.4.40',
     cons: true,
     only: 'ext', // ?
     method: function(test) {
         // return true;
         var res = [];
         var fin;
         if (u.c(Const.dental, test.fin) && u.c(Const.palatal, test.beg)) {
             test.first.pop();
             if ((test.fin == 'न') && u.c(Const.JaS, test.beg)) {
                 // log('NASAL')
                 // When the (dental is a nasal) and the (palatal is a soft consonant), the dental changes to (palatal class nasal)
                 test.first.push('ञ');
             } else if (u.c(Const.Kar, test.fin) && u.c(Const.JaS, test.beg)) {
                 // log('jaS')
                 // (Dental class hard consonant) followed by (Palatal class soft consonant except nasal) changes to the (3rd of the Palatal class)
                 fin = u.jhal2jaS(test.beg);
                 test.first.push(fin);
             } else if (test.beg == 'श' && test.fin != 'स') {
                 // log('BEG SHI')
                 // dental class consonant followed by (palatal sibilant) changes to the (corresponding palatal)
                 fin = u.den2pal(test.fin); // palatal
                 test.first.push(fin);
                 var sec = test.second[1];
                 if (u.c(Const.allvowels, u.matra(sec)) || u.c(Const.yam, sec) || sec == 'ह्') {
                     // If (श्) is followed by (vowel, semivowel, nasal or ह्), (श्) optionally changes to (छ)
                     var opt = JSON.parse(JSON.stringify(test));
                     opt.second.shift()
                     opt.second.unshift('छ');
                     res.push(opt);
                 }
             } else if (test.fin == 'स') {
                 // log('SSS')
                 test.first.push('श');
             } else {
                 // log('ELSE')
                 fin = u.den2pal(test.fin); // palatal
                 test.first.push(fin);
             }
             // test.fins.push(fin);
             res.push(test);
             // } else if (u.c(Const.palatal, test.fin) && u.c(Const.dental, test.beg) && !((test.fin == 'श') && u.c(Const.tavarga, test.beg))) {
             //     test.second.shift();
             //     test.beg = u.den2pal(test.fin); // palatal
             //     test.second.unshift(test.fin);
             // } else {
             //     return [];
         }
         // p('B: '+this.sutra, test);
         return res;
     }
    },

    /*
      55. ṣṭunāḥ ṣṭuḥ || 8.4.41 ||, na padāntāṭṭoranāṁ || 8.4.42 ||, toḥ ṣi || 8.4.43 ||
     */
    {sutra: '8.4.41',
     cons: true,
     only: 'ext', // ?
     method: function(test) {
         // return true;
         var res = [];
         var fin;
         // A (dental class consonant) followed by a (cerebral class consonant) changes to the (corresponding cerebral)
         // log('CEREB')
         if (!u.c(Const.dental, test.fin) || !u.c(Const.cerebral, test.beg)) return;
         test.first.pop();
         if (test.fin == 'न' && u.c(Const.haS, test.beg)) {
             // When the (dental is a nasal) and the (cerebral is a soft consonant), the dental changes to (cerebral class nasal).
             fin = 'ण'
             test.first.push(fin);
         } else if (test.beg == 'ष') {
             // A (dental class consonant) followed by (cerebral sibilant) changes to the (corresponding cerebral)
             fin = u.den2cer(test.fin);
             test.first.push(fin);
         } else if (test.fin == 'स') {
             fin = 'ष';
             test.first.push(fin);
         } else if (u.c(Const.Kar, test.fin) && u.c(Const.haS, test.beg)) {
             // (Dental class hard consonant) followed by (Cerebral class soft consonant except nasal) changes to the (3rd of the Cerebral class)
             fin = u.jhal2jaS(test.beg);
             test.first.push(fin);
         } else {
             fin = u.den2cer(test.fin);
             test.first.push(fin);
         }

         res.push(test);
         return res;
     }
    },

    /*
      59. jhalam jas jhasi || 8.4.53 ||
      A letter of 'jaS pratyahara' is to be the substitute of a letter of 'jhal pratyahara', if a letter of 'jhaS pratyahara' follows
      => jaS - soft unaspirate; JaS - all soft, Jal - all cons ex. nasals ==> modern: Hard Consonant to Soft Consonant (3rd of class)
    */
    // {sutra: '8.4.53',
    //  cons: true,
    //  only: 'ext', // ?
    //     method: function(test) {
    //         return true;
    //         // if (u.c(Const.aS, test.beg) || u.c(Const.dirghas, test.beg)) {
    //         if (!u.c(Const.jhal, test.fin) || !u.c(Const.JaS, test.beg)) return true;
    //         // log('===', u.c(Const.JaS, test.beg), test.beg, Const.JaS);
    //         test.first.pop();
    //         test.fin = u.jhal2jaS(test.fin); // jaS
    //         test.first.push(test.fin);
    //         test.sutras.push(this.sutra);
    //         p('B: '+this.sutra, test);
    //         return true;
    //     }
    // },

    /*
      60. khari ca || 8.4.55 ||
      8.2.39 - the substitution is to be a letter of 'car pratyahara', if a letter of the 'khar pratyahara' follows
    */
    // {sutra: '8.4.55',
    //  cons: true,
    //  only: 'ext', // ?
    //  method: function(test) {
    //      return true;
    //      // if (!u.c(Const.jhal, test.fin) || !u.c(Const.Kar, test.beg)) return true; <== correct text according to LSK
    //      if (!u.c(Const.JaS, test.fin) || !u.c(Const.Kar, test.beg)) return true; // JaS == soft consonants only
    //      // p('A: '+this.sutra, test);
    //      // log('BEG 55 ===>', u.c(Const.Kar, test.beg), Const.car);
    //      test.first.pop();
    //      test.fin = u.jhal2car(test.fin); // car - but why not cay-च,ट,त,क,प ?
    //      test.first.push(test.fin);
    //      test.sutras.push(this.sutra);
    //      p('B: '+this.sutra, test);
    //      return true;
    //  }
    // },


];



// function p(sutra, test) {
//     console.log('=>', sutra, JSON.stringify(test.first), test.vir, JSON.stringify(test.second));
// }
function p(sutra, test) {
    console.log('=>', sutra, JSON.stringify(test));
}




module.exports = rules;
