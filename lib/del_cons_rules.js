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
             test.first.push(fin);
         }

         return test;
     }
    },

];

module.exports = rules;
