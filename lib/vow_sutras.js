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
         var res = [];
         if ((u.c(Const.hal, test.fin) || test.fin == Const.A)&& u.c(Const.aA, test.beg)) {
             // log(test)
             if (test.fin != Const.A) test.first.push(Const.A);
             test.second.shift();
         } else if (u.similar(test.fin, test.beg)) {
             // log(test)
             test.first.pop();
             test.first.push(u.dirghaLiga(test.fin));
             test.second.shift();
         }
         // либо конс+a/A, либо similar
         // log('ADD VOW', u.c(Const.hal, test.fin) && u.c(Const.aA, test.beg), u.similar(test.fin, test.beg));
         // log('SIMILAR fin:', test.fin, 'beg:', test.beg, u.similar(test.fin, test.beg));
         res.push(test);
         return res;
     }
    },

];

module.exports = sutras;
