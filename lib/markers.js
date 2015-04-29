var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;

var sutras = [
    // {num: '',
     {num: '8.4.55',
     descr: 'soft consonant except nasal, followed by a hard consonant changes to 1st consonant of class',
     // во-первых, комб. ни разу не встретились. Во-вторых, встретились глухой-глухой, которых тут нет. Не проверил придыхания
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
     marks: [
         // (k t ṭ p)
         // ङ - ण - न - म
         {'ङन': 'कन', 'णन': 'टन', 'नन': 'नत', 'मन': 'पन'},
         {'ङम': 'कम', 'णम': 'टम', 'नम': 'तम', 'मम': 'पम'},
         // either 3-d - ग - ड - द - ब
         {'गन': 'कन', 'डन': 'टन', 'दन': 'नत', 'बन': 'पन'},
         {'गम': 'कम', 'डम': 'टम', 'दम': 'तम', 'बम': 'पम'},
     ],
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
