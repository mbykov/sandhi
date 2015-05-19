var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

var sutras = {

    /*
      class consonant followed by (nasal) optionally changes to the nasal of class, or less commonly for class hard consonants, changes to 3rd consonant of class
      same: (class consonant become the nasal sound from their varga when followed by n or m OR after class hard consonant changes to 3rd consonant of class),
      FIXME: тут любые согласные, или unaspirated? На аспир. нет примера
      reverse: 'nasal OR 3rd, when followed by n or m become the four final stops (k t ṭ p), OR voiced',
    */
    '8.4.45': {
        type: 'cons',
        only: 'ext',
        split: function(mark) {
            // log(1, mark, u.nasal(mark.fin))
            var hard = u.class1(mark.fin);
            if (!hard) return;
            var soft = Const.unvoiced2voiced[hard];
            var hvalue = [hard, Const.virama, ' ', mark.beg].join('');
            var svalue = [soft, Const.virama, ' ', mark.beg].join('');
            return [hvalue, svalue];
        },

        add: function(mark) {
            var res = [];
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
