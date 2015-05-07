/*
  node.js and component
*/

var _ = require('underscore');
var util = require('util');
// var typeOf = require('typeof');
// var shiva = require('mbykov/shiva-sutras');
// var shiva = require('shiva-sutras');
var Const = require('./lib/const');
var u = require('./lib/utils');
// var vowRules = require('./lib/vowel_rule');
// var consRules = require('./lib/cons_rules');
// var delConsRules = require('./lib/del_cons_rules');
var sutras = require('./lib/cons_sutras');
var log = u.log;

var debug = (process.env.debug == 'true') ? true : false;

module.exports = sandhi();

/*
  TODO: берем тест, смотрим тип правила: vowel, visarga, cons  массив условий для правила => if vowel + частные условия
*/
function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

/*
  в make Mark List не только virama, но и candra, и?

  if (fin == Const.candra) {
  first.pop();
  fin = first.slice(-1)[0];
  candra = true;
  }

*/

/*
  vowels:
  dirgha_liga -> simple vowel, followed by a similar vowel
  e, o, ar, al - > a or ā is followed by simple vowel - guna
*/
function makeMarkerList(samasa) {
    var marks = [];
    var arr = samasa.split('');
    var idx = 0;
    arr.forEach(function(sym, i) {
        if (u.c(Const.special, sym)) return;
        var mark, pattern;
        var next1 = arr[i+1];
        var next2 = arr[i+2];
        if (next1 && next2 && u.c(Const.hal, sym) && (next1 == Const.virama) && u.c(Const.hal, next2)) {
            if (sym == 'र') return; // FIXME - д.б. список всех невозможных комбинаций, возможно, не здесь, а перед определителем маркера, вне if
            pattern = [sym, Const.virama, next2].join('');
            mark = {type: 'cons', pattern: pattern, fin: sym, beg: next2, idx: idx, pos: i};
            idx++;
            marks.push(mark);
            // log('M cons', i, sym, next1, next2);
            // } else if (u.c(Const.dirgha_ligas, sym) && sym != 'ॢ') {
            // dirgha, guna, vriddhi ->
        } else if (u.c(Const.dirgha_ligas, sym) || u.c(Const.guna_diphs, u.vowel(sym))  || u.c(Const.vriddhi_diphs, u.vowel(sym))) { // FIXME: проверить !la - на la-liga нет теста
            // } else if ((u.c(Const.consonants, fin) || u.c(Const.allligas, fin)) && u.c(Const.allvowels, beg)) {
            mark = {type: 'vow', pattern: sym, idx: idx, pos: i};
            idx++;
            // log('M vow dirgha', i, 'mark', mark);
            marks.push(mark);
            // guna r,l ->
        } else if ((u.c(Const.hal, sym) || sym == Const.A) && (next1 == 'र' || next1 == 'ल') && next2 == Const.virama) {
            pattern = [next1, Const.virama].join('');
            mark = {type: 'vow', pattern: pattern, idx: idx, pos: i};
            idx++;
            // log('M vow fF', i, 'mark', mark);
            marks.push(mark);
            // yana-sandhi=semivows ->
        } else if (u.c(Const.yaR, sym) && !u.similar(sym, next1)) { // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel
            // тут нужно добавить dissimilar FIXME:
            if (u.c(Const.allligas, next1)) {
                pattern = [Const.virama, sym, next1].join('');
                mark = {type: 'vow', pattern: pattern, idx: idx, pos: i};
                // log('SYM', i, sym, next1, u.similar(sym, next1));
            } else if (u.c(Const.consonants, next1)) {
                mark = {type: 'vow', pattern: sym, idx: idx, pos: i};
            } else return;
            idx++;
            // log('M vow yaNa', i, 'mark', mark);
            marks.push(mark);
        } else {
            // log('can not mark');
            return;
        }
        // log('SYM', i, sym, next1, next2); // योग्यङ्ग अङ्ग
    });
    return marks;
}

function mark2sandhi(marks) {
    var list = [];
    marks.forEach(function(mark) {
        var fn = ['./lib/', mark.type, '_sutras'].join('');
        var sutras = require(fn);
        sutras.forEach(function(sutra) {
            if (sutra.num == '') return; // FIXME:
            if (sutra.type != mark.type) return;
            var sandhis = sutra.split(mark);
            if (!sandhis) return;
            if (mark.type == 'cons' && !sandhis) { // FIXME: до полного списка сутр, для комбинатора
                mark.fake = true;
                sandhis = [[[mark.fin, Const.virama].join(''), mark.beg].join(' ')];
            }
            sandhis.forEach(function(sandhi) {
                var m = JSON.parse(JSON.stringify(mark));
                m.sandhi = sandhi;
                list.push(m);
            });
        });
    });
    return list;
}

/*
  make test g=4.41.+7.+split
*/
sandhi.prototype.split = function(samasa) {
    var res = [];
    var marks = makeMarkerList(samasa);
    if (marks.length == 0) return log('==no_markers!!!=='); // FIXME: этого не должно быть
    // log('==marks==', marks.map(function(m) { return JSON.stringify(m)}));
    var list = mark2sandhi(marks);
    // log('==list==', list.map(function(m) { return JSON.stringify(m)}));
    var combinations = u.combinator(list);
    var cleans = []; // параллельные замены (одного маркера) не пермутируют между собой
    combinations.forEach(function(comb) {
        var idxs = comb.map(function(m) {
            return m.idx;
        });
        // log('IDXS', idxs, 'uniq', _.uniq(idxs));
        if (idxs.length == _.uniq(idxs).length) cleans.push(comb);
    });
    // log('==clean==', cleans.map(function(m) { return JSON.stringify(m)}));
    if (cleans.length > 100) log('==cleans.size==', marks.length, 'list', list.length, 'combs', combinations.length, 'cleans', cleans.length)
    // log(cleans)
    cleans.forEach(function(comb) {
        var result = samasa;
        comb.forEach(function(mark) {
            // log('M',mark.sandhi);
            result = u.replaceByPos(result, mark.pattern, mark.sandhi, mark.pos);
            res.push(result);
            // log('S', result);
            // опять двадцать пять, затирается результат make test g=6.1.77.+_3_
        });
    });
    var uniq = _.uniq(res);
    log('SPLIT RESULT', res.length, uniq.length, xuniq);
    return uniq;
}

sandhi.prototype.add = function(first, second) {
    var res = [];
    var mark = makeMarker(first, second);
    var fn = ['./lib/', mark.type, '_sutras'].join('');
    var sutras = require(fn);
    sutras.forEach(function(sutra) {
        if (sutra.num == '') return;
        if (sutra.type != mark.type) return;
        var test = JSON.parse(JSON.stringify(mark));
        // log('====> E', sutra.num, test);
        var tmps = sutra.add(test);
        if (!tmps) return;
        // log('MARK', sutra.num, mark)
        tmps.forEach(function(mark) {
            var samasa = makeAddResult(mark);
            res.push(samasa);
        });
    });
    // log('ADD RES', res);
    return res;
}

function makeMarker(f, s) {
    var first = f.split('');
    var second = s.split('');
    var fin = first.slice(-1)[0];
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
    } else if ((u.c(Const.consonants, fin) || u.c(Const.allligas, fin)) && u.c(Const.allvowels, beg)) {
        marker = {type: 'vow', first: first, fin: fin, second: second, beg: beg};
        if (u.c(Const.consonants, fin)) marker.fin = '';
        // log('VOW MARK', marker);
    } else if ((first.length == 1) && u.c(Const.allvowels, fin) && u.c(Const.allvowels, beg)) {
        // FIXME: случай first из одной гласной буквы. Заменил на лигу, все равно выталкивавется. Но similar с L-liga глючит. Надо бы переделать
        fin = u.liga(fin);
        marker = {type: 'vow', first: first, fin: fin, second: second, beg: beg};
        // log('VOW MARK ONE', marker);
    }
    // log('MARKER', marker);
    return marker;
}

function makeAddResult(test) {
    if (test.type == 'cons' && u.c(Const.allvowels, test.beg)) {
        test.second.shift();
        liga = Const.vow2liga[test.beg];
        test.second.unshift(liga);
        test.vir = false;
    }
    var conc = (test.conc) ? ' ' : '';
    if (test.end) test.first.push(test.end);
    if (test.vir) test.first.push(Const.virama);
    return [test.first.join(''), test.second.join('')].join(conc);
}
