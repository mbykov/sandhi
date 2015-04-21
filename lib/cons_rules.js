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
    {sutra: '8.3.23',
     cons: true,
     only: 'ext',
     method: function(test) {
         return true;
         if (!(test.fin == 'म') || !(u.c(Const.consonants, test.beg)) ) return true;
         test.first.pop();
         test.first.push(Const.anusvara);
         var result = [test.first.join(''), test.second.join('')].join(' ');
         // p(this.sutra, result);
         test.sutras.push(this.sutra);
         return false;
     }
    },

    // lingual == cerebral == w-varga

    /*
    //   Note: The rule sasajuṣo ruḥ || 8.2.66 || debars the application of this rule for words ending in sibilants, and  has been incorporated earlier in Set 1 rules itself.
    /*
      20. jhalām jaśo'nte || 8.2.39 || + || 8.4.55||
      LSK p.81:  A letter of 'jas pratyahara ' is to be the substitute of a letter of 'jhal pratyahara' ending in an inflected word,
      except 8.4.55 - the substitution is to be a letter of 'car pratyahara', if a letter of the 'khar pratyahara' follows
    */
    {sutra: '8.2.39',
     cons: true,
     only: 'ext',
        method: function(test) {
            return true; // странное правило - объединение 8.4.53 & 8.4.55
            if (!u.c(Const.jhal, test.fin)) return true;
            // p('A: '+this.sutra, test);
            if (u.c(Const.khar, test.beg)) {
                test.fin = u.jhal2car(test.fin); // car
            } else if (u.c(Const.aS, test.beg) || u.c(Const.dirghas, test.beg)) {
                test.fin = u.jhal2jaS(test.fin); // jaS
            } else {
                return true;
            }
            test.first.pop();
            test.first.push(test.fin);
            test.sutras.push(this.sutra);
            p('B: '+this.sutra, test);
            return true;
        }
    },

    // ========= все не то ======

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
         if (u.c(Const.dental, test.fin) && u.c(Const.palatal, test.beg)) {
             test.first.pop();
             test.fin = u.den2pal(test.fin); // palatal
             test.first.push(test.fin);
         } else if (u.c(Const.palatal, test.fin) && u.c(Const.dental, test.beg) && !((test.fin == 'श') && u.c(Const.tavarga, test.beg))) {
             test.second.shift();
             test.beg = u.den2pal(test.fin); // palatal
             test.second.unshift(test.fin);
         } else {
             return true;
         }
         // log(test.fin, u.c(Const.jhal, test.fin), test.beg, u.c(Const.khar, test.beg))
         test.sutras.push(this.sutra);
         test.sutras.push('8.4.55'); // исключть 55
         test.sutras.push('8.2.39'); // исключть 39
         // сейчас работают сутры 4.53 и 4.55 - но м.б. 4.40 - попросту вообще отрицает 53-55, глухие-звонкие?
         p('B: '+this.sutra, test);
         return true;
     }
    },

    /*
      59. jhalam jas jhasi || 8.4.53 ||
      A letter of 'jaS pratyahara' is to be the substitute of a letter of 'jhal pratyahara', if a letter of 'jhaS pratyahara' follows
      => jaS - soft unaspirate; JaS - all soft, Jal - all cons ex. nasals ==> modern: Hard Consonant to Soft Consonant (3rd of class)
    */
    {sutra: '8.4.53',
     cons: true,
     only: 'ext', // ?
        method: function(test) {
            // return true;
            log('==============')
            // if (u.c(Const.aS, test.beg) || u.c(Const.dirghas, test.beg)) {
            if (!u.c(Const.jhal, test.fin) || !u.c(Const.jhaS, test.beg)) return true;
            // log('===', u.c(Const.jhaS, test.beg), test.beg, Const.jhaS);
            test.first.pop();
            test.fin = u.jhal2jaS(test.fin); // jaS
            test.first.push(test.fin);
            test.sutras.push(this.sutra);
            p('B: '+this.sutra, test);
            return true;
        }
    },

    /*
      60. khari ca || 8.4.55 ||
      8.2.39 - the substitution is to be a letter of 'car pratyahara', if a letter of the 'khar pratyahara' follows
    */
    {sutra: '8.4.55',
     cons: true,
     only: 'ext', // ?
     method: function(test) {
         // return true;
         // if (!u.c(Const.jhal, test.fin) || !u.c(Const.khar, test.beg)) return true; <== correct text according to LSK
         if (!u.c(Const.jhaS, test.fin) || !u.c(Const.khar, test.beg)) return true; // JaS == soft consonants only
         // p('A: '+this.sutra, test);
         // log('BEG 55 ===>', u.c(Const.khar, test.beg), Const.car);
         test.first.pop();
         test.fin = u.jhal2car(test.fin); // car - but why not cay-च,ट,त,क,प ?
         test.first.push(test.fin);
         test.sutras.push(this.sutra);
         p('B: '+this.sutra, test);
         return true;
     }
    },


];



// function p(sutra, test) {
//     console.log('=>', sutra, JSON.stringify(test.first), test.vir, JSON.stringify(test.second));
// }
function p(sutra, test) {
    console.log('=>', sutra, JSON.stringify(test));
}




module.exports = rules;
