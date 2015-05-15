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

        if (sym == Const.virama && u.c(Const.yaR, next1) && next2 != Const.virama) { // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel (+virama)
            // 6.1.77 yana = semi-vowels
            if (u.c(Const.allligas, next2)) {
                pattern = [Const.virama, next1, next2].join('');
            } else {
                pattern = [Const.virama, next1].join('');
            }
            mark = {type: 'yana', pattern: pattern, beg: next2, idx: idx, pos: i};
            // log('M vow yaNa', i, 'mark', mark); // योगि + अङ्ग - योग्यङ्ग
        } else if (sym == Const.A && u.c(Const.yava, next1)) { // diphthong-vridhi, beg: vow or cons-for-a - to only ya,va
            // TODO: засада - перебивает dirgha-type - देहाविष्ट - आविष्ट - TODO: убрать везде else?
            // 6.1.78 - ayadi - e,o+vow-a => ay,av+vow; E,O+vow => Ay,Av+vow
            if (u.c(Const.allligas, next2)) {
                pattern = [Const.A, next1, next2].join('');
            } else {
                pattern = [Const.A, next1].join('');
            }
            mark = {type: 'ayadi', pattern: pattern, beg: next2, idx: idx, pos: i};
            // log('M vow ayadi-vriddhi', i, 'mark', mark);
        } else if (u.c(Const.yava, sym) && u.c(Const.allligas, next1)) { // diphthong followed by any vowel (e,o vow-a), including itself, changes to its semi-vowel equivalent - external - optional
            // 6.1.78 - ayadi - e,o+vow-a => ay,av+vow; E,O+vow => Ay,Av+vow
            pattern = [sym, next1].join('');
            mark = {type: 'ayadi', pattern: pattern, idx: idx, pos: i};
            // log('M vow ayadi-guna-wo-a', i, 'mark', mark);
        } else if (sym == Const.avagraha) {// "e" and "o" at the end of a word, when followed by "a" gives avagraha
            // 6.1.109 - ayadi - e,o+a => avagraha
            pattern = sym;
            mark = {type: 'ayadi', pattern: pattern, idx: idx, pos: i};
            // log('M vow ayadi-avagraha', i, 'mark:', mark);

        } else if (next1 && next2 && u.c(Const.Jay, sym) && (next1 == Const.virama) && u.c(Const.hal, next2)) { // Jay = hard+soft
            if (sym == 'र') return; // FIXME: - д.б. список всех невозможных комбинаций, возможно, не здесь, а перед определителем маркера, вне if
            pattern = [sym, Const.virama, next2].join('');
            mark = {type: 'cons', pattern: pattern, fin: sym, beg: next2, idx: idx, pos: i};
            // log('M cons', i, sym, next1, next2);
            // } else if (u.c(Const.dirgha_ligas, sym) && sym != 'ॢ') {
        } else if (u.c(Const.vriddhis, u.vowel(sym))) {
            // 6.1.88
            mark = {type: 'vriddhi', pattern: sym, idx: idx, pos: i};
            // log('M vow vriddhi', i, 'mark', mark);
            // guna r,l ->
        }
        // === VOWEL ===

        // simple vowel, followed by a similar vowel => dirgha
        if (u.c(Const.dirgha_ligas, sym)) { // FIXME: проверить !la - на la-liga нет теста
            var mark = {type: 'vowel', num: '6.1.101', pattern: sym, idx: idx, pos: i};
            marks.push(mark);
            // log('M vow dirgha', i, 'mark', mark, 'size', samasa.length);
        }

        // a or ā is followed by simple ->  guna
        if (u.c(Const.gunas, u.vowel(sym))) {
            var mark = {num: '6.1.87', pattern: sym, idx: idx, pos: i, size: i+1};
            marks.push(mark);
            // log('M vow guna', i, 'mark', mark);
        } else if ((u.c(Const.hal, sym) || sym == Const.A) && (next1 == 'र' || next1 == 'ल') && next2 == Const.virama) {
            pattern = [next1, Const.virama].join('');
            mark = {num: '6.1.87', pattern: pattern, idx: idx, pos: i+1};
            marks.push(mark);
            // log('M vow guna RL', i, 'mark', mark);
        }

        // a or ā is followed by e, o, ai or au - vriddhi
        if (u.c(Const.vriddhis, u.vowel(sym))) {
            mark = {num: '6.1.88', pattern: sym, idx: idx, pos: i};
            marks.push(mark);
            // log('M vow 88 vriddhi', i, 'mark', mark);
        }

        // === VISARGA ===

        // अ & visarga changes to ओ+avagraha when followed by अ
        if (u.c(Const.hal, sym) && next1 == 'ो' && next2 == Const.avagraha) {
            pattern = [next1, Const.avagraha].join('');
            var mark = {type: 'visarga', num: '4.1.2', pattern: pattern, idx: idx, pos: i};
            marks.push(mark);
            // log('M visarga', i, 'mark', mark);
        }
        idx++;
        // log('SYM', i, sym, next1, next2);
    });
    // log('marks', marks)
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

/*  FIXME: здесь нужно выделить слова, т.е. пробелы и спец. символы - конец строки
  добавить outer после split или до? Имеет ли это значение?
*/
sandhi.prototype.split = function(str) {
    var splits = {};
    var samasas = str.split(' ');
    samasas.forEach(function(samasa, idx) {
        var next = samasas[idx+1];
        if (next && u.endsaA(samasa) && u.startsaA(next)) {
            // изменяю окончание самаса
            // log('HERE AA', str);
        }
        splits[samasa] = splitone(samasa);
    });
    return splits;
}

/*
  make test g=4.41.+7.+split // देह + आविष्ट - देहाविष्ट
*/
// sandhi.prototype.splitone = function(samasa) {
function splitone(samasa) {
    var res = [];
    var marks = makeMarkerList(samasa);
    if (marks.length == 0) return log('==no_markers!!!=='); // FIXME: этого не должно быть
    // log('==marks==', marks.map(function(m) { return JSON.stringify(m)}));
    var list = mark2sandhi(marks);
    // log('==list==', list.map(function(m) { return JSON.stringify(m)}));
    var cleans = u.combinator(list);
    if (cleans.length > 15) log('==cleans.size== list:', list.length, 'cleans:', cleans.length)
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
    if (res.length != uniq.length) log('NOT UNIQ! SPLIT RES:', res.length, 'uniq:', uniq.length, 'cleans:', cleans.length); // भानूदयः
    // log('RES', uniq);
    return uniq;
}

// шмитовский проезд - кони - б.белое здание, по ул. 5=года - управа, мюллер, 916-917-42-22

sandhi.prototype.add = function(first, second) {
    var mark = makeMarker(first, second);
    var sutra = vowRules[mark.num] || consRules[mark.num] || visRules[mark.num];
    if (!sutra) return; // FIXME: не должно быть
    var marks = sutra.add(mark);
    var res = marks.map(function(m) { return makeAddResult(m)});
    // log('RES', res);
    return res;
}


function makeMarker(f, s) {
    var first = f.split('');
    var second = s.split('');
    var fin = first.slice(-1)[0];
    if (u.c(Const.consonants, fin)) fin = '';
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

        // === ADD VOWELS ===
    } else if ((u.c(Const.consonants, fin) || u.c(Const.allligas, fin)) && u.c(Const.allvowels, beg)) {
        marker = {type: 'vowel', first: first, fin: fin, second: second, beg: beg};
        if (u.similar(fin, beg) || u.c(Const.aAliga, fin) && u.c(Const.aA, beg)) marker.num = '6.1.101';
        if (u.c(Const.aAliga, fin) && u.c(Const.allsimples, beg)) marker.num = '6.1.87';
        if (u.c(Const.aAliga, fin) && u.c(Const.diphtongs, beg)) marker.num = '6.1.88';

        // if (u.c(Const.aAliga, test.fin) && u.c(Const.aA, test.beg))

        // log('ADD VOW MARK', marker.num, 'fin', fin, 'beg', beg);


    // } else if ((first.length == 1) && u.c(Const.allvowels, fin) && u.c(Const.allvowels, beg)) {        // FIXME: случай first из одной гласной буквы.
    //     fin = u.liga(fin);
    //     marker = {type: 'vow', first: first, fin: fin, second: second, beg: beg};
    //     // log('VOW MARK ONE', marker);


        // === ADD VISARGA ===
    } else if (fin == Const.visarga) {
        marker = {type: 'visarga', first: first, fin: fin, second: second, beg: beg};
        if (beg =='अ') marker.num = '4.1.2';
    }
    // log('MARKER', marker);
    return marker;
}

function makeAddResult(test) {
    // if (test.type == 'cons' && u.c(Const.allvowels, test.beg)) {
    //     test.second.shift();
    //     liga = Const.vow2liga[test.beg];
    //     test.second.unshift(liga);
    //     test.vir = false;
    // }
    var conc = (test.conc) ? ' ' : '';
    if (test.end) test.first.push(test.end);
    if (test.vir) test.first.push(Const.virama);
    return [test.first.join(''), test.second.join('')].join(conc);
}
