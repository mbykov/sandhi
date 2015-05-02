var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;

var sutras = [
    {num: '',
    // {num: '8.4.55',
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
    /*
      descr: 'class consonant become the nasal sound from their varga when followed by n or m OR after class hard consonant changes to 3rd consonant of class',
      descr: ' (class consonant) followed by (nasal) optionally changes to the (nasal of class)',
      FIXME: тут любые согласные, или unaspirated? На аспир. нет примера
      reverse: 'nasal OR 3rd, when followed by n or m become the four final stops (k t ṭ p), OR voiced',
     */
    {num: '8.4.45',
     only: 'ext',
     split: function(mark) {
         if (!u.c(Const.Nay, mark.fin) || !u.c(Const.nm, mark.beg)) return;
         var hard = u.class1(mark.fin);
         if (!hard) return;
         var soft = Const.unvoiced2voiced[hard];
         var hvalue = [hard, Const.virama, ' ', mark.beg].join('');
         var svalue = [soft, Const.virama, ' ', mark.beg].join('');
         return [hvalue, svalue];
     },
     add: function(test) {
         if (!u.c(Const.Jay, test.fin) || !u.c(Const.nm, test.beg)) return;
         var res = [];         // TODO: случай, когда test.end массив? Или в Opt попадает?
         test.first.pop();
         test.end = u.class5(test.fin);
         res.push(test);
         // log('================= N', test.end);
         if (u.c(Const.Kar, test.fin)) {
             log('================= OPT');
             var opt = JSON.parse(JSON.stringify(test));
             opt.end = u.class3(test.fin);
             res.push(opt);
         }
         return res;
     }
    },

    /*
      descr: 'Dental + Palatal / Palatal (ex S) + Dental -> Palatal',
    */
    {num: '8.4.40',
     only: 'ext',
     split: function(mark) {
         if (!u.c(Const.palatal, mark.fin) || !u.c(Const.palatal, mark.beg)) return;
         var fin;
         var beg = mark.beg;
         if ((mark.fin == 'ञ') && u.c(Const.JaS, mark.beg)) {
             // When the (dental is a nasal) and the (palatal is a soft consonant), the dental changes to (palatal class nasal)
             fin = 'न';
         } else if ((mark.fin == 'ज') && u.c(Const.JaS, mark.beg)) {
             // (Dental class hard consonant) followed by (Palatal class soft consonant except nasal) changes to the (3rd of the Palatal class - ज)
             fin = Const.palatal_soft2dental_hard[mark.beg];
         } else if (mark.fin != 'श' && mark.beg == 'श') {
             // dental class consonant followed by (palatal sibilant) changes to the (corresponding palatal)- dental ex. s
             fin = u.pal2den(mark.fin); // dental
             // } else if (mark.fin != 'श' && (mark.beg == 'छ') && (u.c(Const.allvowels, u.matra(mark.sec)) || u.c(Const.yam, mark.sec) || mark.sec == 'ह्')) {
             // FIXME: тут проблема в том, что я не знаю здесь samasa и не могу вычислить вторую букву, но невелика и беда
         } else if (mark.fin != 'श' && (mark.beg == 'छ')) {
             // THE SAME, OPT - dental class consonant followed by (palatal sibilant) changes to the (corresponding palatal)- dental ex. s
             // If (श्) is followed by (vowel, semivowel, nasal or ह्), (श्) optionally changes to (छ)
             fin = u.pal2den(mark.fin); // dental
             beg = 'श'
         } else if (mark.fin == 'श') {
             // (dental class sibilant) followed by (palatal class consonant or palatal sibilant) changes to (palatal sibilant).
             fin = 'स';
         } else {
             fin = u.pal2den(mark.fin); // palatal
         }
         fin = [fin, Const.virama, ' ', beg].join('');
         return [fin];
     },
     add: function(mark) {}
    },

    {num: '',
     descr: '',
     split: function(mark) {},
     add: function(mark) {}
    },
    {num: '',
     descr: '',
     split: function(mark) {},
     add: function(mark) {}
    },
    {num: '',
     descr: '',
     split: function(mark) {},
     add: function(mark) {}
    },
];


module.exports = sutras;
