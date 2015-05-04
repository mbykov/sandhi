var u = require('./utils');
var Const = require('./const');
var shiva = require('shiva-sutras');
var log = u.log;
var d = u.debug;

// var dental_hard = u.hard(u.dental()); ==> ???? не поменять ли?
// var palatal_soft = u.soft(u.palatal());

var sutras = [
    {num: '',
    // {num: '8.4.55',
     cons: true,
     only: 'ext',
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
         // d('METH', samasa, this.num, JSON.stringify(this.marks));
         var mark, split, join, sandhi, nosandhi;
         var res = [];
         Object.keys(this.marks).forEach(function(raw) {
             mark = [raw.split('')[0], Const.virama, raw.split('')[1]].join('');
             var split = samasa.split(mark);
             if (split.length < 2) return;
             // d('MARKS', samasa, mark, this.num, JSON.stringify(marks));
             join = [Const.virama, ' '].join('');
             sandhi = marks[raw].split('').join(join);
             // d('RAW', raw);
             nosandhi = raw.split('').join(join);
             // d('SA', sandhi);
             res.push(split.join(nosandhi));
             res.push(split.join(sandhi));
         })
         return res;
     }
    },

    /*
      class consonant become the nasal sound from their varga when followed by n or m OR after class hard consonant changes to 3rd consonant of class,
      class consonant followed by (nasal) optionally changes to the nasal of class,
      FIXME: тут любые согласные, или unaspirated? На аспир. нет примера
      reverse: 'nasal OR 3rd, when followed by n or m become the four final stops (k t ṭ p), OR voiced',
     */
    {num: '8.4.45',
     cons: true,
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
         var opt;
         res.push(test);
         opt = JSON.parse(JSON.stringify(test));
         opt.first.pop();
         opt.end = u.class5(test.fin);
         res.push(opt);
         if (u.c(Const.Kar, test.fin)) {
             var hard = JSON.parse(JSON.stringify(test));
             hard.first.pop();
             hard.end = u.class3(test.fin);
             // d('================= OPT', hard);
             res.push(hard);
         }
         return res;
     }
    },

    /*
      Dental + Palatal / Palatal (ex S) + Dental -> Palatal
      When the (dental is a nasal) and the (palatal is a soft consonant), the dental changes to (palatal class nasal)
      (Dental class hard consonant) followed by (Palatal class soft consonant except nasal) changes to the (3rd of the Palatal class - ज)
      dental ex.s followed by (palatal sibilant) changes to the (corresponding palatal)
      (dental class sibilant) followed by (palatal class consonant or palatal sibilant) changes to (palatal sibilant).
    */
    {num: '8.4.40',
     cons: true,
     only: 'ext',
     split: function(mark) {
         if (!u.c(Const.palatal, mark.fin) || !u.c(Const.palatal, mark.beg)) return;
         var fin;
         var beg = mark.beg;
         // FIXME: здесь обозначения еще старые, заменить на Constable
         if ((mark.fin == 'ञ') && u.c(Const.JaS, mark.beg)) {
             fin = 'न';
         } else if ((mark.fin == 'ज') && u.c(Const.JaS, mark.beg)) {
             fin = Const.palatal_soft2dental_hard[mark.beg];
         } else if (mark.fin != 'श' && mark.beg == 'श') {
             fin = u.pal2den(mark.fin); // dental
         } else if (mark.fin != 'श' && (mark.beg == 'छ')) { // FIXME: тут проблема в том, что я не знаю здесь samasa и не могу вычислить вторую букву
             fin = u.pal2den(mark.fin); // dental
             beg = 'श'
         } else if (mark.fin == 'श') {
             fin = 'स';
         } else {
             fin = u.pal2den(mark.fin); // palatal
         }
         fin = [fin, Const.virama, ' ', beg].join('');
         return [fin];
     },

     add: function(mark) {
         if (!u.c(Const.dental, mark.fin) || !u.c(Const.palatal, mark.beg)) return;
         var res = [];
         mark.first.pop();
         if ((mark.fin == 'न') && u.c(u.soft(u.palatal()), mark.beg)) { // FIXME: any nasal ????
             mark.end = 'ञ';
         } else if (u.c(u.hard(u.dental()), mark.fin) && u.c(u.soft(u.palatal()), mark.beg)) {
             mark.end = 'ज';
         } else if (mark.fin != 'स' && mark.beg == 'श') {
             mark.end = u.dental2palatal(mark.fin);
             var sec = mark.second[1];
             if (u.c(Const.allvowels, u.matra(sec)) || u.c(Const.yam, sec) || sec == 'ह्') {
                 var opt = JSON.parse(JSON.stringify(mark));
                 opt.second.shift();
                 opt.second.unshift('छ');
                 res.push(opt);
             }
         } else if (mark.fin == 'स') {
             mark.end = 'श';
         } else {
             mark.end = u.dental2palatal(mark.fin);
         }
         res.push(mark);
         return res;
     },
    },

    /*
      'dental followed by a cerebral changes to the corresponding cerebral',
      1 when the (dental is a nasal) and the (cerebral is a soft consonant), the dental changes to (cerebral class nasal = ण).
      2 (dental class consonant) followed by (cerebral sibilant = ष) changes to the (corresponding cerebral)
      3 (dental class sibilant = स) followed by (cerebral class consonant or cerebral sibilant - ष) changes to (cerebral sibilant = ष).
      4 dental hard consonant followed by cerebral soft consonant except nasal changes to the (3rd of the Cerebral class = ड)
     */
    {num: '8.4.41',
     cons: true,
     only: 'ext',
     split: function(mark) {
         // log('=== split cerebral ===', mark);
         if (!u.c(u.cerebral(), mark.fin) || !u.c(u.cerebral(), mark.beg)) return;
         var fin;
         if (mark.fin == 'ण' && u.c(u.soft(u.cerebral()), mark.beg)) {
             d('=== split cerebral 1');
             fin = 'न';
         } else if (mark.fin != 'ष' && mark.beg == 'ष') {
             d('=== split cerebral 2', mark);
             fin = u.cerebral2dental(mark.fin);
         } else if (mark.fin == 'ष') {
             d('=== split cerebral 3', mark);
             fin = 'स';
         } else if (mark.fin == 'ड' && u.c(u.soft(), mark.beg)) {
             d('=== split cerebral 4', mark);
             fin = Const.cerebral_soft2dental_hard[mark.beg];
         } else {
             d('=== split cerebral 5');
             fin = u.cerebral2dental(mark.fin);
         }
         fin = [fin, Const.virama, ' ', mark.beg].join('');
         return [fin];
     },

     add: function(test) {
         if (!u.c(u.dental(), test.fin) || !u.c(u.cerebral(), test.beg)) return;
         var res = [];
         test.first.pop();
         if (test.fin == 'न' && u.c(u.soft(u.cerebral()), test.beg)) { // FIXME: any nasal? and the same note for split
             d('=== cerebral 1');
             test.end = 'ण';
         } else if (test.fin != 'स' && test.beg == 'ष') {
             d('=== cerebral 2', u.dental());
             test.end = u.dental2cerebral(test.fin);
         } else if (test.fin == 'स') {
             d('=== cerebral 3');
             test.end = 'ष';
         } else if (u.c(u.hard(), test.fin) && u.c(u.soft(), test.beg)) {
             d('=== cerebral 4');
             test.end = 'ड';
         } else {
             test.end = u.dental2cerebral(test.fin);
         }
         res.push(test);
         return res;
     }
    },

    /*
      If n is followed by l, then n is replaced by nasal l.
      If a dental other than n and s is followed by l, then the dental is replaced by l.
    */
    {num: '8.4.60',
     cons: true,
     only: 'ext',
     method: function(test) {
         var fin;
         if (!(test.fin == 'ल') || test.beg != 'ल') return;
         test.first.pop();
         if (test.candra) { // 'लँ'
             test.end = 'न';
         } else {
             Const.tavarga.pop(); // tavarga: ['त', 'थ', 'द', 'ध', 'न']
             test.ends = Const.tavarga;
         }
         return test;
     },
     split: function(mark) {
         if (mark.fin != 'ल' || mark.beg != 'ल') return;
         var fin;
         if (mark.candra) { // 'लँ'
             fin = 'न';
         }
         // в сплите нет чандры
         log('=== split cerebral ===', mark);
         fin = [fin, Const.virama, ' ', mark.beg].join('');
         return [fin];
     },
     add: function(test) {
         if (!u.c(u.dental(), test.fin) || test.beg != 'ल') return;
         var res = [];
         test.first.pop();
         if (test.fin == 'न') {
             test.end = 'लँ';
         } else {
             test.end = 'ल';
         }
         res.push(test);
         return res;
     }
    },

    {num: '',
     descr: '',
     split: function(mark) {},
     add: function(mark) {}
    },
];


module.exports = sutras;
