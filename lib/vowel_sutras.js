var u = require('./utils');
var Const = require('./const');
var c = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

var sutras = {

    // simple vowel, followed by a similar vowel => dirgha
    'dirgha': { // 6.1.101
        type: 'vowel',
        del: function(mark) {
            // log(1, mark)
            var ends = [mark.mark, u.liga(u.hrasva(mark.mark))];
            var starts = [u.vowel(mark.mark), u.hrasva(mark.mark)];
            // if (mark.mark == 'ॄ' && mark.beg == 'ऌ') {
            //     var ends = ['ृ'];
            //     var starts = ['ऌ'];
            // }
            var res = u.combine(mark.first, mark.second, ends, starts);
            // log('O', res)
            return res;
        },

        add: function(mark) {
            mark.second.shift();
            if (mark.fin == '' && u.c(Const.aA, mark.beg)) {
                mark.first.push(Const.A);
            } else if (u.similar(mark.fin, mark.beg)) { // FIXME: как-то удобно прописать случай r+l как similar ->  g=6.1.101.+_15_, пока ошибка
                mark.first.pop();
                mark.first.push(u.dliga(mark.fin));
            }
            return [mark];
        }
    },

    // a or ā is followed by simple ->  guna
    'guna': { // 6.1.87
        type: 'vowel',
        del: function(mark) {
            var ends = shiva(Const.aA).liga().end();
            var starts;
            var first = mark.first;
            if (u.vowel(mark.mark) == 'ए') {
                starts = Const.iI;
            } else if (u.vowel(mark.mark) == 'ओ') {
                starts = Const.uU;
            } else if (mark.mark == 'र') {
                // first = first.slice(0, -1);
                starts = Const.fF;
            } else if (mark.mark == 'ल') {
                // first = first.slice(0, -1);
                starts = [Const.L];
            }
            // log('M', first, mark.second, ends, starts, 222, mark.mark)
            return u.combine(first, mark.second, ends, starts);
        },

        add: function(mark) {
            mark.second.shift();
            if (Const.A == mark.fin) mark.first.pop();
            if (u.c(Const.iI, mark.beg)) {
                mark.second.unshift(u.liga('ए'));
            } else if (u.c(Const.uU, mark.beg)) {
                mark.second.unshift(u.liga('ओ'));
            } else if (u.c(Const.fF, mark.beg)) {
                mark.second.unshift('र्');
            } else if (mark.beg == Const.L) {
                mark.second.unshift('ल्');
            }
            return [mark];
        }
    },

    // a or ā is followed by e, o, ai or au - vriddhi
    'vriddhi': { // 6.1.88
        type: 'vowel',
        only: 'ext',

        del: function(mark) {
            var ends = shiva(Const.aA).liga().end();
            var starts;
            if (u.vowel(mark.mark) == 'ऐ') {
                starts = ['ए', 'ऐ'];
            } else if (u.vowel(mark.mark) == 'औ') {
                starts = ['ओ', 'औ'];
            }
            var res = u.combine(mark.first, mark.second, ends, starts);
            // res.delta = {};
            // res.delta[mark.pos] = true;
            return res;
        },

        add: function(mark) {
            var res = [];
            if (!u.c(Const.aAliga, mark.fin) || !u.c(Const.diphtongs, mark.beg)) return;
            mark.second.shift();
            if (Const.A == mark.fin) mark.first.pop();
            if (mark.beg == 'ए') {
                mark.second.unshift(u.liga('ऐ'));
            } else if (mark.beg == 'ओ') {
                mark.second.unshift(u.liga('औ'));
            } else if (mark.beg == 'ऐ') {
                mark.second.unshift(u.liga('ऐ'));
            } else if (mark.beg == 'औ') {
                mark.second.unshift(u.liga('औ'));
            }
            res.push(mark);
            return res;
        }
    },

    // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel
    'dissimilar': { // 6.1.77
        type: 'vowel',
        only: 'ext',

        del: function(mark) {
            // log(1, mark.mark)
            if (mark.stype == 'vowel-cons' && mark.penult == Const.virama) {
                // log('PENULT')
                var first = mark.first.slice(0, -2);
                var ends = [u.liga(u.base(mark.mark)), u.dliga(u.base(mark.mark))];
                var starts = [Const.a];
            } else  {
                var first = mark.first.slice(0, -2);
                var ends = [u.liga(u.base(mark.fin)), u.dliga(u.base(mark.fin))];
                var starts = [u.vowel(mark.mark)];
                // log('STARTS', u.liga(u.base(mark.fin)), u.dliga(u.base(mark.fin)))
            }
            var res = u.combine(first, mark.second, ends, starts);
            // log('R', res) // प्रहॢ
            return res;
        },

        add: function(mark) {
            // beg can be diphtong
            var res = [];
            mark.first.pop();
            mark.second.shift();
            if (u.c(Const.iI, u.vowel(mark.fin))) {
                mark.first.push('्य');
                mark.second.unshift(u.liga(mark.beg));
            } else if (u.c(Const.uU, u.vowel(mark.fin))) {
                mark.first.push('्व');
                mark.second.unshift(u.liga(mark.beg));
            } else if (u.c(Const.fF, u.vowel(mark.fin))) {
                mark.first.push('्र');
                mark.second.unshift(u.liga(mark.beg));
            } else if (mark.fin == u.liga(Const.L)) {
                // FIXME: mark - make mark g=6.1.77.+_31_ - first is only one sym L, so w/o virama - but what about other vowels and prev cases?
                mark.first.push('ल');
                mark.second.unshift(u.liga(mark.beg));
            }
            res.push(mark);
            return res;
        }
    },

    // diphthong followed by any vowel, including itself, changes to its semi-vowel equivalent
    // ayadi-sandhi
    // 'diphthong-to-semivowel': { // 6.1.78
    'ayadi': { // 6.1.78
        type: 'vowel',
        del: function(mark) {
            // log(1, mark.first); //
            var first = mark.first;
            var second = mark.second;
            var beg = u.first(second);
            if (mark.avagraha) {
                // second = [c.a, second].join('');
            } else if (u.isVowel(mark.mark)) {
                if (mark.penult == c.A) {
                    // log('=========================== PENULT', u.vowel(mark.mark));
                    first = u.wolast2(mark.first);
                    if (mark.fin == 'य') {
                        first = [first, u.liga('ऐ')].join('');
                    } else if (mark.fin == 'व') {
                        first = [first, u.liga('औ')].join('');
                    }
                } else {
                    first = u.wolast(mark.first);
                    if (mark.fin == 'य') {
                        first = [first, u.liga('ए')].join('');
                    } else if (mark.fin == 'व') {
                        first = [first, u.liga('ओ')].join('');
                    }
                }
                // log('=========================== VOWEL', u.vowel(mark.mark));
                second = [u.vowel(mark.mark), second].join('');
            } else if (u.isConsonant(mark.mark)) {
                // log(1, mark);
                if (mark.penult == c.A) {
                    // log('=========================== PENULT', u.vowel(mark.mark));
                    first = u.wolast2(mark.first);
                    if (mark.fin == 'य') {
                        first = [first, u.liga('ऐ')].join('');
                    } else if (mark.fin == 'व') {
                        first = [first, u.liga('औ')].join('');
                    }
                }
                second = [c.a, second].join('');
            }
            var res = {firsts: [first], seconds: [second]};
            // log('RD', res)
            return res;
        },

        add: function(mark) {
            // FIXME: переписать, иначе получаются варианты   'अ इष्टो', 'अविष्टो'
            var res = [];
            var opt = JSON.parse(JSON.stringify(mark));
            opt.first.pop();
            mark.first.pop();
            mark.second.shift();
            mark.second.unshift(u.liga(mark.beg));
            if (u.vowel(mark.fin) == 'ए') {
                //  (unchanged) & (avagraha)
                mark.first.push('य');
                opt.first.push(' ');
            } else if (u.vowel(mark.fin) == 'ओ') {
                mark.first.push('व');
                opt.first.push(' ');
            } else if (u.vowel(mark.fin) == 'ऐ') {
                mark.first.push('ाय');
                opt.first.push('ा ');
            } else if (u.vowel(mark.fin) == 'औ') {
                mark.first.push('ाव');
                opt.first.push('ा ');
            } else if (mark.fin == u.liga(Const.L)) {
                // FIXME: mark - make mark g=6.1.77.+_31_ - first is only one sym L, so w/o virama - but what about other vowels and prev cases?
                mark.first.push('ल');
                mark.second.unshift(u.liga(mark.beg));
            }
            // res.push(opt);
            res.push(mark);
            // log('R', res)
            return res;
        }
    },

    // "e" and "o" at the end of a word, when followed by "a" gives avagraha // 6.1.109
    'e-o-avagraha': {
        type: 'vowel',
        only: 'ext',

        // DEL - in visarga-avagraha
        // del: function(mark) {
        //     var first = mark.first.slice(0,-1);
        //     var e = mark.first.slice(-1);
        //     var b = 'अ';
        //     var ends = [e];
        //     var starts = [b];
        //     return u.combine(first, mark.second, ends, starts);
        // },

        add: function(mark) {
            var res = [];
            mark.second.shift();
            mark.second.unshift(Const.avagraha);
            res.push(mark);
            return res;
        }
    },

    '': {
        type: 'vowel',
        only: 'ext',

        del: function(mark) {
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
