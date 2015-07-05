var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

var sutras = {

    // अ & visarga changes to ओ+avagraha when followed by अ
    'visarga-ah-a': {
        type: 'visarga',
        only: 'ext',
        split: function(mark) {
            var res = 'ः अ';
            return [res];
        },

        add: function(mark) {
            // log('VIS =================', mark);
            mark.first.push(u.liga('ओ'));
            mark.second.shift();
            mark.second.unshift(Const.avagraha);
            return [mark];
        }
    },

    // अ & visarga (standing for अस्) followed by a soft consonant -> changes to ओ
    'visarga-ah-soft': {
        type: 'visarga',
        only: 'ext',
        split: function(mark) {
            var res = 'ः ';
            return [res];
        },

        add: function(mark) {
            mark.first.pop();
            mark.first.push(u.liga('ओ'));
            // mark.space = true;
            return [mark];
        }
    },

    // अ & visarga (standing for अस्) followed by a vowel except अ -> visarga is dropped
    'visarga-ah-other': {
        type: 'visarga',
        only: 'ext',
        // split: function(mark) {
        //     // var res = [];
        //     // return res;
        // },

        add: function(mark) {
            mark.first.pop();
            mark.space = true;
            return [mark];
        }
    },

    // (visarga) changes to (श्) (p sb) when followed by (च् or छ्) (p hc)
    'visarga-hard-cons': {
        type: 'visarga',
        only: 'ext',
        split: function(mark) {
            var res = 'ः ';
            return [res];
        },

        add: function(mark) {
            mark.first.pop();
            mark.first.push(mark.result);
            return [mark];
        }
    },

    // आ & visarga  (for आस्) is followed by a vowel or soft consonant - > dropped.
    'visarga-aah-vow': {
        type: 'visarga',
        only: 'ext',
        split: function(mark) {
            var res = [];
            return res;
        },

        add: function(mark) {
            mark.first.pop();
            mark.space = true;
            return [mark];
        }
    },



    // continue

    //  visarga after any vowel except अ or आ changes to र् when followed by a vowel or soft consonant except र्
    'visarga-r': {
        type: 'visarga',
        only: 'ext',
        split: function(mark) {
            if (u.c(Const.allligas, mark.beg)) {
                beg = u.vowel(mark.beg);
                var res = [Const.visarga, beg].join(' ');
            } else if (mark.pattern == 'र्') {
                // beg = mark.beg;
                var res = [Const.visarga, ''].join(' ');
            } else if (mark.pattern == 'र') {
                beg = 'अ';
                var res = [Const.visarga, beg].join(' ');
            }
            // log('RES', res, mark)
            return [res];
        },

        add: function(mark) {
            var res = [];
            return res;
        }
    },

    // visarga after simple vowels changes to र् when followed by a vowel or soft consonant except र्
    '4.1.3_': {
        type: 'visarga',
        only: 'ext',
        split: function(mark) {
            var res, beg;
            if (u.c(Const.allligas, mark.beg)) {
                beg = u.vowel(mark.beg);
            } else if (mark.pattern == 'र') {
                beg = 'अ';
            }
            var res = [Const.visarga, beg].join(' ');
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
