var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;

var rules = [

    {sutra: '8.4.40',
     cons: true,
     only: 'ext', // ?
     method: function(test) {
         if (!u.c(Const.palatal, test.fin) || !u.c(Const.palatal, test.beg)) return;
         var fin;
         test.first.pop();
         if ((test.fin == 'ञ') && u.c(Const.JaS, test.beg)) {
             // == !! REVERSE !! == When the (dental is a nasal) and the (palatal is a soft consonant), the dental changes to (palatal class nasal)
             test.end = 'न';
         } else if ((test.fin == 'ज') && u.c(Const.JaS, test.beg)) {
             // (Dental class hard consonant) followed by (Palatal class soft consonant except nasal) changes to the (3rd of the Palatal class - ज)
             test.end = Const.palatal_soft2dental_hard[test.beg];
         } else if (test.fin != 'श' && test.beg == 'श') {
             // dental class consonant followed by (palatal sibilant) changes to the (corresponding palatal)- dental ex. s
             test.end = u.pal2den(test.fin); // dental
         } else if (test.fin != 'श' && (test.beg == 'छ') && (u.c(Const.allvowels, u.matra(test.sec)) || u.c(Const.yam, test.sec) || test.sec == 'ह्')) {
             // THE SAME, OPT - dental class consonant followed by (palatal sibilant) changes to the (corresponding palatal)- dental ex. s
             // If (श्) is followed by (vowel, semivowel, nasal or ह्), (श्) optionally changes to (छ)
             // recursion in del() - test.second affected
             test.end = u.pal2den(test.fin); // dental
             test.second.unshift('श');
         } else if (test.fin == 'श') {
             // (dental class sibilant) followed by (palatal class consonant or palatal sibilant) changes to (palatal sibilant).
             test.end = 'स';
         } else {
             // main
             test.end = u.pal2den(test.fin); // palatal
         }
         // log('DENTAL TEST=============', test.fin, fin);
         return test;
     }
    },

    //
    {sutra: '8.4.41',
     cons: true,
     only: 'ext', // ?
     method: function(test) {
         // return true;
         var fin;
         // A (dental class consonant) followed by a (cerebral class consonant) changes to the (corresponding cerebral)
         // log('CEREB')
         if (!u.c(Const.cerebral, test.fin) || !u.c(Const.cerebral, test.beg)) return;
         test.first.pop();
         if (test.fin == 'ण' && u.c(Const.haS, test.beg)) {
             // When the (dental is a nasal) and the (cerebral is a soft consonant), the dental changes to (cerebral class nasal).
             test.end = 'न';
         } else if (test.beg == 'ष') {
             // A (dental class consonant) followed by (cerebral sibilant) changes to the (corresponding cerebral)
             test.end = u.cer2den(test.fin);
         } else if (test.fin == 'स') {
             test.end = 'ष';
         } else if (test.fin == 'ड' && u.c(Const.haS, test.beg)) {
             // (Dental class hard consonant) followed by (Cerebral class soft consonant except nasal) changes to the (3rd of the Cerebral class)
             test.end = Const.cerebral_soft2dental_hard[test.beg];
         } else {
             test.end = u.cer2den(test.fin);
         }
         return test;
     }
    },

    /*
      59. torli || 8.4.60 ||
      If n is followed by l, then n is replaced by nasal l.
      If a dental other than n and s is followed by l, then the dental is replaced by l.
    */
    {sutra: '8.4.60',
     cons: true,
     only: 'ext',
     method: function(test) {
         var fin;
         if (!(test.fin == 'ल') || test.beg != 'ल') return;
         test.first.pop();
         if (test.candra) { // 'लँ'
             test.end = 'न';
         } else {
             Const.tavarga.pop(); // tavarga: ['त', 'थ', 'द', 'ध', 'न']
             test.ends = Const.tavarga;
         }
         return test;
     }
    },

];

module.exports = rules;
