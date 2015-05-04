var u = require('./utils');
var Const = require('./const');
var log = u.log;
var d = u.debug;

var sutras = [

    /*
      simple vowel, followed by a similar vowel => dirgha
     */
    {num: '1.6.101',
     type: 'vow',
     only: 'ext',
     split: function(mark) {
         // if (!u.c(u.cerebral(), mark.fin) || !u.c(u.cerebral(), mark.beg)) return;
         // var fin;
         // if (mark.fin == 'ण' && u.c(u.soft(u.cerebral()), mark.beg)) {
         //     fin = '';
         // }
         // fin = [fin, Const.virama, ' ', mark.beg].join('');
         // return [fin];
     },

     add: function(test) {
         // if (!u.c(u.dental(), test.fin) || !u.c(u.cerebral(), test.beg)) return;
         // либо конс+a/A, либо
         log('ADD VOW', Const.allsimples, Const.allsimpleligas);
         log('SIMILAR fin:', test.fin, 'beg:', test.beg, u.similar(test.fin, test.beg));
         var res = [];
         test.first.push(Const.A);
         res.push(test);
         // return ['योगानुशासन'];
         return res;
     }
    },


];

module.exports = sutras;
