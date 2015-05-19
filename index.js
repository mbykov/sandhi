/*
  npm module
*/

var _ = require('underscore');
var util = require('util');
var Const = require('./lib/const');
var u = require('./lib/utils');
var vowRules = require('./lib/vowel_sutras');
var visRules = require('./lib/visarga_sutras');
var consRules = require('./lib/cons_sutras');
var sutras = require('./lib/cons_sutras');
var log = u.log;

var debug = (process.env.debug == 'true') ? true : false;

module.exports = sandhi();

/**/
function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

/*
*/
function makeMarkerList(samasa) {
    var marks = [];
    var arr = samasa.split('');
    var idx = 0;
    arr.forEach(function(sym, i) {
        // if (u.c(Const.special, sym)) return;
        // FIXME: здесь как-то нужно установить пределы аккуратнее, а не просто - со второй до предпоследней
        if (i < 1) return;
        if (i > samasa.length - 2) return;
        var mark, pattern, size;
        var next1 = arr[i+1];
        var next2 = arr[i+2];
        var next3 = arr[i+3];

        // === SPLIT FILTER CONSONANT ===

        // class consonant followed by (nasal) optionally changes to the nasal of class, or less commonly for class hard consonants, changes to 3rd consonant of class
        if ((u.c(Const.nasals, sym) || u.c(Const.class3, sym))&& next1 == Const.virama && u.c(Const.nm, next2)) { // Nay - nas + hard+soft
            var pattern = [sym, Const.virama, next2].join('');
            var mark = {num: '8.4.45', pattern: pattern, fin: sym, beg: next2, idx: idx, pos: i};
            marks.push(mark);
            // log('M cons nasal', i, 'mark', mark);
        }

        // dental class consonant followed by a palatal class consonant changes to the corresponding palatal ===> reverse: doubled palatal
        if (u.c(u.palatal(), sym) && next1 == Const.virama && u.c(u.palatal(), next2)) {
            var pattern = [sym, Const.virama, next2].join('');
            var mark = {num: '8.4.40', pattern: pattern, fin: sym, beg: next2, idx: idx, pos: i};
            marks.push(mark);
            // log('M cons palatal', i, 'mark', mark);
        }

        // dental class consonant followed by a cerebral class consonant changes to the corresponding cerebral ===> reverse: doubled cerebral
        if (u.c(Const.cerebral, sym) && next1 == Const.virama && u.c(Const.cerebral, next2)) {
            var pattern = [sym, Const.virama, next2].join('');
            var mark = {num: '8.4.41', pattern: pattern, fin: sym, beg: next2, idx: idx, pos: i};
            marks.push(mark);
            // log('M cons cerebral', i, 'mark', mark);
        }

        // If n is followed by l, then n is replaced by nasal l. If a dental other than n and s is followed by l, then the dental is replaced by l.
        if ('ल' == sym && next1 == Const.virama && 'ल' == next2) {
            var pattern = [sym, Const.virama, next2].join('');
            var mark = {num: '8.4.60', pattern: pattern, fin: sym, beg: next2, idx: idx, pos: i};
            marks.push(mark);
            // log('M cons L', i, 'mark', mark);
        } else if ('ल' == sym && next1 == Const.candra && next2 == Const.virama && 'ल' == next3) {
            var pattern = [sym, Const.candra, Const.virama, next3].join('');
            var mark = {num: '8.4.60', pattern: pattern, fin: sym, beg: next2, candra: true, idx: idx, pos: i};
            marks.push(mark);
            // log('M cons L-candra', i, 'mark', mark);
        }

        // log('m consonants', i, 'sym', sym, 1, next1, 2, next2);


        // === VOWEL ===

        // simple vowel, followed by a similar vowel => dirgha
        if (u.c(Const.dirgha_ligas, sym)) { // FIXME: проверить !la - на la-liga нет теста
            var mark = {type: 'vowel', num: '6.1.101', pattern: sym, idx: idx, pos: i};
            marks.push(mark);
            // log('M vow dirgha', i, 'mark', mark);
        }

        // a or ā is followed by simple ->  guna
        if (u.c(Const.gunas, u.vowel(sym))) {
            var mark = {num: '6.1.87', pattern: sym, idx: idx, pos: i, size: i+1};
            marks.push(mark);
            // log('M vow guna', i, 'mark', mark);
        } else if ((u.c(Const.hal, sym) || sym == Const.A) && (next1 == 'र' || next1 == 'ल') && next2 == Const.virama) {
            pattern = [next1, Const.virama].join('');
            var mark = {num: '6.1.87', pattern: pattern, idx: idx, pos: i+1};
            marks.push(mark);
            // log('M vow guna RL', i, 'mark', mark);
        }

        // a or ā is followed by e, o, ai or au - vriddhi
        if (u.c(Const.vriddhis, u.vowel(sym))) {
            var mark = {num: '6.1.88', pattern: sym, idx: idx, pos: i};
            marks.push(mark);
            // log('M vow 88 vriddhi', i, 'mark', mark);
        }

        // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel (+virama); yana-sandhi
        if (sym == Const.virama && u.c(Const.yaR, next1) && next2 != Const.virama) {
            // 6.1.77 yana = semi-vowels
            if (u.c(Const.allligas, next2)) {
                pattern = [Const.virama, next1, next2].join('');
            } else {
                pattern = [Const.virama, next1].join('');
            }
            var mark = {num: '6.1.77', pattern: pattern, beg: next2, idx: idx, pos: i};
            marks.push(mark);
            // log('M yana 77 ', i, 'mark', mark);
        }

        // TODO: засада - перебивает dirgha-type - देहाविष्ट - आविष्ट - TODO: убрать везде else?

        // 6.1.78 - ayadi-guna - e,o+vow-a => ay,av+vow-a (comp. 6.1.109); - ayadi-vriddhi - E,O+vow => Ay,Av+vow, if vow=aA - next=cons
        if (sym == Const.A && u.c(Const.yava, next1)) { // E,O
            if (u.c(Const.allligas, next2)) {
                pattern = [Const.A, next1, next2].join('');
            } else {
                pattern = [Const.A, next1].join('');     //
            }
            var mark = {num: '6.1.78', pattern: pattern, beg: next2, idx: idx, pos: i};
            marks.push(mark);
            // log('M ayadi-vriddhi 78 ', i, 'mark', mark);
        } else if (sym != Const.A && sym != Const.virama && u.c(Const.yava, next1) && u.c(Const.allligas, next2)) {
            pattern = [next1, next2].join('');
            var mark = {num: '6.1.78', pattern: pattern, idx: idx, pos: i+1};
            marks.push(mark);
            // log('M ayadi-guna-wo-a 78', i, 'mark', mark, 'sym', sym, 1, next1, 2, next2, sym != Const.virama);
        }

        // 6.1.109 - ayadi - e,o+a => avagraha
        if (sym == Const.avagraha) {
            pattern = sym;
            var mark = {num: '6.1.109', pattern: pattern, idx: idx, pos: i};
            marks.push(mark);
            // log('M vow ayadi-avagraha', i, 'mark:', mark);
        }

        // === VISARGA === only concatenated result

        // अ & visarga changes to ओ+avagraha when followed by अ
        if (u.c(Const.hal, sym) && next1 == 'ो' && next2 == Const.avagraha) {
            pattern = [next1, Const.avagraha].join('');
            var mark = {type: 'visarga', num: 'visarga-ah-a', pattern: pattern, idx: idx, pos: i};
            marks.push(mark);
            // log('M visarga', i, 'mark', mark);
        }

        if (u.vowsound(sym) && u.c(['श', 'ष', 'स'], next1) && next2 == Const.virama) {
            pattern = [next1, Const.virama].join('');
            var mark = {type: 'visarga', num: 'visarga-hard-cons', pattern: pattern, idx: idx, pos: i+1};
            marks.push(mark);
            // log('M visarga-Sc', i, 'mark', mark);
        }



        // TODO: R, видимо, пересмотреть
        // visarga after simple changes to र् when followed by a vowel or soft consonant except र्
        // if (u.c(Const.allsimpleligas, sym) && next1 == 'र' && (u.c(Const.allligas, next2) || ((u.c(Const.JaS, next2) || u.c(Const.yaR, next2)) && next2 != 'र') ) ) {
        if (u.c(Const.allsimpleligas, sym) && next1 == 'र' ) {
            var beg;
            if (u.c(Const.allligas, next2)) {
                pattern = [next1, next2].join('');
                beg = next2;
            } else if ((u.c(Const.JaS, next2) || u.c(Const.yaR, next2)) && next2 != 'र') {
                pattern = next1;
                beg = next2;
            } else if (next2 == Const.virama && (u.c(Const.JaS, next3) || u.c(Const.yaR, next3)) && next3 != 'र') {
                pattern = [next1, Const.virama].join('');
                beg = next3;
            } else return; // sic!
            var mark = {type: 'visarga', num: '4.1.3', pattern: pattern, beg: beg, idx: idx, pos: i+1};
            marks.push(mark);
            // log('M visarga R soft', i, 'mark', mark, 'patt', pattern, 2, next2, 3, next3); // गुरुर्ब्रह्मा
        }
        idx++;
        // log('SYM', i, sym, next1, next2, u.c(Const.JaS, next2), Const.JaS );
    });
    // log('splitting marks', marks);
    return marks;
}

function mark2sandhi(marks) {
    var list = [];
    marks.forEach(function(mark) {
        var sutra = vowRules[mark.num] || consRules[mark.num] || visRules[mark.num];
        if (!sutra) return; // FIXME: не должно быть
        var sandhis = sutra.split(mark);
        sandhis.forEach(function(sandhi) {
            var m = JSON.parse(JSON.stringify(mark));
            m.sandhi = sandhi;
            list.push(m);
        });
    });
    return list;
}

function spacedSplit(samasa, next) {
    var fin = samasa.slice(-1);
    var penult = samasa.slice(-2);
    var first = samasa.split('');
    var beg = next[0];
    // अ & visarga (standing for अस्) followed by a soft consonant -> changes to ओ
    if (u.vowel(fin) == 'ओ' && u.c(Const.haS, beg)) {
        first.pop();
        first.push(Const.visarga);
    }

    // अ & visarga (standing for अस्) followed by a vowel except अ -> visarga is dropped
    if (u.c(Const.hal, fin) && u.c(Const.allexa, beg)) {
        first.push(Const.visarga);
    }

    // आ & visarga  (for आस्) is followed by a vowel or soft consonant - > dropped.
    if ((fin == Const.A) && (u.c(Const.allvowels, beg) || u.c(Const.haS, beg))) {
        first.push(Const.visarga);
    }


    if (u.endsaA(samasa) && u.startsaA(next)) {
    }
    return first.join('');
}

/*
    FIXME: здесь нужно выделить слова, т.е. пробелы и спец. символы - конец строки
*/
sandhi.prototype.split = function(str) {
    var splits = {};
    var samasas = str.split(' ');
    samasas.forEach(function(samasa, idx) {
        var next = samasas[idx+1];
        var spaced = (next) ? spacedSplit(samasa, next) : samasa;
        splits[samasa] = splitone(spaced);
        if (samasa != spaced) splits[samasa].unshift(spaced);
        // log(33, splits[samasa]);
    });
    return splits; //  'रा आमः', 'रा अमः', 'र आमः', 'र अमः'
}

/*
  make test g=4.41.+7.+split // देह + आविष्ट - देहाविष्ट
*/
// sandhi.prototype.splitone = function(samasa) {
function splitone(samasa) {
    var res = [];
    var marks = makeMarkerList(samasa);
    if (marks.length == 0) return []; // log('==no_markers!!!=='); // FIXME: этого не должно быть
    // log('==marks==', marks.map(function(m) { return JSON.stringify(m)}));
    var list = mark2sandhi(marks);
    // log('==list==', list.map(function(m) { return JSON.stringify(m)}));
    var cleans = u.combinator(list);
    if (cleans.length > 25) log('==cleans.size== list:', list.length, 'cleans:', cleans.length)
    cleans.forEach(function(comb) {
        var result = samasa;
        comb.forEach(function(mark) {
            // log('=>M', mark);
            result = u.replaceByPos(result, mark.pattern, mark.sandhi, mark.pos);
        });
        // log('result:', result);
        if (result != samasa) res.push(result); // этого неравенства не должно быть, все маркеры должны давать замену
        // res.push(result);
    });
    // log('res:', res);
    var uniq = _.uniq(res);
    if (res.length != uniq.length) log('NOT UNIQ! SPLIT results:', res.length, 'uniq:', uniq.length, 'cleans:', cleans.length); // भानूदयः
    // log('SPL=> RES', uniq);
    return uniq;
}

// шмитовский проезд - кони - б.белое здание, по ул. 5=года - управа, мюллер, 916-917-42-22

sandhi.prototype.add = function(first, second) {
    var mark = makeMarker(first, second);
    var sutra = vowRules[mark.num] || consRules[mark.num] || visRules[mark.num];
    if (!sutra) return; // FIXME: не должно быть
    var marks = sutra.add(mark);
    var res = marks.map(function(m) { return makeAddResult(m)});

    // log('ADD=> RES', res);
    return res;
}


function makeMarker(f, s) {
    var first = f.split('');
    var second = s.split('');
    var fin = first.slice(-1)[0];
    if (u.c(Const.consonants, fin)) fin = '';
    var penult = first.slice(-2)[0];
    var beg = second[0];
    var marker;
    // Const.special ? candra всегда после вирамы? Что остальные?
    // сейчас cons_sutras - только согласная, вирама, согласная
    if (fin == Const.virama && u.c(Const.hal, beg)) {
        var vir = false;
        var candra = false;
        if (fin == Const.virama) {
            first.pop();
            fin = first.slice(-1)[0];
            vir = true;
        }
        if (fin == Const.candra) {
            first.pop();
            fin = first.slice(-1)[0];
            candra = true;
        }
        marker = {type: 'cons', first: first, fin: fin, vir: vir, second: second, beg: beg};
        if (vir) marker.vir = true;
        if (candra) marker.candra = true;

        // === ADD FILTER CONSONATS ===
        // class consonant followed by (nasal) optionally changes to the nasal of class, or less commonly for class hard consonants, changes to 3rd consonant of class
        if (u.c(Const.Jay, fin) && u.c(Const.nm, beg)) marker.num = '8.4.45';
        // dental class consonant followed by a palatal class consonant changes to the corresponding palatal
        if (u.c(u.dental(), fin) && u.c(u.palatal(), beg)) marker.num = '8.4.40';
        if (u.c(u.dental(), fin) && u.c(u.cerebral(), beg)) marker.num = '8.4.41';
        // If n is followed by l, then n is replaced by nasal l. If a dental other than n and s is followed by l, then the dental is replaced by l.
        if (u.c(u.dental(), fin) && beg == 'ल') marker.num = '8.4.60';


        // log('CONS ADD MARKER:', marker.num, 'fin:', fin, 'beg:', beg);

        // === ADD FILTER VOWELS ===
    } else if ((u.c(Const.consonants, fin) || u.c(Const.allligas, fin)) && u.c(Const.allvowels, beg)) {
        marker = {type: 'vowel', first: first, fin: fin, second: second, beg: beg};
        if (u.similar(fin, beg) || u.c(Const.aAliga, fin) && u.c(Const.aA, beg)) marker.num = '6.1.101';
        if (u.c(Const.aAliga, fin) && u.c(Const.allsimples, beg)) marker.num = '6.1.87';
        if (u.c(Const.aAliga, fin) && u.c(Const.diphtongs, beg)) marker.num = '6.1.88';
        if (u.c(Const.allsimpleligas, fin) && u.c(Const.allvowels, beg) && !u.similar(fin, beg)) marker.num = '6.1.77';
        // 6.1.78 - ayadi-guna - e,o+vow-a => ay,av+vow-a (comp. 6.1.109); - ayadi-vriddhi - E,O+vow => Ay,Av+vow, if vow=aA - next=cons
        if (u.c(Const.diphtongs, u.vowel(fin)) && u.c(Const.allvowels, u.vowel(fin)) && !(u.c(Const.gunas, u.vowel(fin)) && beg =='अ')) marker.num = '6.1.78';
        if (u.c(Const.gunas, u.vowel(fin)) && beg =='अ') marker.num = '6.1.109';

        // log('ADD VOW MARK', marker.num, 'fin', fin, 'beg', beg, 3, u.vowel(fin));

    // . . . if ((first.length == 1) && u.c(Const.allvowels, fin) && u.c(Const.allvowels, beg)) {        // FIXME: случай first из одной гласной буквы.


        // === ADD FILTER VISARGA ===
    } else if (fin == Const.visarga) {
        var ah = u.c(Const.hal, penult);
        var aah = Const.A == penult;
        marker = {type: 'visarga', first: first, fin: fin, second: second, beg: beg};
        // -ah:
        if (ah && beg =='अ') marker.num = 'visarga-ah-a';
        if (ah && u.c(Const.haS, beg)) marker.num = 'visarga-ah-soft';
        // अ & visarga (standing for अस्) followed by a vowel except अ -> visarga is dropped
        // NOTE_1: FIXME: TODO: NB: ===> there is case with diphtongs, but not simple vowel, when visarga changes to y, but not space ->
        // http://www.sanskrit-sanscrito.com.ar/en/learning-sanskrit-combination-4-1/431 -> Table 9
        if (ah && u.c(Const.allexa, beg)) marker.num = 'visarga-ah-other';

        // (visarga) changes to (श्) (p sb) when followed by (च् or छ्) (p hc)
        if (u.c(['च', 'छ', 'श'], beg)) {
            marker.num = 'visarga-hard-cons';
            marker.result = 'श्';
        } else if (u.c(['ट', 'ठ', 'ष'], beg)) {
            marker.num = 'visarga-hard-cons';
            marker.result = 'ष्';
        } else if (u.c(['त', 'थ', 'स'], beg)) {
            marker.num = 'visarga-hard-cons';
            marker.result = 'स्';
        }

        // -Ah
        // आ & visarga (for आस्) is followed by a vowel or soft consonent - > dropped.
        if (aah && (u.c(Const.allvowels, beg) || u.c(Const.haS, beg))) marker.num = 'visarga-aah-vow';

        // log('VISARGA ADD MARKER:', marker.num, 'fin:', fin, 'beg:', beg);

        // visarga after simple changes to र् when followed by a vowel or soft consonant except र्
        if (u.c(Const.allsimples, u.vowel(penult)) && (u.c(Const.allvowels, beg) || (u.c(Const.JaS, beg) && beg != 'र'))) marker.num = '4.1.3';

    }
    // log('MARKER', marker, fin, beg);
    return marker;
}

function makeAddResult(mark) {
    // if (mark.type == 'cons' && u.c(Const.allvowels, mark.beg)) {
    //     mark.second.shift();
    //     liga = Const.vow2liga[mark.beg];
    //     mark.second.unshift(liga);
    //     mark.vir = false;
    // }
    var space = (mark.space) ? ' ' : '';
    if (mark.end) mark.first.push(mark.end);
    if (mark.vir) mark.first.push(Const.virama);
    return [mark.first.join(''), mark.second.join('')].join(space);
}
