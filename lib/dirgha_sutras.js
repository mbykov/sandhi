var u = require('./utils');
var Const = require('./const');
var log = u.log;
var d = u.debug;

var sutras = [

    /*
     */
    {num: '',
     type: 'durgha',
     only: 'ext',
     split: function(mark) {
         if (!u.c(u.cerebral(), mark.fin) || !u.c(u.cerebral(), mark.beg)) return;
         var fin;
         if (mark.fin == 'ण' && u.c(u.soft(u.cerebral()), mark.beg)) {
             fin = '';
         }
         fin = [fin, Const.virama, ' ', mark.beg].join('');
         return [fin];
     },

     add: function(test) {
         if (!u.c(u.dental(), test.fin) || !u.c(u.cerebral(), test.beg)) return;
         var res = [];
         test.first.pop();
         if (test.fin == 'न' && u.c(u.soft(u.cerebral()), test.beg)) { // FIXME: any nasal? and the same note for split
             d('=== cerebral 1');
             test.end = 'ण';
         }
         res.push(test);
         return res;
     }
    },


];

module.exports = sutras;
