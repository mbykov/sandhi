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
            if (mark.pattern == 'ॄ') sandhis.push('ृ ऌ'); // FIXME: нужно перебрать все случаи f+x?
            return sandhis;
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
            // log(87, mark, 'guna', u.guna(mark.pattern), 'vowel', u.vowel(mark.pattern));
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
