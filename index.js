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
var salita = require('salita-component'); // FIXME: это нужно убрать


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
        // if (i < 1) return;
        if (i > samasa.length - 1) return;
        var mark, pattern, size;
        var prev = arr[i-1];
        var next1 = arr[i+1];
        var next2 = arr[i+2];
        var next3 = arr[i+3];
        var next4 = arr[i+4];

        // === SPLIT FILTER CONSONANT ===

        // class consonant followed by (nasal) optionally changes to the nasal of class, or less commonly for class hard consonants, changes to 3rd consonant of class
        if ((u.c(Const.nasals, sym) || u.c(Const.class3, sym))&& next1 == Const.virama && u.c(Const.nm, next2)) { // Nay - nas + hard+soft
            var pattern = [sym, Const.virama, next2].join('');
            var mark = {num: '8.4.45', pattern: pattern, fin: sym, beg: next2, idx: i, pos: i};
            marks.push(mark);
            // log('M cons nasal', i, 'mark', mark);
        }

        // dental class consonant followed by a palatal class consonant changes to the corresponding palatal ===> reverse: doubled palatal
        if (u.c(u.palatal(), sym) && next1 == Const.virama && u.c(u.palatal(), next2)) {
            var pattern = [sym, Const.virama, next2].join('');
            var mark = {num: '8.4.40', pattern: pattern, fin: sym, beg: next2, idx: i, pos: i};
            marks.push(mark);
            // log('M cons palatal', i, 'mark', mark);
        }

        // dental class consonant followed by a cerebral class consonant changes to the corresponding cerebral ===> reverse: doubled cerebral
        if (u.c(Const.cerebral, sym) && next1 == Const.virama && u.c(Const.cerebral, next2)) {
            var pattern = [sym, Const.virama, next2].join('');
            var mark = {num: '8.4.41', pattern: pattern, fin: sym, beg: next2, idx: i, pos: i};
            marks.push(mark);
            // log('M cons cerebral', i, 'mark', mark);
        }

        // If n is followed by l, then n is replaced by nasal l. If a dental other than n and s is followed by l, then the dental is replaced by l.
        if ('ल' == sym && next1 == Const.virama && 'ल' == next2) {
            var pattern = [sym, Const.virama, next2].join('');
            var mark = {num: '8.4.60', pattern: pattern, fin: sym, beg: next2, idx: i, pos: i};
            marks.push(mark);
            // log('M cons L', i, 'mark', mark);
        } else if ('ल' == sym && next1 == Const.candra && next2 == Const.virama && 'ल' == next3) {
            var pattern = [sym, Const.candra, Const.virama, next3].join('');
            var mark = {num: '8.4.60', pattern: pattern, fin: sym, beg: next2, candra: true, idx: i, pos: i};
            marks.push(mark);
            // log('M cons L-candra', i, 'mark', mark);
        }

        // m,n to anusvara or nasal + cons of class of that nasal; reverse: anusvara to nasal
        // 8.3.23 AND 8.4.58 for splitting
        // .58 - middle of a word - INTERNAL
        // FIXME: TODO: еще случай - в common 'mM'
        if ((sym == Const.anusvara && u.c(Const.hal, next1)) || u.c(Const.nasals, sym) && next1 == Const.virama && u.eqvarga(sym, next2)) {
            if (next1 == Const.virama) {
                // 8.3.23 пересекается с common - split при i+2 - просто раздвигает в месте pos=i
                var pattern = [sym, Const.virama].join('');
                var beg = next2;
            } else {
                var pattern = sym;
                var beg = next1;
            }
            var mark = {num: '8.3.23', pattern: pattern, fin: sym, beg: beg, idx: i, pos: i};
            marks.push(mark);
            // log('M cons N,M', i, 'mark', mark);
        }

        //ङ्, ण्, न् at the end of a word after a short vowel doubles itself when followed by a vowel',
        if (prev && sym == next2 && u.vowshort(prev) && u.c(Const.Nam, sym) && next1 == Const.virama && u.vowsound(next3)) {
            var pattern = [sym, Const.virama, sym, next3].join('');
            var mark = {num: 'nasals-doubled', pattern: pattern, fin: sym, beg: next3, idx: i, pos: i};
            marks.push(mark);
            // log('M cons cerebral', i, 'mark', mark, 0, sym, 1, next1, 3, next3, 4, next4, Const.Nam, samasa); // प्रत्यङ्ङात्मा
        }

        // //ङ्, ण्, न् at the end of a word after a short vowel doubles itself when followed by a vowel',
        // if (next1 && next4 && next1 == next3 && u.vowshort(sym) && u.c(Const.Nam, next1) && next2 == Const.virama && u.c(Const.allligas, next4)) {
        //     var pattern = [next1, Const.virama, next3, next4].join('');
        //     var mark = {num: 'nasals-doubled', pattern: pattern, fin: next1, beg: next4, idx: i, pos: i+1};
        //     marks.push(mark);
        //     // log('M cons cerebral', i, 'mark', mark, 0, sym, 1, next1, 3, next3, 4, next4, Const.Nam, samasa); // प्रत्यङ्ङात्मा
        // }


        // soft consonant except nasal, followed by a hard consonant changes to 1st consonant of class = > reverse: class1+hard
        // однако, тут в словаре-то м.б. только ट,त,क,प - k t ṭ p - 1st class ex. c.
        // следовательно, просто не преобразовывать
        // звонкие - только в результате склонения / спряжения
        // но правило для add, есст., должно быть
        // if (u.c(Const.cay, sym) && next1 == Const.virama && u.c(Const.Kar, next2) ) {
        //     var pattern = [sym, Const.virama].join('');
        //     var mark = {num: '8.4.55', pattern: pattern, fin: sym, beg: next2, idx: i, pos: i};
        //     marks.push(mark);
        //     // log('M soft before hard', i, 'mark', sym);
        // }

        // hard consonant followed by a soft consonant but nasal or vow. changes to the third of its class => reverse: class3 + soft but nasal or vowels
        if (u.c(Const.jaS, sym) && next1 == Const.virama && u.c(Const.haS, next2) && !u.c(Const.Yam, next2) ) {
            var pattern = [sym, Const.virama].join('');
            var mark = {num: '8.2.39', pattern: pattern, fin: sym, beg: next2, idx: i, pos: i};
            marks.push(mark);
            // log('M hard before soft cons', i, 'mark', sym, next1, next2);
        } else if (u.c(Const.jaS, sym) && u.c(Const.allligas, next1)) {
            var pattern = [sym, next1].join('');
            var mark = {num: '8.2.39', pattern: pattern, fin: sym, beg: next1, idx: i, pos: i};
            marks.push(mark);
            // log('M hard before vows', i, 'mark', sym, next1, next2);
        }

        // log('m consonants', i, 'sym', sym, 1, next1, 2, next2);


        // === VOWEL ===
        // simple vowel, followed by a similar vowel => dirgha
        if (u.c(Const.dirgha_ligas, sym)) { // FIXME: проверить !la - на la-liga нет теста
            var mark = {type: 'vowel', num: '6.1.101', pattern: sym, idx: i, pos: i};
            marks.push(mark);
            // log('M vow dirgha', i, 'mark', mark);
        }

        // a or ā is followed by simple ->  guna; reverse: guna = a+simple
        if (u.vowsound(prev) && u.c(Const.gunas, u.vowel(sym))) {
            var mark = {num: '6.1.87', pattern: sym, idx: i, pos: i};
            marks.push(mark);
            // log('M vow guna', i, 'mark', mark);
        } else if (u.vowsound(prev) && (sym == 'र' || sym == 'ल') && next1 == Const.virama) {
            var pattern = [sym, Const.virama].join('');
            var mark = {num: '6.1.87', pattern: pattern, idx: i, pos: i};
            marks.push(mark);
            // log('M vow guna RL', i, 'mark', mark);
        }

        // a or ā is followed by e, o, ai or au - vriddhi
        if (u.c(Const.vriddhis, u.vowel(sym))) {
            var mark = {num: '6.1.88', pattern: sym, idx: i, pos: i};
            marks.push(mark);
            // log('M vow 88 vriddhi', i, 'mark', mark);
        }

        // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel (+virama); yana-sandhi; reverse: semi-vow = simple + dissimilar
        if (sym == Const.virama && u.c(Const.yaR, next1) && next2 != Const.virama) {
            // 6.1.77 yana = semi-vowels
            if (u.c(Const.allligas, next2)) {
                var pattern = [Const.virama, next1, next2].join('');
            } else {
                var pattern = [Const.virama, next1].join('');
            }
            var mark = {num: '6.1.77', pattern: pattern, beg: next2, idx: i, pos: i, comm: 'semi = simple + diss'};
            marks.push(mark);
            // log('M yana 77 ', i, 'mark', mark);
        }

        // 6.1.78 - ayadi-guna - e,o+vow-a => ay,av+vow-a (comp. 6.1.109); - ayadi-vriddhi - E,O+vow => Ay,Av+vow, if vow=aA - next=cons
        // reverse:
        if (prev == Const.A && u.c(Const.yava, sym)) { // E,O
            if (u.c(Const.allligas, next1)) {
                var pattern = [Const.A, sym, next1].join('');
            } else {
                var pattern = [Const.A, sym].join('');
            }
            var mark = {num: '6.1.78', pattern: pattern, beg: next1, idx: i, pos: i-1};
            marks.push(mark);
            // log('M ayadi-vriddhi 78 ', i, 'mark', mark);
            // FIME: TODO va-na - может крыться с common ?
        } else if (prev != Const.A && prev != Const.virama && u.c(Const.yava, sym) && u.c(Const.allligas, next1)) {
            var pattern = [sym, next1].join('');
            var mark = {num: '6.1.78', pattern: pattern, idx: i, pos: i};
            marks.push(mark);
            // log('M ayadi-guna-wo-a 78', i, 'mark', mark, 'sym', sym, 1, next1, 2, next2, sym != Const.virama);
        }

        // // 6.1.78 - ayadi-guna - e,o+vow-a => ay,av+vow-a (comp. 6.1.109); - ayadi-vriddhi - E,O+vow => Ay,Av+vow, if vow=aA - next=cons
        // // reverse:
        // if (sym == Const.A && u.c(Const.yava, next1)) { // E,O
        //     if (u.c(Const.allligas, next2)) {
        //         var pattern = [Const.A, next1, next2].join('');
        //     } else {
        //         var pattern = [Const.A, next1].join('');     //
        //     }
        //     var mark = {num: '6.1.78', pattern: pattern, beg: next2, idx: i, pos: i};
        //     marks.push(mark);
        //     // log('M ayadi-vriddhi 78 ', i, 'mark', mark);
        // } else if (sym != Const.A && sym != Const.virama && u.c(Const.yava, next1) && u.c(Const.allligas, next2)) {
        //     var pattern = [next1, next2].join('');
        //     var mark = {num: '6.1.78', pattern: pattern, idx: i, pos: i+1};
        //     marks.push(mark);
        //     // log('M ayadi-guna-wo-a 78', i, 'mark', mark, 'sym', sym, 1, next1, 2, next2, sym != Const.virama);
        // }

        // 6.1.109 - ayadi - e,o+a => avagraha
        if (sym == Const.avagraha) {
            var pattern = sym;
            var mark = {num: '6.1.109', pattern: pattern, idx: i, pos: i};
            marks.push(mark);
            // log('M vow ayadi-avagraha', i, 'mark:', mark);
        }

        // === VISARGA === only concatenated result

        // अ & visarga changes to ओ+avagraha when followed by अ
        if (u.c(Const.hal, prev) && sym == 'ो' && next1 == Const.avagraha) {
            pattern = [sym, Const.avagraha].join('');
            var mark = {type: 'visarga', num: 'visarga-ah-a', pattern: pattern, idx: i, pos: i};
            marks.push(mark);
            // log('M visarga', i, 'mark', mark);
        }

        if (u.c(Const.hal, prev) && sym == 'ो' && u.c(Const.haS, next1)) {
            pattern = sym;
            var mark = {type: 'visarga', num: 'visarga-ah-soft', pattern: pattern, idx: i, pos: i};
            marks.push(mark);
            // log('M visarga', i, 'mark', mark);
        }

        // D1. (visarga) changes to (श्) (p sb) when followed by (च् or छ्) (p hc).
        // ? vowsound обязательно?
        if (prev && u.vowsound(prev) && u.c(['श', 'ष', 'स'], sym) && next1 == Const.virama) {
            var pattern = [sym, Const.virama].join('');
            var mark = {type: 'visarga', num: 'visarga-hard-cons', pattern: pattern, idx: i, pos: i};
            marks.push(mark);
            // log('M visarga-Sc', i, 'mark', mark);
        }

        //  =R= visarga after any vowel except अ or आ changes to र् when followed by a vowel or soft consonant except र्; reverse: simple-r-soft-r 2 visarga + vow or soft
        // C2. (अ & visarga) standing for अर् changes to अर् when followed by a (vowel or soft consonant except र्)
        // if (u.c(Const.allsimpleligas, prev) && sym == 'र') {
        // ====================================== SOFT-r OR VOWEL
        // if (u.vowsound(prev) && sym == 'र' && (u.c(Const.allligas, next1) || next1 == Const.virama &&  (u.c(Const.yaS, next2) && next2 != 'र') )) {
        if (prev && u.vowsound(prev) && sym == 'र') {
            if (u.c(Const.allligas, next1)) {
                var pattern = ['र', next1].join('');
                var beg = next1;
            } else if (next1 == Const.virama && (u.c(Const.yaS, next2) && next2 != 'र')) {
                var pattern = ['र', Const.virama].join('');
                var beg = next2;
            } else if (u.c(Const.hal, next1)) { // a-vowel
                var pattern = sym; // 'र'
                var beg = next1;
            }
            if (pattern) {
                var mark = {num: 'visarga-r', pattern: pattern, beg: beg, idx: i, pos: i};
                marks.push(mark);
            }
            // log('M visarga-r', i, 'mark', mark, 'patt', pattern);
        }

        // var next = (next1 == Const.virama) ? next2 : next1; // TODO: кажется, это спсоб упростить все
        // zero: отсутствие маркера - тем не менее, разбиение м.б. - FIXME: сразу здесь прописать ВСЕ условия
        // if (!mark || mark.num == '6.1.87' || mark.num == 'visarga-r') {
        if (true) {
            if (sym == Const.virama || !next1) return;
            // FIXME: а sym тут, что, любой?
            var mark = {num: '0', idx: i, pos: i};
            if (next2 && next1 == Const.virama) {
                mark.pattern = [sym, Const.virama, next2].join('');
                mark.sandhi = [sym, Const.virama, ' ', next2].join('');
            } else if (u.c(Const.allligas, next1)) {
                mark.pattern = [sym, next1].join('');
                mark.sandhi = [sym, Const.virama, ' ', u.vowel(next1)].join('');
                // log('============= vow zero sandhi', i, sym, next1, u.vowel(next1), mark.sandhi);
            } else if (u.c(Const.hal, next1)) {
                mark.pattern = [sym, next1].join('');
                mark.sandhi = [sym, ' ', next1].join('');
                // log('============= cons zero sandhi ?', i, sym, next1);
                if (u.c(Const.hal, sym)) {
                    // log('HA', i, sym, u.soft2hard(sym));
                    // FIXME: всегда оглушать попросту, или 4-cons?
                    var odd = JSON.parse(JSON.stringify(mark));
                    odd.sandhi = [u.soft2hard(sym), Const.virama, ' अ', next1].join('');
                    odd.type = 'odd cons';
                    marks.push(odd);
                    // log('============= two const zero sandhi ?', i, sym, next1);
                    // ЭТО: НЕ НУЖНО, на пред. шаге - конс+лига
                    // } else if (u.c(Const.allligas, sym)) {
                    // return; ???
                }
            } else if (next1 == Const.visarga) {
                // log('VISARGA?', i, sym, next1, next2); // FIXME:
            } else if (next1 == Const.anusvara) {
                // log('ANUSVARA?', i, sym, 1, next1, 2, next2); // pattern mM -> m aM
                // mark.pattern = next1;
                // mark.sandhi = [Const.virama, ' अ', Const.anusvara].join('');
                if (u.c(Const.hal, sym)) {
                    mark.pattern = [sym, Const.anusvara].join('');
                    mark.sandhi = [u.soft2hard(sym), Const.virama, ' अ', Const.anusvara].join('');
                }
            } else {
                // log('WHAT?', i, sym, 1, next1, 2, next2); // FIXME:
            }
            // log(1, i, mark.sandhi);
            if (checkResult(mark)) marks.push(mark);
            // if (mark.pattern) marks.push(mark);
        }
        idx++;

        // log('SYM', i, sym, next1, next2, u.c(Const.JaS, next2), Const.JaS );
    });
    // log('splitting marks', marks);
    return marks;
}

/*
  A complete word may begin with any vowels or consonants except ॠ, ऌ, ङ्, ञ्, ण्, anusvara and visarga.
  A complete word may end with any vowel except ॠ and ऌ.
  A complete word should end in one of the consonants - क्, ट्, त्, प्, ङ्, ण्, न्, म्, ल् or visarga.
*/
function checkResult(mark) {
    if (!mark.pattern) return false;
    var result = true;
    var words = mark.sandhi.split(' ');
    var fin = words[0][0];
    var vir = (words[0][1] && words[0][1] == Const.virama) ? true : false;
    var beg = words[1];

    if (u.c(['ॠ', 'ऌ', 'ङ', 'ञ', 'ण'].concat(Const.special), beg)) {
        // log('== ERROR_BEG ==========', 'f:', fin, 'b:', 'm:', beg, mark);
        result = false;
    }

    if (u.c(Const.allligas, fin)) {
        if (u.c(['ॠ', 'ऌ'], u.vowel(fin))) {
            // log('== ERROR_VOW_FIN ==========', 'f:', fin, 'b:', 'm:', beg, mark);
            result = false;
        }
    } else {
        if (vir && !u.c(['क', 'ट', 'त', 'प', 'ङ', 'ण', 'न', 'म', 'ल', 'र', Const.visarga], fin)) { // added 'र'
            // log('== ERROR_CONS_FIN==========', 'fin:', fin, 'beg:', beg, mark);
            result = false;
        }
    }
    // log(1, first, 2, last);
    return result;
}

// function checkResultSTR_(result) {
//     var words = result.split(' ');
//     words.forEach(function(word) {
//         var first = word[0];
//         var last = word.slice(-1);
//         if (last == Const.virama) last = word.slice(-2,-1);
//         if (u.c(['ॠ', 'ऌ', 'ङ', 'ञ', 'ण'].concat(Const.special), first)) {
//             log('== ERROR ==========', first, last);
//         }
//         // log(1, first, 2, last);
//     });
// }

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

    // FIXME: NOW: spaced нужно проверять и в gita-test, но там нет next
    // или это правило final-sandhi попросту работает всегда?
    if (u.vowel(fin) == 'ओ' && !next) {
        first.pop();
        first.push(Const.visarga);
    }

    if (fin == Const.anusvara) {
        first.pop();
        first.push('म्');
    }

    // // FIXME: WTF:?
    // if (u.endsaA(samasa) && u.startsaA(next)) {
    // }

    // =before=
    // anusvara - см. .23
    //
    // анусвара в конце слова - заменяется на m в before-filtre?
    // а это вообще может быть в реальном тексте?
    //

    var result = first.join('');
    // first.forEach(function(sym, i) {
    //     var next1 = first[i+1];
    //     var next2 = first[i+2];
    //     if (u.c(Const.nasals, sym) && next1 == Const.virama && u.eqvarga(sym, next2)) {
    //         log(1, sym, next1, next2)
    //         var pattern = [sym, Const.virama].join('');
    //         result = samasa.replace(pattern, Const.anusvara);
    //     }
    // });
    // log('R', result)
    return result;
}




/*
    FIXME: здесь нужно выделить слова, т.е. пробелы и спец. символы - конец строки
*/
sandhi.prototype.split = function(str) {
    var splits = {};
    var samasas = str.split(' ');
    samasas.forEach(function(samasa, idx) {
        var next = samasas[idx+1] || '';
        // var spaced = (next) ? spacedSplit(samasa, next) : samasa;
        var spaced = spacedSplit(samasa, next);
        // log(1, spaced, 'next', next);
        splits[samasa] = splitone(spaced);
        if (samasa != spaced) splits[samasa].unshift(spaced);
    });
    return splits;
}

function mark2sandhi(marks) {
    var list = [];
    marks.forEach(function(mark) {
        var sutra = vowRules[mark.num] || consRules[mark.num] || visRules[mark.num];
        if (!sutra) {
            var m = JSON.parse(JSON.stringify(mark));
            list.push(m);
            return; // common method, zero sandhi
        }
        var sandhis = sutra.split(mark);
        // log('S', sandhis, mark.num);
        sandhis.forEach(function(sandhi) {
            var m = JSON.parse(JSON.stringify(mark));
            m.sandhi = sandhi;
            // if (checkResult(m)) list.push(m); // похоже, не нужно, здесь все ок по-образованию sandhi-замены, впрочем хз пока
            list.push(m);
        });
    });
    return list;
}

function correct(combs, samasa) {
    var cleans = [];
    // log(combs);
    combs.forEach(function(comb, idx) {
        if (comb.length < 3) cleans.push(comb);
    });
    return cleans;
}

/*
  make test g=4.41.+7.+split // देह + आविष्ट - देहाविष्ट
*/
// sandhi.prototype.splitone = function(samasa) {
function splitone(samasa) {
    var res = [];
    var marks = makeMarkerList(samasa);
    if (marks.length == 0) return []; // log('==no_markers!!!=='); // FIXME: этого не должно быть
    // marks = XX_.select(marks, function(m) { return m.num != '6.1.87'}); // FIXME: ==FILTER== // रविरुदेति

    // log('==marks==', marks.map(function(m) { return JSON.stringify(m).split('"').join('')}));

    var list = mark2sandhi(marks);
    // log('==list==', list.map(function(m) { return JSON.stringify(m)}));
    var combs = u.combinator(list, samasa);

    // combs = correct(combs, samasa);
    if (combs.length > 100) log('==combs.size== marks:', marks.length, 'list:', list.length, 'combs:', combs.length)

    combs.forEach(function(comb, idx) {
        var result = samasa;
        // с shift нужно разобраться, оно еще может аукнуться
        var shift = 0;
        // log(comb.length);
        // log('==comb==', idx, comb.map(function(m) { return JSON.stringify(m)}));
        // FIXME: это можно сделать эффективнее, если запоминать регионы и потом их только складывать для каждой комбинации, но не делать одинаковые замены
        comb.forEach(function(mark) {
            // log('M', idx, 'M', mark);
            // log('MARK.POS', mark.pos);
            // log('SHIFT', shift);
            var pos = mark.pos + shift;
            // log('POS', pos);
            // var second = result.slice(pos);
            // log('SEC', second);
            // log('result1', result, mark.sandhi.length, mark.pattern.length);
            // var old = result;
            result = u.replaceByPos(result, mark.pattern, mark.sandhi, pos); // योक् युत्तम
            // log('result2', result, mark.sandhi.length, mark.pattern.length);
            // if (mark.pos == 7) log('====>', result);
            // log('R', result);
            shift = mark.sandhi.length - mark.pattern.length;

            // log('SH1', shift);
            // if (old == result && mark.num != '8.3.23') { //  old == result ; idx == 27
            //     // log('==comb==', idx, comb.map(function(m) { return JSON.stringify(m)})); // गुरोऽङ्ग्ध //
            //     log('M', idx, 'M', mark);
            //     log('old', old == result, idx, old, result);
            // }
        });
        if (result != samasa) res.push(result); // FIXME: этого неравенства не должно быть, все маркеры должны давать замену, причем уникальную

        // checkResult(result);
        // if (result != samasa) log(result);

        // log('=R=', (res.length == _.uniq(res).length), idx);
    });
    // log('res:', res); //
    var uniq = _.uniq(res);
    // if (res.length != uniq.length) log('NOT UNIQ! SPLIT results:', res.length, 'uniq:', uniq.length, 'combs:', combs.length); // भानूदयः
    // log('SPLIT=> URES', uniq);

    // FIXME: это выбросить после исправления коротких тестов на анусвару в середине слова - если исправлять
    // нужно посмотреть, что в словаре MW - есть там n-in-a-middle, или всегда анусвара?
    // m,n на анусвару - в начале, а здесь - заменить анусвару на m? <==============
    // И ВООБЩЕ СОМНИТЕЛЬНАЯ ВЕЩЬ:

    res = anusvaraInMiddle(samasa, uniq);
    // log('RES ANUSVARA', uniq);
    res = uniq;

    // FIX:
    // [ 'मलयजपवनेन', 'मलय ज पवनेन' ],
    // var x = 'ज';
    // var concat = res.join(' ').split(' ');
    // log('FIX:', u.c(concat, x));

    return res;
}


// after-split anusvara-optional
function anusvaraInMiddle(samasa, arr) {
    var res = [];
    arr.forEach(function(vigraha) {
        // FIXME: нужно менять все носовые нарастающим итогом
        Const.nasals.forEach(function(n) {
            var nv = [n, Const.virama].join('');
            var re = new RegExp(nv + '([^ $])', 'g');
            var replaced = vigraha.replace(re, Const.anusvara+'$1');
            if (replaced != vigraha) arr.push(replaced) ;
        });
    });
    // odd method only for gita-govindam tests:
    Const.nasals.forEach(function(n) {
        var re = new RegExp(n + Const.virama);
        var replaced = samasa.replace(re, Const.anusvara);
        if (replaced != samasa) arr.push(replaced) ;
    });
    return arr;
}


// ============= DELETE ==================

/*
  разрезаю samasa - получаю пару first-second. Второе слово может менять первую букву
  методы cut() и del()
  del() возвращает пару first-second, cut() возвращает first
*/
sandhi.prototype.del = function(samasa, second) {
    var marker = delMarker(samasa, second);

    // simple vowel, followed by a similar vowel => dirgha
    if (u.c(Const.dirgha, u.vowel(marker.pattern))) marker.num = '6.1.101';
    // a or ā is followed by simple ->  guna; reverse: guna = a+simple
    if (u.vowsound(marker.fin) && u.c(Const.gunas, u.vowel(marker.pattern))) marker.num = '6.1.87';
    if ((marker.fin == 'र' || marker.fin == 'ल') && marker.pattern == Const.virama) marker.num = '6.1.87';
    // a or ā is followed by e, o, ai or au - vriddhi
    if (u.c(Const.vriddhis, u.vowel(marker.pattern))) marker.num = '6.1.88';
    // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel (+virama); yana-sandhi; reverse: semi-vow = simple + dissimilar
    if (marker.pen == Const.virama && u.c(Const.yaR, marker.fin) && u.c(Const.allligas, marker.pattern) && !u.similar(u.base(marker.fin), marker.beg)) marker.num = '6.1.77';
    if (u.c(Const.yaR, marker.pattern) && marker.fin == Const.virama && u.c(Const.aA, marker.beg)) marker.num = '6.1.77';

    // diphthong followed by any vowel (e,o vow-a), including itself, changes to its semi-vowel equivalent - external - optional
    else if (u.c(Const.yaR, marker.pattern)) marker.num = '6.1.78';

    // log('DEL-marker', marker, u.c(Const.yaR, marker.fin));

    var sutra = vowRules[marker.num] || consRules[marker.num] || visRules[marker.num];
    var cutted = sutra.del(marker);

    // log('DEL=> RES', cutted);
    return cutted;
}

/*

*/
function delMarker(samasa, second) {
    var spart = second.slice(1);
    var re = new RegExp(spart + '$');
    var fpart = samasa.replace(re, '');
    samasa = samasa.split('');
    var first = fpart.split('');
    second = second.split('');
    var beg = second[0];
    // var fin = first.slice(-1)[0];
    // if (u.c(Const.consonants, fin)) fin = '';
    var pattern = first.slice(-1)[0];
    var fin = first.slice(-2)[0];
    var penult = first.slice(-3)[0];
    var pos = first.length-1;
    var marker = {type: 'vowel', first: first, second: second, fin: fin, pattern: pattern, pen: penult, beg: beg, pos: pos};
    // log(marker)
    return marker;
}


// будущий cutMarker:
// if (typeof second == "number") {
//     pos = second; // = 3;
//     pattern = samasa.slice(pos)[0];
//     beg = samasa.slice(pos)[1];
//     // fin = samasa.slice(pos-1).slice(-1)[0];
//     fin = samasa.slice(0, pos).slice(-1)[0];
//     log('S', samasa, pos, 'f', fin, 'p', pattern, 'b', beg);
// }


function delVowFilter(first, ssecond) {
}




// ============ ADD ==========

function markerTemplate(first, second) {
    var first = first.split('');
    var second = second.split('');
    var fin = first.slice(-1)[0];
    if (u.c(Const.consonants, fin)) fin = '';
    var penult = first.slice(-2)[0];
    var beg = second[0];
    var marker;
    // Const.special ? candra всегда после вирамы? Что остальные?
    if (fin == Const.virama) { //  && u.c(Const.hal, beg)
        var vir = false;
        var candra = false;
        if (fin == Const.virama) {
            first.pop();
            fin = first.slice(-1)[0];
            penult = first.slice(-2)[0];
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
        marker = {type: 'vowel', first: first, fin: fin, second: second, beg: beg};
    } else if (fin == Const.visarga) {
        var ah = u.c(Const.hal, penult);
        var aah = Const.A == penult;
        marker = {type: 'visarga', first: first, fin: fin, second: second, beg: beg};
    }
    // log('ADD=', marker);
    return marker;
}

sandhi.prototype.add = function(first, second) {
    var marker = markerTemplate(first, second);
    switch (marker.type) {
    case 'vowel':
        addVowelFilter(marker);
        break;
    }
    // log('ADD TEMPLATE',marker);

    // marker = addFilter_(first, second);
    // log('ADD TEMPLATE',marker);

    var sutra = vowRules[marker.num] || consRules[marker.num] || visRules[marker.num];
    if (!sutra) return; // FIXME: не должно быть
    var markers = sutra.add(marker);
    // log('ADD=> RES', res);
    return markers.map(function(m) { return addResult(m)});
}

function addVowelFilter(marker) {
    var fin = marker.fin;
    var penult = marker.penult;
    var beg = marker.beg;
    if (u.similar(fin, beg) || u.c(Const.aAliga, fin) && u.c(Const.aA, beg)) marker.num = '6.1.101';
    if (fin =='ृ' && beg == 'ऌ') marker.num = '6.1.101';
    if (u.c(Const.aAliga, fin) && u.c(Const.allsimples, beg)) marker.num = '6.1.87';
    if (u.c(Const.aAliga, fin) && u.c(Const.diphtongs, beg)) marker.num = '6.1.88';
    if (u.c(Const.allsimpleligas, fin) && u.c(Const.allvowels, beg) && !u.similar(fin, beg)) marker.num = '6.1.77';
    if (u.c(Const.allsimpleligas, fin) && u.c(Const.diphtongs, beg)) marker.num = '6.1.77';
    // 6.1.78 - ayadi-guna - e,o+vow-a => ay,av+vow-a (comp. 6.1.109); - ayadi-vriddhi - E,O+vow => Ay,Av+vow, if vow=aA - next=cons
    // if (u.c(Const.diphtongs, u.vowel(fin)) && u.c(Const.allvowels, u.vowel(fin)) && !(u.c(Const.gunas, u.vowel(fin)) && beg =='अ')) marker.num = '6.1.78';
    // 6.1.78 - diphthong followed by any vowel (e,o vow-a), including itself, changes to its semi-vowel equivalent - external - optional
    if (u.c(Const.gunas, u.vowel(fin)) && beg != 'अ') marker.num = '6.1.78';
    // the same, vriddhis
    if (u.c(Const.vriddhis, u.vowel(fin)) && u.c(Const.allvowels, beg)) marker.num = '6.1.78';
    if (u.c(Const.gunas, u.vowel(fin)) && beg == 'अ') marker.num = '6.1.109';
    // log('ADD=', marker);
}

function addFilter_(f, s) {
    var first = f.split('');
    var second = s.split('');
    var fin = first.slice(-1)[0];
    if (u.c(Const.consonants, fin)) fin = '';
    var penult = first.slice(-2)[0];
    var beg = second[0];
    var marker;
    // Const.special ? candra всегда после вирамы? Что остальные?

    if (fin == Const.virama) { //  && u.c(Const.hal, beg)
        var vir = false;
        var candra = false;
        if (fin == Const.virama) {
            first.pop();
            fin = first.slice(-1)[0];
            penult = first.slice(-2)[0];
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
        // hard consonant followed by a soft consonant or vow. changes to the third of its class
        if (u.c(Const.Kay, fin) && (u.c(Const.allvowels, beg) || (u.c(Const.haS, beg) && !u.c(Const.Yam, beg)))) marker.num = '8.2.39';
        // soft consonant except nasal, followed by a hard consonant changes to 1st consonant of class = > reverse: class1+hard
        if (u.c(Const.haS, fin) && !u.c(Const.nasals, fin) && u.c(Const.Kar, beg)) marker.num = '8.4.55';
        // class consonant followed by (nasal) optionally changes to the nasal of class, or less commonly for class hard consonants, changes to 3rd consonant of class
        if (u.c(Const.Jay, fin) && u.c(Const.nm, beg)) marker.num = '8.4.45';
        // dental class consonant followed by a palatal class consonant changes to the corresponding palatal
        if (u.c(u.dental(), fin) && u.c(u.palatal(), beg)) marker.num = '8.4.40';
        // dental class consonant followed by a cerebral class consonant changes to the corresponding cerebral
        if (u.c(u.dental(), fin) && u.c(u.cerebral(), beg)) marker.num = '8.4.41';
        // If n is followed by l, then n is replaced by nasal l. If a dental other than n and s is followed by l, then the dental is replaced by l.
        if (u.c(u.dental(), fin) && beg == 'ल') marker.num = '8.4.60';
        // m,n to anusvara or nasal + cons of class of that nasal
        if (fin == 'म' && u.c(Const.hal, beg)) marker.num = '8.3.23';
        //ङ्, ण्, न् at the end of a word after a short vowel doubles itself when followed by a vowel',
        if (u.c(Const.Nam, fin) && u.vowshort(penult) && u.c(Const.allvowels, beg)) marker.num = 'cons-nasal-doubled';


        // FIXME: порядок имеет значение - 8.2.39 д.б. раньше 8.4.40

        // log('CONS ADD MARKER:', marker.num, 'fin:', fin, 'beg:', beg, Const.Yam);

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

    } else {
      marker = 'can not be'
    }
    // log('MARKER', marker, fin, beg);
    return marker;
}

function addResult(mark) {
    if (mark.type == 'cons' && u.c(Const.allvowels, mark.beg)) {
        mark.second.shift();
        var liga = u.liga(mark.beg);
        mark.second.unshift(liga);
        mark.vir = false;
    }
    var space = (mark.space) ? ' ' : '';
    if (mark.end) mark.first.push(mark.end);
    if (mark.vir) mark.first.push(Const.virama);
    return [mark.first.join(''), mark.second.join('')].join(space);
}
