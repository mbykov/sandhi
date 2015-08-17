var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

var sutras = {

    // simple vowel, followed by a similar vowel => dirgha
    '6.1.101': {
        type: 'vowel',
        only: 'ext',
        split: function(mark) {
            var ends = [mark.pattern, u.liga(u.hrasva(mark.pattern))];
            var starts = [u.dirgha(mark.pattern), u.hrasva(mark.pattern)];
            var sandhis = u.fourBySpace(ends, starts);
            if (mark.pattern == Const.A) sandhis.push('ा '); // xxA-yy
            if (u.c(Const.dirgha_ligas, mark.pattern)) {
                var term = [mark.pattern, ' '].join('');
                sandhis.push(term); // xxV-yy
            }
            if (mark.pattern == 'ॄ') sandhis.push('ृ ऌ'); // FIXME: нужно перебрать все случаи f+x?
            return sandhis;
        },

        del: function(mark) {
            var ends = [mark.pattern, u.liga(u.hrasva(mark.pattern))];
            var starts = [u.vowel(mark.pattern), u.hrasva(mark.pattern)];
            if (mark.pattern == 'ॄ' && mark.beg == 'ऌ') {
                var ends = ['ृ'];
                var starts = ['ऌ'];
            }
            var res = u.combine(mark.first, mark.second, ends, starts);
            res.delta = {};
            res.delta[mark.pos] = true;
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
    '6.1.87': {
        type: 'vowel',
        only: 'ext',
        split: function(mark) {
            var ends = shiva(Const.aA).liga().end();
            var starts;
            if (u.vowel(mark.pattern) == 'ए') {
                starts = Const.iI;
            } else if (u.vowel(mark.pattern) == 'ओ') {
                starts = Const.uU;
            } else if (mark.pattern == 'र्') {
                starts = Const.fF;
            } else if (mark.pattern == 'ल्') {
                starts = [Const.L];
            }
            return u.fourBySpace(ends, starts);
        },

        del: function(mark) {
            var ends = shiva(Const.aA).liga().end();
            var starts;
            var first = mark.first;
            if (u.vowel(mark.pattern) == 'ए') {
                starts = Const.iI;
            } else if (u.vowel(mark.pattern) == 'ओ') {
                starts = Const.uU;
            } else if (mark.fin == 'र') {
                first = first.slice(0, -1);
                starts = Const.fF;
            } else if (mark.fin == 'ल') {
                first = first.slice(0, -1);
                starts = [Const.L];
            }
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
    '6.1.88': {
        type: 'vowel',
        only: 'ext',
        split: function(mark) {
            var ends = shiva(Const.aA).liga().end();
            var starts;
            if (u.vowel(mark.pattern) == 'ऐ') {
                starts = ['ए', 'ऐ'];
            } else if (u.vowel(mark.pattern) == 'औ') {
                starts = ['ओ', 'औ'];
            }
            return u.fourBySpace(ends, starts);
        },

        del: function(mark) {
            var ends = shiva(Const.aA).liga().end();
            var starts;
            if (u.vowel(mark.pattern) == 'ऐ') {
                starts = ['ए', 'ऐ'];
            } else if (u.vowel(mark.pattern) == 'औ') {
                starts = ['ओ', 'औ'];
            }
            var res = u.combine(mark.first, mark.second, ends, starts);
            res.delta = {};
            res.delta[mark.pos] = true;
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
    '6.1.77': {
        type: 'vowel',
        only: 'ext',
        split: function(mark) {
            var fin = mark.pattern[1];
            var beg = mark.beg;
            var ends = [u.liga(u.base(fin)), u.dliga(u.base(fin))];
            var starts;
            if (u.c(Const.allligas, beg)) {
                starts = [u.base(beg), u.dirgha(u.base(beg))];
            } else {
                starts = ['अ'];
            }
            return u.fourBySpace(ends, starts);
        },

        del: function(mark) {
            var ends;
            // var first = mark.first.slice(0,-1);
            var first = mark.first;
            if (mark.beg == 'अ') {
                first = mark.first.slice(0,-1);
                ends = [u.liga(u.base(mark.pattern)), u.dliga(u.base(mark.pattern))];
            } else {
                ends = [u.liga(u.base(mark.pattern)), u.dliga(u.base(mark.pattern))];
            }
            var starts = [mark.beg, u.dirgha(mark.beg)];
            // return u.combine(first, mark.second, ends, starts);
            var res = u.combine(first, mark.second, ends, starts);
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

    // diphthong followed by any vowel, including itself, changes to its semi-vowel equivalent - opt
    '6.1.78': {
        type: 'vowel',
        only: 'ext',
        split: function(mark) {
            var fin, beg, starts, ends;
            if (mark.beg) { // diphtong-vriddhi
                fin = mark.pattern[1];
                beg = mark.beg;
                if (u.c(Const.allligas, beg)) {
                    starts = [u.base(beg), u.dirgha(u.base(beg))];
                } else {
                    starts = ['अ'];
                }
                ends = [u.liga(u.vriddhi(u.base(fin)))];
            } else { // diphtong-guna
                fin = mark.pattern[0];
                beg = mark.pattern[1];
                ends = [u.liga(u.guna(u.base(fin)))];
                starts = [u.base(beg), u.dirgha(u.base(beg))];
            }
            return u.fourBySpace(ends, starts);
        },

        del: function(mark) {
            var first = mark.first.slice(0,-1);
            if (mark.pen == Const.A) first = first.slice(0,-1);
            var pattern = (u.c(Const.yaR, mark.fin)) ? u.base(mark.fin) : u.base(mark.pen);
            var ends = [u.gliga(pattern), u.vliga(pattern)];
            var starts = [mark.beg, u.dirgha(mark.beg)];
            return u.combine(first, mark.second, ends, starts);
        },

        add: function(mark) {
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
            res.push(opt);
            res.push(mark);
            return res;
        }
    },

    // "e" and "o" at the end of a word, when followed by "a" gives avagraha
    '6.1.109': {
        type: 'vowel',
        only: 'ext',
        split: function(mark) {
            var res = ' अ';
            return [res];
        },

        del: function(mark) {
            var first = mark.first.slice(0,-1);
            var e = mark.first.slice(-1);
            var b = 'अ';
            var ends = [e];
            var starts = [b];
            return u.combine(first, mark.second, ends, starts);
        },

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
