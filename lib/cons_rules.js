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

    /* stoḥ ścunāḥ ścuḥ || 8.4.40 || - śāt || 8.4.44 ||
       In the coalition of the dental group of letters (s, t, th, d, dh & n) with the palatal group of letters (s, c, c h , j h & n), the substitution is to be the palatal in place of the dentals
       and vice versa, but except - śāt - || 8.4.44 || - when S is followed by tavarga
    */
    {sutra: '8.4.40',
     cons: true,
     only: 'ext', // ?
     method: function(test) {
         if (u.c(Const.dental, test.fin) && u.c(Const.palatal, test.beg)) {
             test.first.pop();
             test.fin = u.den2pal(test.fin); // palatal
             test.first.push(test.fin);
         } else if (u.c(Const.palatal, test.fin) && u.c(Const.dental, test.beg) && !((test.fin == 'श') && u.c(Const.tavarga, test.beg))) {
             test.second.shift();
             test.beg = u.den2pal(test.fin); // palatal
             test.second.unshift(test.fin);
         }
         // if (!u.c(Const.jhal, test.fin) || !u.c(Const.khar, test.beg)) return true;
         log(test.fin, u.c(Const.jhal, test.fin), test.beg, u.c(Const.khar, test.beg))
         test.sutras.push(this.sutra);
         test.sutras.push('8.4.55');
         p('B: '+this.sutra, test);
         return true;
     }
    },
    /*
    */
    // {sutra: '8.4.44',
    //  cons: true,
    //  only: 'ext',
    //  method: function(test) {
    //      // FIXME: тут не закончил - поправить ифы
    //      return true;
    //      if (! ((test.fin == 'श') && u.c(Const.tavarga, test.beg)) && u.c(Const.palatal, test.fin) && (u.c(Const.dental, test.beg))) return true;
    //      p('A: 44', test);
    //      test.second.shift();
    //      test.beg = u.den2pal(test.beg); // palatal
    //      test.second.unshift(test.beg);
    //      test.sutras.push(this.sutra);
    //      p('A: 44', test);
    //      return true;
    //  }
    // },

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
            // return true; // странное правило - объединение 8.4.53 & 8.4.55
            if (!u.c(Const.jhal, test.fin) || !(u.c(Const.aS, test.beg) || u.c(Const.dirghas, test.beg) ) ) return true;
            // p('A: '+this.sutra, test);
            // log('BEG 39 ===>', u.c(Const.khar, test.beg));
            test.first.pop(); //jhal
            if (u.c(Const.khar, test.beg)) {
                test.fin = u.jhal2car(test.fin); // car
            } else {
                test.fin = u.jhal2jaS(test.fin); // jaS
            }
            test.first.push(test.fin);

            test.sutras.push(this.sutra);
            p('B: '+this.sutra, test);
            return true;
        }
    },

    /*
      60. khari ca || 8.4.55 ||
      8.2.39 except - the substitution is to be a letter of 'car pratyahara', if a letter of the 'khar pratyahara' follows
    */
    {sutra: '8.4.55',
     cons: true,
     only: 'ext', // ?
        method: function(test) {
            // return true;
            if (!u.c(Const.jhal, test.fin) || !u.c(Const.khar, test.beg)) return true;
            p('A: '+this.sutra, test);
            log('BEG 55 ===>', u.c(Const.khar, test.beg), Const.car);
            test.first.pop();
            test.fin = u.jhal2car(test.fin); // car
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
