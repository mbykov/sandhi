var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

// var dental_hard = u.hard(u.dental()); ==> ???? не поменять ли?
// var palatal_soft = u.soft(u.palatal());

var sutras = [

    /*
     */
    {num: '8.4.41',
     cons: true,
     only: 'ext',
     split: function(mark) {
         if (!u.c(u.cerebral(), mark.fin) || !u.c(u.cerebral(), mark.beg)) return;
         var fin;
         if (mark.fin == 'ण' && u.c(u.soft(u.cerebral()), mark.beg)) {
             d('=== split cerebral 1');
             fin = 'न';
         } else if (mark.fin != 'ष' && mark.beg == 'ष') {
             d('=== split cerebral 2', mark);
             fin = u.cerebral2dental(mark.fin);
         } else if (mark.fin == 'ष') {
             d('=== split cerebral 3', mark);
             fin = 'स';
         } else if (mark.fin == 'ड' && u.c(u.soft(), mark.beg)) {
             d('=== split cerebral 4', mark);
             fin = Const.cerebral_soft2dental_hard[mark.beg];
         } else {
             d('=== split cerebral 5');
             fin = u.cerebral2dental(mark.fin);
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
         } else if (test.fin != 'स' && test.beg == 'ष') {
             d('=== cerebral 2', u.dental());
             test.end = u.dental2cerebral(test.fin);
         } else if (test.fin == 'स') {
             d('=== cerebral 3');
             test.end = 'ष';
         } else if (u.c(u.hard(), test.fin) && u.c(u.soft(), test.beg)) {
             d('=== cerebral 4');
             test.end = 'ड';
         } else {
             test.end = u.dental2cerebral(test.fin);
         }
         res.push(test);
         return res;
     }
    },


];

module.exports = sutras;
