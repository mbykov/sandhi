var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;

var sutras = [
    // {num: '',
    {num: '8.4.55',
     descr: 'soft consonant except nasal, followed by a hard consonant changes to 1st consonant of class',
     // во-первых, комб. ни разу не встретились. Во-вторых, встретились глухой-глухой, которых тут нет. Не проверил придыхания
     type: 'cons',
     marks: {
         'कक': 'गक', 'चक': 'जक', 'टक': 'डक', 'तक': 'दक', 'पक': 'बक',
         'कच': 'गच', 'चच': 'जच', 'टच': 'डच', 'तच': 'दच', 'पच': 'बच',
         'कट': 'गट', 'चट': 'जट', 'टट': 'डट', 'तट': 'दट', 'पट': 'बट',
         'कत': 'गत', 'चत': 'जत', 'टत': 'डत', 'तत': 'दत', 'पत': 'बत',
         'कप': 'गप', 'चप': 'जप', 'टप': 'डप', 'तप': 'दप', 'पप': 'बप',

         'कख': 'गख', 'चख': 'जख', 'टख': 'डख', 'तख': 'दख', 'पख': 'बख',
         'कछ': 'गछ', 'चछ': 'जछ', 'टछ': 'डछ', 'तछ': 'दछ', 'पछ': 'बछ',
         'कट': 'गट', 'चट': 'जट', 'टट': 'डट', 'तट': 'दट', 'पट': 'बट',
         'कथ': 'गथ', 'चथ': 'जथ', 'टथ': 'डथ', 'तथ': 'दथ', 'पथ': 'बथ',
         'कफ': 'गफ', 'चफ': 'जफ', 'टफ': 'डफ', 'तफ': 'दफ', 'पफ': 'बफ'},
     method: function(samasa) {
         var marks = this.marks;
         // log('METH', samasa, this.num, JSON.stringify(this.marks));
         var mark, split, join, sandhi, nosandhi;
         var res = [];
         Object.keys(this.marks).forEach(function(raw) {
             mark = [raw.split('')[0], Const.virama, raw.split('')[1]].join('');
             var split = samasa.split(mark);
             if (split.length < 2) return;
             // log('MARKS', samasa, mark, this.num, JSON.stringify(marks));
             join = [Const.virama, ' '].join('');
             sandhi = marks[raw].split('').join(join);
             // log('RAW', raw);
             nosandhi = raw.split('').join(join);
             // log('SA', sandhi);
             res.push(split.join(nosandhi));
             res.push(split.join(sandhi));
         })
         return res;
     }
    },
    {num: '8.4.45',
     descr: 'The four final stops (k t ṭ p) become the nasal sound from their varga when followed by n or m',
     // descr: ' (class consonant) followed by (nasal) optionally changes to the (nasal of class)',
     // marks: {
     //     // (k t ṭ p) - ङ - ण - न - म
     //     'ङन': 'कन', 'णन': 'टन', 'नन': 'नत', 'मन': 'पन',
     //     'ङम': 'कम', 'णम': 'टम', 'नम': 'तम', 'मम': 'पम',
     //     // either 3-d - ग - ड - द - ब
     //     // TODO: непонятно, что происходит со звонкими - нужны тесты
     //     'गन': 'कन', 'डन': 'टन', 'दन': 'नत', 'बन': 'पन',
     //     'गम': 'कम', 'डम': 'टम', 'दम': 'तम', 'बम': 'पम'},
     samasa: Const.nasal_nm,
     vigraha: Const.finalhard_nm,
     split: function(mark) {
         var hard = u.class1(mark.fin);
         if (!hard) return;
         var soft = Const.unvoiced2voiced[hard];
         // log('M', mark.fin, hard, soft);
         var hvalue = [hard, Const.virama, ' ', mark.beg].join('');
         var svalue = [soft, Const.virama, ' ', mark.beg].join('');
         return [hvalue, svalue];
     },
     split_: function(v) {
         // log('===== THIS SAMASA', this.samasa);
         // log('===== THIS VIGRAHA', this.vigraha);
         // log('===== this.samasa.indexOf(v)', this.samasa.indexOf(v));
         // FIXME: сортировка не работает. Нужно сортировать, или устанавливать соответствие, вручную. u.savarna?
         log('V', v);
         var idx = this.samasa.indexOf(v);
         if (idx < 0) return;
         var n = this.samasa.indexOf(v) + 4;
         if (n > 7) n-=8;
         // TODO: u.savarna(v)
         var value = this.vigraha[n];
         // var cons = value.split('')[0];
         // var nasal = value.split('')[1];
         // var softvalue = [Const.unvoiced2voiced[cons], nasal].join('');
         var softvalue = u.voicing(value);
         return [value, softvalue];
     },
     // method: function(value) {
     //     var cons = value.split('')[0];
     //     var nasal = value.split('')[1];
     //     var newvalue = [Const.unvoiced2voiced[cons], nasal].join('');
     //     return [value, newvalue];
     // }
    },
    {num: '',
     descr: '',
     marks: [{'': '', '': '', '': '', '': '', '': '', '': '', '': '', '': '', '': '', }],
     method: function() {}
    },
    {num: '',
     descr: '',
     marks: [{'': '', '': '', '': '', '': '', '': '', '': '', '': '', '': '', '': '', }],
     method: function() {}
    },
    {num: '',
     descr: '',
     marks: [{'': '', '': '', '': '', '': '', '': '', '': '', '': '', '': '', '': '', }],
     method: function() {}
    },
];


module.exports = sutras;
