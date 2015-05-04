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

function makeMarkList(samasa) {
    var marks = [];
    var arr = samasa.split('');
    var idx = 0;
    arr.forEach(function(sym, i) {
        if (u.c(Const.special, sym)) return;
        var mark;
        var next1 = arr[i+1];
        var next2 = arr[i+2];
        if (!next1 || !next2) return;
        if (u.c(Const.hal, sym) && (next1 == Const.virama) && u.c(Const.hal, next2)) {
            var pattern = [sym, Const.virama, next2].join('');
            mark = {type: 'cons', pattern: pattern, fin: sym, beg: next2, idx: idx, pos: i};
            idx++;
            marks.push(mark);
        } else if (u.c(Const.dirgha_ligas, sym) && sym != 'ॢ') {
            // не, че-то глупо, лучше все комбинации на гласную
           // а как? либо долгая, либо комбинации с гласными
            mark = {type: 'dirgha', pattern: sym, idx: idx, pos: i};
            idx++;
            // log('==== mark', mark);
            marks.push(mark);
        }
    });
    return marks;
}

function mark2sandhi(marks) {
    marks.forEach(function(mark) {
        var fn = ['./lib/', mark.type, '_sutras'].join('');
        var sutras = require(fn);
        sutras.forEach(function(sutra) {
            if (sutra.num == '') return;
            if (sutra.type != mark.type) return;
            var sandhis = sutra.split(mark);
            if (!sandhis) return;
            mark.sandhis = sandhis;
        });
    });
}

function fake2sandhi(marks) {
    marks.forEach(function(mark) {
        if (!mark.sandhis) mark.sandhis = [[[mark.fin, Const.virama].join(''), mark.beg].join(' ')];
    });
}

// FIXME: fullMarkList - нужно объединить с  mark2sandhi => sandhiList
function fullMarkList(marks) {
    var list = [];
    marks.forEach(function(mark) {
        mark.sandhis.forEach(function(sandhi) {
            var m = JSON.parse(JSON.stringify(mark));
            m.sandhi = sandhi;
            list.push(m);
        });
    });
    return list;
}

function replaceByPos(samasa, pattern, sandhi, pos) {
    // log('==== SANDHI', sandhi);
    var first = samasa.slice(0, pos);
    var second = samasa.slice(pos);
    // log('===', first, second, sandhi)
    var result = second.replace(pattern, sandhi);
    return [first, result].join('');
}

/*
  make test g=4.41.+7.+split
*/
sandhi.prototype.split = function(samasa) {
    var res = [];
    var marks = makeMarkList(samasa);
    mark2sandhi(marks);
    fake2sandhi(marks); // FIXME: только для отладки комбинатора
    var list = fullMarkList(marks);
    // log(list)
    var combinations = u.combinator(list);
    combinations.forEach(function(comb) {
        var result = samasa;
        comb.forEach(function(mark) {
            result = replaceByPos(result, mark.pattern, mark.sandhi, mark.pos);
            res.push(result);
        });
    });
    var uniq = _.uniq(res);
    // log('SPLIT RESULT', uniq.length);
    return uniq;
}

sandhi.prototype.add = function(first, second) {
    var marks;
    log('===', Const.dirgha, Const.dirgha_ligas);
    sutras.forEach(function(sutra) {
        if (sutra.num == '') return;
        // if (sutra.num != '8.4.45') return;
        var mark = makeMarker(first, second);
        marks = marks || sutra.add(mark);
        // ======== ??? почему я маркер внутри сутры делаю?
    });

    // FIXME: makeAddResult(mark) попросту перенести в первый цикл
    if (!marks) return;
    var res = [];
    marks.forEach(function(mark) {
        var samasa = makeAddResult(mark)
        res.push(samasa);
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
        marker = {first: first, fin: fin, vir: vir, second: second, beg: beg};
        marker.type = 'cons';
        if (vir) marker.vir = true;
        if (candra) marker.candra = true;
    } else if (u.c(Cons.dirgha_ligas, fin)) {
        // нужно - гласная, краткая и длинная и подобная гласная
        log('тут будет создание маркера гласной долгой')
    }
    return marker;
}

function makeAddResult(test) {
    if (u.c(Const.allvowels, test.beg)) {
        test.second.shift();
        liga = Const.vow2liga[test.beg];
        test.second.unshift(liga);
        test.vir = false;
    }
    var conc = (test.conc) ? ' ' : '';
    test.first.push(test.end);
    if (test.vir) test.first.push(Const.virama);
    return [test.first.join(''), test.second.join('')].join(conc);
}
