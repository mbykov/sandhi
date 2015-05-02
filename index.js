/*
  node.js and component
*/

var util = require('util');
// var typeOf = require('typeof');
// var shiva = require('mbykov/shiva-sutras');
// var shiva = require('shiva-sutras');
var Const = require('./lib/const');
var u = require('./lib/utils');
var vowRules = require('./lib/vowel_rule');
var consRules = require('./lib/cons_rules');
var delConsRules = require('./lib/del_cons_rules');
var sutras = require('./lib/markers');
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


function makeMarkList(samasa) {
    var marks = [];
    var arr = samasa.split('');
    var idx = 0;
    arr.forEach(function(letter, i) {
        if (u.c(Const.special, letter)) return;
        var mark;
        var next1 = arr[i+1];
        var next2 = arr[i+2];
        if (!next1 || !next2) return;
        if (u.c(Const.hal, letter) && (next1 == Const.virama) && u.c(Const.hal, next2)) {
            var pattern = [letter, Const.virama, next2].join('');
            mark = {type: 'cons', pattern: pattern, fin: letter, beg: next2, idx: idx, pos: i};
            // mark = {type: 'cons', mark: pattern, idx: idx, pos: i};
            idx++;
            marks.push(mark);
        }
    });
    return marks;
}

// http://codereview.stackexchange.com/questions/7001/generating-all-combinations-of-an-array
function combinator(arr) {
    var fn = function(active, rest, a) {
        if (active.length==0 && rest.length==0)
            return;
        if (rest.length==0) {
            a.push(active);
        } else {
            fn(active.concat(rest[0]), rest.slice(1), a);
            fn(active, rest.slice(1), a);
        }
        return a;
    }
    return fn([], arr, []);
}

function mark2sandhi(marks) {
    var sandhi = {};
    marks.forEach(function(mark) {
        sutras.forEach(function(sutra) {
            if (sutra.num == '') return;
            // if (sutra.num != '8.4.45') return;
            var sandhis = sutra.split(mark);
            if (!sandhis) return;
            mark.sandhis = sandhis;
        });
    });
}

function replaceByPos(samasa, pattern, sandhi, pos) {
    // log('==== SANDHI', sandhi);
    var first = samasa.slice(0, pos);
    var second = samasa.slice(pos);
    // log('===', first, second, sandhi)
    var result = second.replace(pattern, sandhi);
    return [first, result].join('');
}


/**/
sandhi.prototype.split = function(samasa) {
    var res = [];
    var marks = makeMarkList(samasa);
    mark2sandhi(marks);

    // log(combinator('abcd'.split('')));
    var combis = combinator(marks);
    combis.forEach(function(comb) {
        var result = samasa;
        comb.forEach(function(mark) {
            mark.sandhis.forEach(function(sandhi) {
                result = replaceByPos(samasa, mark.pattern, sandhi, mark.pos);
                res.push(result);
                // FIXME: - тут фигня, д.б. накопление замен на каждый маркер
            });
        });
    });

    // log('SPLIT RESULT', res);
    return res;
}

sandhi.prototype.add = function(first, second) {
    var marks;
    sutras.forEach(function(sutra) {
        if (sutra.num == '') return;
        // if (sutra.num != '8.4.45') return;
        var mark = makeTest(first, second);
        marks = marks || sutra.add(mark);
    });
    if (!marks) return;
    var res = [];
    marks.forEach(function(mark) {
        var samasa = makeAddResult(mark)
        res.push(samasa);
    });
    return res;
}

// result - samasa бессмысленна для del()
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

function makeTest(f, s) {
    var first = f.split('');
    var second = s.split('');
    var fin = first.slice(-1)[0];
    var beg = second[0];
    var vir = false;
    if (fin == Const.virama) {
        first.pop();
        fin = first.slice(-1)[0];
        vir = true;
    }
    // var pattern = (vir) ? [fin, Const.virama, beg].join('') : [fin, beg].join('');
    return {first: first, fin: fin, vir: vir, second: second, beg: beg};
}

sandhi.prototype.del = function(samasa, second) {
    var result;
    var res, test;
    delConsRules.forEach(function(rule) {
        test = makeDelTest(samasa, second);
        res = rule.method(test);
        if (res) result = makeResult(res);
    });
    // log('DELETE RESULT', result);
    return result; // RES у меня - всегда ОДНА пара first + second ?
}

function makeDelTest(samasa, second, beg) {
    var suff, pref;
    var arr = samasa.split(second);
    if (arr.length == 1) {
        // second is in changed form, remove beginning
        beg = second[0];
        // log('MAKE', beg)
        second = second.substr(1);
        return makeDelTest(samasa, second, beg);
    } else if (arr.length > 0) {
        if (arr[0] == '') pref = true;
        else if (arr.slice(-1) == '') suff = true;
    } else {
        return log('CAN NOT BE');
    }

    var test = {samasa: samasa.split('')};
    if (suff) {
        var re = new RegExp(second + '$');
        var first = samasa.replace(re, '');
        test.first = first.split('');
        if (beg) beg = test.first.pop();
        test.fin = test.first.slice(-1)[0];
        if (test.fin == Const.virama) {
            test.first.pop();
            test.fin = test.first.slice(-1)[0];
            test.vir = true;
        }
        if (test.fin == Const.candra) {
            test.first.pop();
            test.fin = test.first.slice(-1)[0];
            test.candra = true;
        }
        test.second = second.split('');
        if (beg) {
            test.beg = beg;
            test.sec = test.second[0]; // 0 - cause test.second already shifted
        } else {
            test.beg = test.second[0];
            test.sec = test.second[1];
        }
        test.suff = true;
    }
    return test;
}


/*

*/
sandhi.prototype.add__ = function(arr) {
    var results = [];
    consRules.forEach(function(rule) {
        var test = makeTest(arr);
        var res = rule.method(test);
        if (res) results = res;
    });
    // FIXME: вынести в coalesce ?
    results = results.map(function(test) {
        // return makeResult(test);
        if (u.c(Const.allvowels, test.beg)) {
            test.second.shift();
            liga = Const.vow2liga[test.beg];
            test.second.unshift(liga);
            test.vir = false;
        }
        if (test.vir) test.first.push(Const.virama);
        var conc = (test.conc) ? '' : ' ';
        return [test.first.join(''), test.second.join('')].join(conc);
    });
    // log('R=>', results.map(function(r) { return JSON.stringify(r.split(''))}));
    return results;
}

function makeTest_old_(arr) {
    var first = arr[0].split('');
    var second = arr[1].split('');
    var fin = first.slice(-1)[0];
    var beg = second[0];
    var vir = false;
    if (fin == Const.virama) {
        first.pop();
        fin = first.slice(-1)[0];
        vir = true;
    }
    return {first: first, fin: fin, vir: vir, second: second, beg: beg, conc: true};
}

function p(sutra, test) {
    console.log('=>', sutra, JSON.stringify(test));
}

sandhi.prototype.add_ = function(test) {
    // var test = {first: a.split(''), fin: a.slice(-1), second: b.split(''), beg: b[0]};

    // // FIXME: определение типа теста - vowel - или согласная, или лига, или долгая лига
    // var type = (u.c(Const.consonants, test.fin) && u.c(Const.fullVowels, test.beg)) ? true : false;
    // log('=====TEST====', JSON.stringify(test));
    // test.vtype = true;

    // var vow_rules = vowRules;

    // var first = test[0].split('');
    // var second = test[1].split('');
    // var only = test[2];
    // var fin = first.slice(-1)[0];
    // var matra = Const.liga2vow[fin] ||fin; // only one vowel
    // var results = []; // FIXME: пока что накопитель тут не нужен - неск решений дает сам метод при ोपतिोनाल

    // var test, res;
    // for (var name in vow_rules) {
    //     var t = {first: first, fin: fin, matra: matra, second: second, beg: second[0], only: only};
    //     var rule = vow_rules[name];
    //     // log('ONLY', only, rule.id, rule.sutra);
    //     var res = rule.method(t);
    //     if (!res) continue;
    //     results = results.concat(res);
    // }

    /*
      короче, выходит, нужно все переделать. Сутра должна выполнять только то, что в сутре, и возвращать обе части - с пометкой - сливать-не-сливать
      либо возвращить optional вариант. Т.е. метод в сутре
      а на выходе - слить все
     */

    var test, res;
    var first, second, only, fin, beg, matra, vir;

    first = test[0].split('');
    second = test[1].split('');
    only = test[2];
    fin = first.slice(-1)[0];
    if (fin == Const.virama) {
        first.pop();
        fin = first.slice(-1)[0];
        vir: true;
    }

    consRules.forEach(function(rule) {
        var t = {first: first, fin: fin,  second: second, beg: second[0], only: only, vir: vir};
        // log('R test', t);
        var res = rule.method(t);
        // log('r=>', res);
        // тут стратегии - либо накопитель, либо тест затирает предыдущий
        if (res) results = [res];
        // if (!res) return;
        // results = results.concat(res);
    });
    // log('R=>', results.map(function(r) { return r.split('')}));
    return results;
}
