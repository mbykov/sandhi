var _ = require('underscore');
var u = require('./utils');
// var Const = require('./const');
var c = require('./const');
var log = u.log;
var d = u.debug;

var sutras = {

    // (visarga) changes to (श्) (p sb) when followed by (च् or छ्) (p hc)
    //  (visarga) changes to (ष्) (c sb) when followed by (ट् or ठ्) (c hc).
    // (visarga) changes to (स्) (d sb) when followed by (त् or थ्) (d hc)
    'visarga-sibilant': {
        del: function(mark) {
            // log('M', mark)
            var first = u.wolast(mark.first);
            first = [first, c.visarga].join('');
            return {firsts: [first], seconds: [mark.second]};
        },

        add: function(mark) {
            var opt = JSON.parse(JSON.stringify(mark));
            opt.first.push(c.H);
            if (u.c(c.cC, mark.beg)) {
                mark.first.push('श्');
            } else if (u.c(c.wW, mark.beg)) {
                mark.first.push('ष्');
            } else if (u.c(c.tT, mark.beg)) {
                mark.first.push('स्');
            } else if (mark.beg == 'श') {
                mark.first.push('श्');
            } else if (mark.beg == 'ष') {
                mark.first.push('ष्');
            } else if (mark.beg == 'स') {
                mark.first.push('स्');
            }
            var res = [mark, opt];
            // log('R===', res)
            return res;
        }
    },

    //  visarga after any vowel except अ or आ changes to र् when followed by a vowel or soft consonant except र्
    // अ & visarga (standing for अर्) changes to अर् when followed by a vowel or soft consonant except र्
    'visarga-r': {
        del: function(mark) {
            // log('M', mark)
            var first = (mark.stype == 'cons') ? u.wolast(mark.first) : mark.first;
            var second = mark.second;
            if (mark.stype == 'vow-ra') {
                // log('================================= del  VOW-RA', mark.first)
                // visarga before any vowel -> to -ra
                first = u.wolast(mark.first);
                second = [c.a, second].join('');
            } else if (mark.stype == 'vowel') {
                first = u.wolast(mark.first);
                if (u.isVowel(mark.mark)) second = [u.vowel(mark.mark), second].join('');
            } else if (mark.stype == 'cons') {
                // log('RARA', c.ra, u.vowel(mark.mark));
                if (mark.mark == c.ra) second = [u.vowel(mark.mark), second].join('');
            } else if (mark.stype == 'visarga') {
                // log('M', mark.first)
                // sic!
            }
            first = [first, c.visarga].join('');
            // log('M', first)
            var res =  {firsts: [first], seconds: [second]};
            // log('R', res)
            // return ;
            return res;
        },

        add: function(mark) {
            var json = JSON.stringify(mark);
            var mark_o = JSON.parse(json); // второй вариант неотличимый - visarga-o, standing for अस्
            mark = JSON.parse(json);
            // log('M', mark_o)
            // mark - standing for अर्:
            mark.first.push('र');
            if (mark.beg == c.a) {
                // log('HERE')
                mark.second.shift();
            } else if (u.isVowel(mark.beg)) {
                mark.second.shift();
                mark.second.unshift(u.liga(mark.beg));
            } else {
                mark.vir = true;
            }
            // log('M', mark_o)
            if (!u.isConsonant(mark_o.fin)) return [mark];
            // mark-o standing for अस्:
            mark_o.first.push(c.o);
            var beg = u.first(mark_o.second);
            if (beg == c.a) {
                mark_o.second.shift();
                mark_o.second.unshift(c.avagraha);
            }
            // log('M', mark_o)
            mark_o.num = 'visarga-o';
            return [mark, mark_o]; //
        }
    },

    // अ & visarga (standing for अस्) followed by a soft consonant -> changes to ओ
    // ordinary this case is outer-sandhi
    'visarga-o': {
        // type: 'visarga',
        // only: 'ext',
        del: function(mark) {
            // log('M', mark)
            // var first = mark.first.slice(0, -1);
            var first = [mark.first, c.visarga].join('');
            return {firsts: [first], seconds: [mark.second]};
        },

        // не может быть, потому что неотличимо от visarga-r, i.e. visarga + soft or vowel
        // add: function(mark) {
        //     var json = JSON.stringify(mark);
        //     mark = JSON.parse(json);
        //     // log('M-O', mark)
        //     // mark.first.pop();
        //     // var ro = [c.ra, c.o].join('');
        //     // mark.first.push(c.ra);
        //     mark.first.push(c.o);
        //     mark.second.shift();
        //     log('M-O', mark)
        //     // mark.space = true; // only for browser virsion
        //     return [mark];
        // }
    },

    // अ & visarga changes to ओ+avagraha when followed by अ
    // also ayadi-sandhi, e-o remains unchanged when followed by a, but अ changes to avagraha
    'visarga-avagraha': {
        type: 'visarga',
        only: 'ext',

        del: function(mark) {
            var first = mark.first; // e-or-o at the end, ayadi-part
            var fin = u.last(first);
            var first_ = u.wolast(mark.first);
            var first_vis = [first_, c.visarga].join('');
            var second = [c.a, mark.second].join('');
            var res = {firsts: [], seconds: [second]};
            if (fin == c.e) res.firsts = [first];
            else if (fin == c.o) res.firsts = [first, first_vis];
            else {
                log('NOT vusarga-AYADI-e-o !!');
                throw new Error('NOT vusarga-AYADI-e-o !!');
            }
            // log('M', res);
            return res;
        },

        // ayadi - часть в vowel-сутрах,
        add: function(mark) {
            // log('M', mark)
            mark.first.push(u.liga('ओ'));
            mark.second.shift();
            mark.second.unshift(c.avagraha);
            return [mark];
        }
    },

    // अ & visarga (standing for अस्) followed by a vowel except अ -> visarga is dropped
    // 'visarga-ah-other': {
    //     type: 'visarga',
    //     only: 'ext',
    //     // del: function(mark) {
    //     // },

    //     add: function(mark) {
    //         mark.first.pop();
    //         mark.space = true;
    //         return [mark];
    //     }
    // },

    // आ & visarga  (for आस्) is followed by a vowel or soft consonant - > dropped.
    // 'visarga-aah-vow': {
    //     type: 'visarga',
    //     only: 'ext',
    //     // del: function(mark) {
    //     // },

    //     add: function(mark) {
    //         mark.first.pop();
    //         mark.space = true;
    //         return [mark];
    //     }
    // },


    '': {
        type: 'visarga',
        only: 'ext',
        del: function(mark) {
        },

        add: function(mark) {
            var res = [];
            return res;
        }
    },

}

module.exports = sutras;
