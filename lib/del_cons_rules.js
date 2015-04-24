var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;

var rules = [

    {sutra: '8.4.40',
     cons: true,
     only: 'ext', // ?
     method: function(test) {
         // log('DENTAL=============', test.fin);
         if (!u.c(Const.palatal, test.fin) || !u.c(Const.palatal, test.beg)) return;
         var fin;
         test.first.pop();
         if ((test.fin == 'ञ') && u.c(Const.JaS, test.beg)) {
             // == !! REVERSE !! == When the (dental is a nasal) and the (palatal is a soft consonant), the dental changes to (palatal class nasal)
             test.first.push('न');
         } else if ((test.fin == 'ज') && u.c(Const.JaS, test.beg)) {
             // (Dental class hard consonant) followed by (Palatal class soft consonant except nasal) changes to the (3rd of the Palatal class - ज)
             fin = Const.palatal_soft2dental_hard[test.beg];
             test.first.push(fin);
         } else if (test.fin != 'श' && test.beg == 'श') {
             // dental class consonant followed by (palatal sibilant) changes to the (corresponding palatal)- dental ex. s
             fin = u.pal2den(test.fin); // dental
             test.first.push(fin);
         } else if (test.fin != 'श' && (test.beg == 'छ') && (u.c(Const.allvowels, u.matra(test.sec)) || u.c(Const.yam, test.sec) || test.sec == 'ह्')) {
             // THE SAME, OPT - dental class consonant followed by (palatal sibilant) changes to the (corresponding palatal)- dental ex. s
             // If (श्) is followed by (vowel, semivowel, nasal or ह्), (श्) optionally changes to (छ)
             // recursion in del() - test.second affected
             fin = u.pal2den(test.fin); // dental
             test.first.push(fin);
             test.second.unshift('श');
         } else if (test.fin == 'श') {
             // (dental class sibilant) followed by (palatal class consonant or palatal sibilant) changes to (palatal sibilant).
             test.first.push('स');
         } else {
             // main
             fin = u.pal2den(test.fin); // palatal
             // log('DENTAL=============', test.fin, fin);
             test.first.push(fin);
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
             fin = 'न';
             test.first.push(fin);
         } else if (test.beg == 'ष') {
             // A (dental class consonant) followed by (cerebral sibilant) changes to the (corresponding cerebral)
             fin = u.cer2den(test.fin);
             test.first.push(fin);
         } else if (test.fin == 'स') {
             fin = 'ष';
             test.first.push(fin);
         } else if (test.fin == 'ड' && u.c(Const.haS, test.beg)) {
             // (Dental class hard consonant) followed by (Cerebral class soft consonant except nasal) changes to the (3rd of the Cerebral class)
             fin = Const.cerebral_soft2dental_hard[test.beg];
             test.first.push(fin);
         } else {
             fin = u.cer2den(test.fin);
             test.first.push(fin);
         }
         return test;
     }
    },

];

module.exports = rules;
