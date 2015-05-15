var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

var sutras = {

    // अ & visarga changes to ओ+avagraha when followed by अ
    '4.1.2': {
        type: 'visarga',
        only: 'ext',
        split: function(mark) {
            var res = 'ः अ';
            return [res];
        },

        add: function(mark) {
            mark.first.pop();
            mark.first.push(u.liga('ओ'));
            mark.second.shift();
            mark.second.unshift(Const.avagraha);
            return [mark];
        }
    },

    // visarga after simple changes to र् when followed by a vowel or soft consonant except र्
    '4.1.3': {
        type: 'visarga',
        only: 'ext',
        split: function(mark) {
            var res, beg;
            if (u.c(Const.allligas, mark.beg)) {
                beg = u.vowel(mark.beg);
            } else if (mark.pattern == 'र') {
                beg = 'अ';
            }
            res = [Const.visarga, beg].join(' ');
            return [res];
        },

        add: function(mark) {
            mark.first.pop();
            if (u.c(Const.allvowels, mark.beg)) {
                mark.first.push('र');
                mark.second.shift();
                mark.second.unshift(u.liga(mark.beg));
            } else {
                mark.first.push('र्');
            }
            return [mark];
        }
    },

    //
    '': {
        type: 'visarga',
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
