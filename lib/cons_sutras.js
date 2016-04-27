var _ = require('underscore');
var u = require('./utils');
var inc = u.include;
// var Const = require('./const');
var c = require('./const');
var log = u.log;
var d = u.debug;

var sutras = {

    'cons-to-nasal-or-third': { // 8.4.45 // यावदेतान् + निरीक्षः
        del: function(o) {
            var ends;
            if ((inc(c.Nam, o.fin) && inc(c.nm, o.beg))  || (inc(c.class3, o.fin) && inc(c.nm, o.beg) ) ) {
                var hard = u.class1(o.fin);
                var soft = u.class3(o.fin);
                ends = [hard, soft, o.fin];
            } else ends = [o.fin];
            var first = o.first.slice(0,-1);
            var firsts = ends.map(function(e) {
                return [first, e, c.virama].join('')
            });

            var seconds = [o.second];
            var res = {firsts: firsts, seconds: seconds};
            return res;
        },

        add: function(o) {
            var res = [];
            var opt;
            res.push(o);
            opt = JSON.parse(JSON.stringify(o));
            opt.first.pop();
            opt.end = u.class5(o.fin);
            res.push(opt);
            if (inc(c.Kar, o.fin)) {
                var hard = JSON.parse(JSON.stringify(o));
                hard.first.pop();
                hard.end = u.class3(o.fin);
                res.push(hard);
            }
            return res;
        }
    },

    // '8.4.45-hard': {
    //     type: 'cons',
    //     only: 'ext',

    //     del: function(o) {
    //         var hard = u.class1(o.fin);
    //         var soft = u.class3(o.fin);
    //         var ends = [hard, soft];
    //         var first = o.first.slice(0,-1);
    //         var firsts = ends.map(function(e) {
    //             return [first, e, c.virama].join('')
    //         });

    //         var seconds = [o.second];
    //         var res = {firsts: firsts, seconds: seconds};
    //         return res;
    //     },

    //     add: function(o) {
    //         var res = [];
    //         var opt;
    //         res.push(o);
    //         opt = JSON.parse(JSON.stringify(o));
    //         opt.first.pop();
    //         opt.end = u.class5(o.fin);
    //         res.push(opt);
    //         if (inc(c.Kar, o.fin)) {
    //             var hard = JSON.parse(JSON.stringify(o));
    //             hard.first.pop();
    //             hard.end = u.class3(o.fin);
    //             res.push(hard);
    //         }
    //         return res;
    //     }
    // },

    // dental class consonant followed by a palatal class consonant changes to the corresponding palatal ===> so, doubled palatal
    'dental-palatal': { // 8.4.40
        del: function(o) {
            // log('M', o)
            var dental = u.palatal2dental(o.fin);
            if (inc(c.class3, dental)) dental = u.class1(dental); // hard from dental-class3
            var first = o.first.slice(0,-1);
            var tail = (dental == 'स') ? c.visarga : [dental, c.virama].join(''); // s -> H
            first = [first, tail].join('');
            var firsts = [first];
            var seconds = [o.second];
            var res = {firsts: firsts, seconds: seconds};
            if (o.beg == c.C) {
                var second_S = [c.S, u.wofirst(o.second)].join('');
                res.seconds.push(second_S);
            }
            return res;
        },

        add: function(o) {
            // log('M', o.fin); // (u.dental(), c.dentals, u.hard(c.dentals), 'P', c.palatals, 333, u.soft(c.palatals));
            var res = [];
            o.first.pop();
            if ((o.fin == 'न') && inc(u.soft(u.palatal()), o.beg)) { // FIXME: any nasal ????
                o.end = 'ञ';
            } else if (inc(u.hard(u.dental()), o.fin) && inc(u.soft(u.palatal()), o.beg)) {
                o.end = 'ज';
            } else if (o.fin != 'स' && o.beg == 'श') { // D.1.2
                o.end = u.dental2palatal(o.fin);
                var sec = o.second[1];
                if (sec == c.virama) sec = o.second[2];
                // D.1.2, but
                // tacCakyam - Cakyam -> so, sec can include a, i.e be any consonant, not only sv !
                // if (inc(c.allvowels, u.vowel(sec)) || inc(c.yam, sec) || sec == 'ह्') {
                if (inc(c.allvowels, u.vowel(sec)) || u.isConsonant(sec) || sec == 'ह्') {
                    // log('=========OPT');
                    var opt = JSON.parse(JSON.stringify(o));
                    opt.second.shift();
                    opt.second.unshift('छ');
                    res.push(opt);
                }
            } else if (o.fin == 'स') { // D.1.3
                o.end = 'श';
            } else {
                // log(111, o.fin, u.dental2palatal(o.fin))
                o.end = u.dental2palatal(o.fin);
            }
            res.push(o);
            // log('R', res);
            return res;
        }
    },

    // 8.4.40 - double-dental
    'double-dental-C-S': {
        type: 'cons',

        del: function(o) {
            var dental = u.palatal2dental(o.fin);
            if (inc(c.class3, dental)) dental = u.class1(dental); // hard from dental-class3
            var first = o.first.slice(0,-1);
            var tail = (dental == 'स') ? c.visarga : [dental, c.virama].join(''); // s -> H
            first = [first, tail].join('');
            var firsts = [first];
            var second = u.wofirst(o.second);
            second = [c.S, second].join('');
            var seconds = [second];
            var res = {firsts: firsts, seconds: seconds};
            return res;
        },
    },

    // dental class consonant followed by a cerebral class consonant changes to the corresponding cerebral
    'dental-cerebral': { // 8.4.41
        del: function(o) {
            var dental = u.cerebral2dental(o.fin);
            if (inc(c.class3, dental)) dental = u.class1(dental); // hard from dental-class3
            // var first = _.clone(o.first);
            var first = o.first.slice(0,-1);
            var tail = (dental == 'स') ? c.visarga : [dental, c.virama].join(''); // s -> H
            first = [first, tail].join('');
            var firsts = [first];
            var seconds = [o.second];
            var res = {firsts: firsts, seconds: seconds};
            return res;
        },

        add: function(o) {
            var res = [];
            o.first.pop();
            if (o.fin == 'न' && inc(u.soft(u.cerebral()), o.beg)) { // FIXME: any nasal? and the same note for split
                o.end = 'ण';
            } else if (o.fin != 'स' && o.beg == 'ष') {
                o.end = u.dental2cerebral(o.fin);
            } else if (o.fin == 'स') {
                o.end = 'ष';
            } else if (inc(u.hard(), o.fin) && inc(u.soft(), o.beg)) {
                o.end = 'ड';
            } else {
                o.end = u.dental2cerebral(o.fin);
            }
            res.push(o);
            return res;
        }
    },

    // double-la
    'double-la': { // 8.4.60
        // double-la дает 2 зубных -> -t, -d - хотя могут обнаружиться T,D?
        del: function(o) {
            var dental = 'न्';
            var first = u.wolast(o.first);
            var hard = u.class1(o.fin);
            var soft = u.class3(o.fin);
            hard = [first, hard, c.virama].join('');
            soft = [first, soft, c.virama].join('');
            var res = {firsts: [hard, soft], seconds: [o.second]};
            return res;
        },

        add: function(o) {
            o.first.pop();
            o.first.push('ल');
            return [o];
        }
    },

    'm-to-candra': { // 8.3.23
        // m-to-candra дает два варианта -nm+la и по одному -m+yava
        del: function(o) {
            // log('M', o.beg, c.yava)
            var first = u.wolast(o.first);
            var first_m = [first, c.m, c.virama].join('');
            if (!inc(c.yava, o.beg)) {
                var first_n = [first, c.n, c.virama].join('');
            }
            var res = {firsts: [first_m], seconds: [o.second]};
            if (first_n) res.firsts.push(first_n);
            // log('R', res);
            return res;
        },

        add: function(o) {
            // log('ADD CANDRA', o);
            o.first.pop();
            o.first.push(c.candra);
            o.first.push(o.beg);
            o.first.push(c.virama); //
            o.vir = false;
            // log('ADD CANDRA', o);
            return [o];
        }
    },

    // sibilant after anusvara, cut after sibilant
    'anusvara-Sar': {
        del: function(o) {
            // log('M', o)
            var first = o.first.slice(0, -2);
            first = [first, 'न', c.virama].join('');
            var firsts = [first];
            var seconds = [o.second];
            var res = {firsts: firsts, seconds: seconds};
            return res;
        },

        add: function(o) {
            o.first.pop();
            var fin = c.cCtTwW[o.beg];
            o.first.push(c.anusvara);
            o.first.push(fin);
            // log(1,o)
            return [o];
        }
    },

    'anusvara-to-m': { // 8.3.23
        del: function(o) {
            // log('M', o);
            var first = [o.first, 'म्'].join('');
            var firsts = [first];
            var seconds = [o.second];
            var res = {firsts: firsts, seconds: seconds};
            return res;
        },

        add: function(o) {
            // log('M', o)
            var res = [];
            return res;
        }
    },

    // -m + p,P,b,B,m - при разрезании всегда образуется только -m
    'm-to-labial': {
        del: function(o) {
            // log('M', o)
            var first = u.wolast(o.first);
            first = [first, 'म्'].join('');
            var res = {firsts: [first], seconds: [o.second]};
            return res;
        },

        add: function(o) {
            var res = [];
            o.first.pop();
            o.first.push(c.m);
            res.push(o);
            return res;
        }
    },

    // -m + t,T,d,D,n - при разрезании всегда образуется только -n
    'm-to-dental': {
        del: function(o) {
            // log('M', o)
            var first = u.wolast(o.first);
            first = [first, c.n, c.virama].join('');
            var res = {firsts: [first], seconds: [o.second]};
            return res;
        },

        add: function(o) {
            var res = [];
            o.first.pop();
            var oM = JSON.parse(JSON.stringify(o));
            o.first.push(c.n);
            oM.first.push(c.M);
            oM.vir = false;
            res.push(o, oM);
            return res;
        }
    },

    'm-to-nasal': {
        del: function(o) {
            // при делении это nasal-to-m, поскольку сутры называются по операции сложения
            // log('M', o)
            var first = u.wolast(o.first);
            first = [first, 'म्'].join('');
            // var first_n = [first, c.n, c.virama].join('');
            var res = {firsts: [first], seconds: [o.second]};
            return res;
        },

        add: function(o) {
            // log('M', o.beg);
            var res = [];
            o.first.pop();
            var ao = JSON.parse(JSON.stringify(o)); // anusvara-o
            ao.vir = false;
            var nasal = u.nasal(o.beg);
            o.first.push(nasal);
            ao.first.push(c.M);
            // म् followed by sb, ह्, र् changes only to anusvara:
            res.push(ao);
            if (!inc(c.sibilants, o.beg) && !inc([c.h, c.ra], o.beg)) res.push(o);

            // if (nasal != c.n) { // -n всегда присутствует - node run kAmAnsarvAnpA pA
            //     var no = JSON.parse(JSON.stringify(o)); // n-o
            //     no.first.pop();
            //     no.first.push(c.n);
            //     res.push(no);
            // }
            // log('ARes:', res)
            return res;
        }
    },

    // ङ्, ण्, न् at the end of a word after a short vowel doubles itself when followed by a vowel
    'doubled-nasals': {
        // type: 'cons',
        // only: 'ext',
        del: function(o) {
            if (u.isVowel(o.mark)) {
                var first = o.first.slice(0,-1);
                var second = [u.vowel(o.mark), o.second].join('');
            } else {
                var first = o.first.slice(0, -1);
                var second = [c.a, o.second].join('');
            }
            var firsts = [first];
            var seconds = [second];
            var res = {firsts: firsts, seconds: seconds};
            // log('R', res)
            return res;
        },

        add: function(o) {
            o.first.push(c.virama);
            o.first.push(o.fin);
            return [o];
        }
    },

    // hard consonant followed by a vow or soft consonant but nasal -> to 3d-class
    'hard-to-soft': { // 8.2.39
        // type: 'cons',
        // only: 'ext',

        // just-cut two cons or cut-before-vowel.
        del: function(o) {
            // log('M', o)
            var fin = o.fin;
            var hard_fin = u.class1(fin);
            var second;
            var first = u.wolast(o.first);
            first = [first, hard_fin, c.virama].join('');
            if (u.isVowel(o.mark)) {
                second = [u.vowel(o.mark), o.second].join('');
            } else {
                second = o.second;
            }
            var res = {firsts: [first], seconds: [second]};
            // log('R', res);
            return res;
        },

        add: function(o) {
            o.first.pop();
            // log(1, o.fin)
            var soft = JSON.parse(JSON.stringify(o));
            var soft_fin = u.class3(soft.fin);
            soft.first.push(soft_fin);
            return [soft]; // o ? тут всегда мягкая, правильно? Это при делении м.б. варианты?
        }
    },

    'anusvara-oM': {
        del: function(o) {
            var first = o.first.slice(0,-2);
            first = [first, c.virama].join('');
            var res = {firsts: [first], seconds: [o.second]};
            return res;
        },

        add: function(o) {
            var res = [];
            return res;
        }
    },

    'h-to-4class': {
        type: 'cons',
        del: function(o) {
            var hard_fin = u.class1(o.fin);
            var hard = u.wolast(o.first);
            hard = [hard, hard_fin, c.virama].join('');
            var soft = [o.first, c.virama].join('');

            var second;
            if (o.fin == 'द' && o.beg == 'ध') {
                second = u.wofirst(o.second);
                second = [c.h, second].join('');
            }
            var res = {firsts: [soft, hard], seconds: [o.second, second]};
            // log('R', res);
            return res;
        },

        add: function(o) {
            var res = [];
            // log('ADD', o)
            // var hDG = JSON.parse(JSON.stringify(o));
            o.first.pop();
            var soft_fin = u.class3(o.fin);
            var soft_beg = u.class4(o.fin);
            // log(1111, o.fin, soft_beg)
            o.first.push(soft_fin);
            o.second.shift();
            o.second.unshift(soft_beg);

            // log('S', o)
            // धर्म्याद्धि - re
            // धर्म्याद्धि
            return [o];
        }
    },

    '': {
        type: 'cons',
        only: 'ext',
        del: function(o) {
            var firsts = [o.first];
            var seconds = [o.second];
            var res = {firsts: firsts, seconds: seconds};
            return res;
        },

        add: function(o) {
            return [o];
        }
    },

}

module.exports = sutras;
