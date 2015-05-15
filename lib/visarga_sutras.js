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
            var res = [];
            mark.first.pop();
            mark.first.push(u.liga('ओ'));
            mark.second.shift();
            mark.second.unshift(Const.avagraha);
            res.push(mark);
            return res;
        }
    },

    //
    'x': {
    },

}

module.exports = sutras;
