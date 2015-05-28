var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

var sutras = {

    /*
      class consonant followed by (nasal) optionally changes to the nasal of class, or less commonly for class hard consonants, changes to 3rd consonant of class
      same: (class consonant become the nasal sound from their varga when followed by n or m OR after class hard consonant changes to 3rd consonant of class),
      FIXME: тут любые согласные, или unaspirated? На аспир. нет примера
      reverse: 'nasal OR 3rd, when followed by n or m become the four final stops (k t ṭ p), OR voiced',
    */
    '8.4.45': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            var hard = u.class1(mark.fin);
            if (!hard) return;
            var soft = Const.unvoiced2voiced[hard];
            var hvalue = [hard, Const.virama, ' ', mark.beg].join('');
            var svalue = [soft, Const.virama, ' ', mark.beg].join('');
            return [hvalue, svalue];
        },

        add: function(mark) {
            var res = [];
            var opt;
            res.push(mark);
            opt = JSON.parse(JSON.stringify(mark));
            opt.first.pop();
            opt.end = u.class5(mark.fin);
            res.push(opt);
            if (u.c(Const.Kar, mark.fin)) {
                var hard = JSON.parse(JSON.stringify(mark));
                hard.first.pop();
                hard.end = u.class3(mark.fin);
                res.push(hard);
            }
            return res;
        }
    },

    // dental class consonant followed by a palatal class consonant changes to the corresponding palatal ===> so, doubled palatal
    '8.4.40': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            var fin;
            var beg = mark.beg;
            if ((mark.fin == 'ञ') && u.c(Const.JaS, mark.beg)) {
                fin = 'न';
            } else if ((mark.fin == 'ज') && u.c(Const.JaS, mark.beg)) {
                fin = Const.palatal_soft2dental_hard[mark.beg];
            } else if (mark.fin != 'श' && mark.beg == 'श') {
                fin = u.pal2den(mark.fin); // dental
            } else if (mark.fin != 'श' && (mark.beg == 'छ')) { // FIXME: тут проблема в том, что я не знаю здесь samasa и не могу вычислить вторую букву
                fin = u.pal2den(mark.fin); // dental
                beg = 'श'
            } else if (mark.fin == 'श') {
                fin = 'स';
            } else {
                fin = u.pal2den(mark.fin); // palatal
            }
            fin = [fin, Const.virama, ' ', beg].join('');
            return [fin];
        },

        add: function(mark) {
            var res = [];
            mark.first.pop();
            if ((mark.fin == 'न') && u.c(u.soft(u.palatal()), mark.beg)) { // FIXME: any nasal ????
                mark.end = 'ञ';
            } else if (u.c(u.hard(u.dental()), mark.fin) && u.c(u.soft(u.palatal()), mark.beg)) {
                mark.end = 'ज';
            } else if (mark.fin != 'स' && mark.beg == 'श') {
                mark.end = u.dental2palatal(mark.fin);
                var sec = mark.second[1];
                if (u.c(Const.allvowels, u.vowel(sec)) || u.c(Const.yam, sec) || sec == 'ह्') {
                    var opt = JSON.parse(JSON.stringify(mark));
                    opt.second.shift();
                    opt.second.unshift('छ');
                    res.push(opt);
                }
            } else if (mark.fin == 'स') {
                mark.end = 'श';
            } else {
                mark.end = u.dental2palatal(mark.fin);
            }
            res.push(mark);
            return res;
        }
    },

    // dental class consonant followed by a cerebral class consonant changes to the corresponding cerebral
    '8.4.41': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            var fin;
            if (mark.fin == 'ण' && u.c(u.soft(u.cerebral()), mark.beg)) {
                fin = 'न';
            } else if (mark.fin != 'ष' && mark.beg == 'ष') {
                fin = u.cerebral2dental(mark.fin);
            } else if (mark.fin == 'ष') {
                fin = 'स';
            } else if (mark.fin == 'ड' && u.c(u.soft(), mark.beg)) {
                fin = Const.cerebral_soft2dental_hard[mark.beg];
            } else {
                fin = u.cerebral2dental(mark.fin);
            }
            fin = [fin, Const.virama, ' ', mark.beg].join('');
            return [fin];
        },

        add: function(mark) {
            var res = [];
            mark.first.pop();
            if (mark.fin == 'न' && u.c(u.soft(u.cerebral()), mark.beg)) { // FIXME: any nasal? and the same note for split
                mark.end = 'ण';
            } else if (mark.fin != 'स' && mark.beg == 'ष') {
                mark.end = u.dental2cerebral(mark.fin);
            } else if (mark.fin == 'स') {
                mark.end = 'ष';
            } else if (u.c(u.hard(), mark.fin) && u.c(u.soft(), mark.beg)) {
                mark.end = 'ड';
            } else {
                mark.end = u.dental2cerebral(mark.fin);
            }
            res.push(mark);
            return res;
        }
    },

    // If n is followed by l, then n is replaced by nasal l. If a dental other than n and s is followed by l, then the dental is replaced by l.
    '8.4.60': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            var res = [];
            u.dental().split('').forEach(function(d) {
                if (d == 'न' && !mark.candra) return;
                else if (d != 'न' && mark.candra) return;
                var term = [d, Const.virama, ' ', 'ल'].join('');
                res.push(term);
            });
            return res;
        },

        add: function(mark) {
            var res = [];
            mark.first.pop();
            if (mark.fin == 'न') {
                mark.end = 'लँ';
            } else {
                mark.end = 'ल';
            }
            res.push(mark);
            return res;
        }
    },

    // n,m to anusvara
    // ==> In place of the "m" ending in an inflected word , the substitution is to be the "anusvara" if a consonant follows',
    // TODO: I1.3. म् (palatal nasal) followed by (य्,ल्,व्) changes to (nasalized य्,ल्,व्).
    '8.3.23': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            var term = 'म् ';
            // log('M', mark);
            return [term, Const.anusvara]; // anusvara in a middle of a splitted segment
            // return ['ध्', term]; // anusvara in a middle of a splitted segment
        },

        add: function(mark) {
            var res = [];
            mark.first.pop();
            var opt = JSON.parse(JSON.stringify(mark))
            mark.first.push(Const.anusvara);
            mark.vir = false;
            var nasal = u.nasal(mark.beg);
            opt.first.push(nasal);
            res.push(mark);
            res.push(opt);
            return res;
        }
    },

    // ङ्, ण्, न् at the end of a word after a short vowel doubles itself when followed by a vowel
    'cons-nasal-doubled': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            term =[mark.fin, Const.virama, ' ', u.vowel(mark.beg)].join('');
            return [term];
        },

        add: function(mark) {
            mark.first.push(Const.virama);
            mark.first.push(mark.fin);
            return [mark];
        }
    },

    // soft consonant except nasal, followed by a hard consonant changes to 1st consonant of class
    // FIXME: здесь тоже отдельный метод для h - ? нужен пример
    '8.4.55': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            var soft = u.class3(mark.fin);
            term =[soft, Const.virama, ' '].join('');
            return [term];
        },

        add: function(mark) {
            var hard = u.class1(mark.fin);
            mark.first.pop();
            mark.first.push(hard);
            return [mark];
        }
    },

    // hard consonant followed by a soft consonant but nasal or vow. changes to the third of its class
    '8.2.39': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            // log(1, mark)
            var hard = u.class1(mark.fin);
            var term = (u.c(Const.allvowels, u.vowel(mark.beg))) ? u.vowel(mark.beg) : '';
            term =[hard, Const.virama, ' ', term].join('');
            return [term];
        },

        add: function(mark) {
            // log(1, mark)
            var soft = u.class3(mark.fin);
            // log(1, mark.fin, soft)
            mark.first.pop();
            mark.first.push(soft);
            return [mark];
        }
    },

    //
    '': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            var res = [];
            return res;
        },

        add: function(mark) {
            var res = [];
            return res;
        }
    },

}

module.exports = sutras;
