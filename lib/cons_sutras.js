var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

var sutras = {

    /*
      class consonant become the nasal sound from their varga when followed by n or m OR after class hard consonant changes to 3rd consonant of class,
      class consonant followed by (nasal) optionally changes to the nasal of class,
      FIXME: тут любые согласные, или unaspirated? На аспир. нет примера
      reverse: 'nasal OR 3rd, when followed by n or m become the four final stops (k t ṭ p), OR voiced',
    */
    '8.4.45': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            var res = [];
            return res;
        },

        add: function(mark) {
            var res = [];         // TODO: случай, когда mark.end массив? Или в Opt попадает?
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
