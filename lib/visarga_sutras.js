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
            // log('V======');
            if (mark.pattern != 'ोऽ') return;
            var res = 'ः अ';
            mark.sandhi = [res];
            // return [res];
        },

        add: function(test) {
            if (test.fin != Const.visarga || test.beg !='अ') return;
            var res = [];
            test.first.pop();
            test.first.push(u.liga('ओ'));
            test.second.shift();
            test.second.unshift(Const.avagraha);
            res.push(test);
            return res;
        }
    },

    //
    'x': {
    },

}

module.exports = sutras;
