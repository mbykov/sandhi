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
         }
         res.push(test);
         return res;
     }
    },

    // a or ā is followed by e, o, ai or au - vriddhi
    {num: '6.1.88',
     type: 'vow',
     only: 'ext',
     split: function(mark) {
     },

     add: function(test) {
         var res = [];
         if (!u.c(Const.aAliga, test.fin) || !u.c(Const.diphtongs, test.beg)) return;
         test.second.shift();
         if (Const.A == test.fin) test.first.pop();
         if (test.beg == 'ए') {
             test.second.unshift(u.liga('ऐ'));
         } else if (test.beg == 'ओ') {
             test.second.unshift(u.liga('औ'));
         } else if (test.beg == 'ऐ') {
             test.second.unshift(u.liga('ऐ'));
         } else if (test.beg == 'औ') {
             test.second.unshift(u.liga('औ'));
         }
         res.push(test);
         return res;
     }
    },

    // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel
    {num: '6.1.77',
     type: 'vow',
     only: 'ext',
     split: function(mark) {
     },

     add: function(test) {
         var res = [];
         if (!u.c(Const.allsimpleligas, test.fin) || !u.c(Const.allvowels, test.beg) || u.similar(test.fin, test.beg)) return;
         test.first.pop();
         test.second.shift();
         if (u.c(Const.iI, u.matra(test.fin))) {
             test.first.push('्य');
             test.second.unshift(u.liga(test.beg));
         } else if (u.c(Const.uU, u.matra(test.fin))) {
             test.first.push('्व');
             test.second.unshift(u.liga(test.beg));
         } else if (u.c(Const.fF, u.matra(test.fin))) {
             test.first.push('्र');
             test.second.unshift(u.liga(test.beg));
         } else if (test.fin == u.liga(Const.L)) {
             // FIXME: test - make test g=6.1.77.+_31_ - first is only one sym L, so w/o virama - but what about other vowels and prev cases?
             test.first.push('ल');
             test.second.unshift(u.liga(test.beg));
         }
         res.push(test);
         return res;
     }
    },


];

module.exports = sutras;
