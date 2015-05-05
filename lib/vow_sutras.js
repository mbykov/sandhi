var u = require('./utils');
var Const = require('./const');
var log = u.log;
var d = u.debug;

var sutras = [

    // simple vowel, followed by a similar vowel => dirgha
    {num: '6.1.101',
     type: 'vow',
     only: 'ext',
     split: function(mark) {
     },

     add: function(test) {
         var res = [];
         if (u.c(Const.aAliga, test.fin) && u.c(Const.aA, test.beg)) {
             // log('aA', test)
             if (test.fin != Const.A) test.first.push(Const.A);
             test.second.shift();
         } else if (u.similar(test.fin, test.beg)) {
             // log('similar', test)
             test.first.pop();
             test.first.push(u.dirghaLiga(test.fin));
             test.second.shift();
         } else {
             return;
         }
         res.push(test);
         return res;
     }
    },

    // a or ā is followed by i, ī, u, ū, ṛ, ṝ or ḷ -  guna
    {num: '6.1.87',
     type: 'vow',
     only: 'ext',
     split: function(mark) {
     },

     add: function(test) {
         var res = [];
         if (!u.c(Const.aAliga, test.fin) || !u.c(Const.allsimples, test.beg)) return;
         test.second.shift();
         if (Const.A == test.fin) test.first.pop();
         if (u.c(Const.iI, test.beg)) {
             test.second.unshift(u.liga('ए'));
             d('====> I');
         } else if (u.c(Const.uU, test.beg)) {
             test.second.unshift(u.liga('ओ'));
             d('====> U');
         } else if (u.c(Const.fF, test.beg)) {
             test.second.unshift('र्');
             d('====> F');
         } else if (test.beg == Const.L) {
             test.second.unshift('ल्');
             d('====> L');
         } else {
             d('kuku', Const.uU)
         }
         res.push(test);
         return res;
     }
    },

];

module.exports = sutras;
