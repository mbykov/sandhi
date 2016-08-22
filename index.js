/*
  npm module: .cut() - cutting samasa - returns pairs first-second; .add() - returns samasa
  здесь .del - это .cut, то есть в second с начальной гласной, она убирается
  это нужный модуль, для преобразования key2 в MW и для возможного splitter-cutter
  но убирать заранее известные freqs нужен .del, где гласная известна, а seconds всегда строка, а не массив
  NB: !
*/

// var _ = require('underscore');
// var util = require('util');
var c = require('./lib/const');
var bool = require('./lib/boolean');
var u = require('./lib/utils');
var inc = u.include;
var vowRules = require('./lib/vowel_sutras');
var visRules = require('./lib/visarga_sutras');
var consRules = require('./lib/cons_sutras');
var cutRules = require('./lib/cut_sutras');
// var sutras = require('./lib/cons_sutras');
var outer = require('./lib/outer');
var log = u.log;
var salita = require('salita-component'); // FIXME: убрать
var internal = require('./lib/internal');

var debug = (process.env.debug == 'true') ? true : false;

module.exports = {
    sandhi: sandhi(),
    outer: outer, // .run
    const: c,
    u: u
}

/*
  здесь .del - это .cut, то есть в second с начальной гласной она убирается
*/
function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

// если h,S - проверка: смотрим, нет-ли варианта G,C?, и, если есть, используем его
// для Om пригодится. А для c.S ?
function checkSecond(samasa, second) {
    var beg = u.first(second);
    var clean = second;
    if (!inc([c.h, c.S, c.oM], beg)) return second;
    var position = samasa.length - second.length;
    var sym = samasa[position];
    if (beg == c.h) {
        // return second;
        if (sym == c.h) return second;
        else if (sym == c.G) {
            return [c.G, u.wofirst(second)].join('');
        } else if (sym == c.D) {
            return [c.D, u.wofirst(second)].join('');
        }
    } else if (beg == c.S) {
        if (sym == c.S) return second;
        else if (sym == c.C) {
            return [c.C, u.wofirst(second)].join('');
        }
    } else if (beg == c.oM) {
        var om = samasa.substr(position-2, 2);
        if (om == 'ोङ') {
            return [om, c.virama, u.wofirst(second)].join('');
        }
    }
}

sandhi.prototype.del = function(samasa, second) {
    if (second == '') return [{pos: 0, num: 'cut', firsts: [samasa], seconds: []}];
    else if (samasa == second) return [{pos: 0, num: 'cut=', firsts: [], seconds: [samasa]}];

    // var cleanSecond  = second;
    var cleanSecond  = checkSecond(samasa, second);
    // log('second:', second, 'cleanSecond:', cleanSecond, cleanSecond == second);
    if (!cleanSecond) return;

    var beg = u.first(cleanSecond);
    if (u.isVowel(beg)) { // || beg == c.C
        if (samasa.slice(-(cleanSecond.length - 1)) != cleanSecond.slice(1)) return;
    } else if (samasa.slice(-cleanSecond.length) != cleanSecond) return;

    var o = options(samasa, cleanSecond, second);
    if (o.first == '') {
        return [{firsts: [o.mark], seconds: [second], sutra: 'only-vowel'}];
    }
    var sutras = getSutras(o);
    if (!sutras) throw new Error('no sutras' + o.salat);

    var cutted = [];
    sutras.forEach(function(sname) {
        var sutra = vowRules[sname] || consRules[sname] || visRules[sname] || cutRules[sname];
        var res = sutra.del(o);
        if (!res) return;
        var clean = possibleRes(res);
        if (!clean) return;
        clean.sutra = sname;
        if (debug) clean.sutra = sname;
        cutted.push(clean);
    });

    // if (debug) log('DEL=> RES', cutted);
    return cutted;
}

function getSutras(o) {
    var sutras = [];
    var b = bool(o);
    var lastThree = o.first.slice(-3);
    var vowBeforeDoubled = o.first.slice(-4)[0];
    var canBeDoubled = (vowBeforeDoubled && u.isShortSound(vowBeforeDoubled) && inc(c.doubledns, lastThree));
    switch (o.stype) {
    case 'vowel':
        sutras = ['just-cut'];
        if (!inc(c.Nam, o.fin) &&!inc(c.Kay, o.fin)) sutras.push('just-cut-before-vowel');
        if (inc(c.Nam, o.fin) && !u.isShortSound(o.penult) && !(o.penult == c.virama)) sutras.push('just-cut-before-vowel'); // can not be two cons at the end

        if (b.dirgha) {
            sutras.push('dirgha');
            if (canBeDoubled) sutras.push('doubled-nasals');
            else if (b.fin_semi && o.penult == c.virama) sutras.push('dissimilar'); // so, but virama-r, ok
            else if (b.fin_yava && (!u.isVowel(o.penult) || o.penult == c.A)) sutras.push('ayadi');
            else if (o.fin == 'र' && o.penult != c.M) sutras.push('visarga-r');
        }
        else if (b.diphtong) {
            if (b.fin_semi && o.penult == c.virama) sutras.push('dissimilar');
            else if (o.fin == 'र') sutras.push('visarga-r'); // Vir.C.1
            else if (b.fin_yava && (!u.isVowel(o.penult) || o.penult == c.A)) sutras.push('ayadi');
            if (b.guna) {
                sutras.push('guna');
                if (o.mark == c.o && b.begSoftButNasal) sutras.push('visarga-o'); // one word written outer-sandhi // b.beg_soft ?
                else if (canBeDoubled) sutras.push('doubled-nasals');
                else if (b.mark_oM) sutras.push('cut-om');
            }
            else if (b.vriddhi) {
                sutras.push('vriddhi');
            }
        }
        // now o.mark is simple vowel
        else if (b.fin_semi && u.isVowel(o.mark) && o.penult == c.virama)  sutras.push('dissimilar'); // = ['dissimilar', 'just-cut'];
        else if (canBeDoubled) sutras.push('doubled-nasals');
        else if (o.fin == 'र') sutras.push('visarga-r');
        else if (b.can_be_ayadi) sutras.push('ayadi'); // = ['ayadi'];
        else if (o.first.length == 1) break;
        else if (u.isVowel(o.mark)) break;
        else {
            throw new Error();
        }
        break;
    case 'vowel-cons':
        if (b.mark_yava && o.penult == c.A) sutras.push('ayadi'); // E.5
        else if (b.mark_semi && o.penult == c.virama)  sutras.push('dissimilar');
        else if (canBeDoubled) sutras.push('doubled-nasals');
        sutras.push('cut-cons-after-a');
        if (!inc(c.Kay, o.fin) && !(inc(c.Nam, o.fin) && u.isShortSound(o.penult)) ) sutras.push('cut-cons-before-a');
        break;
    case 'cons':
        if (o.anusvara && inc(c.yalava, o.beg)) return []; // не может быть cut или mn-anusvara, создается add=>canda
        if (o.anusvara) sutras.push('anusvara-to-m');
        else if (o.anusvara_sib) { // penult=anusvara
            if (inc(c.cCwWtT, o.beg)) sutras.push('anusvara-Sar');
        }
        else if ((b.fin_nasal || b.fin_class3) && b.beg_nm) {
            // consonant to nasal of class ; reverse: nasal or 3-rd to hard fin
            sutras = ['cons-to-nasal-or-third'];
        }
        else if (inc(c.nasals, o.fin)) {
            if (o.fin == c.m) {
                // sutras.push('cut-cons');
                if (inc(c.yalava, o.beg) ) return []; // - ибо иначе образуется candra
                else if (inc(c.labials, o.beg)) sutras.push('m-to-labial'); // при add - m+labial
                else if (inc(c.dentals, o.beg)) sutras.push('m-to-dental');
                // else sutras.push('cut-cons');
                else return []; // иначе образовалось бы nasal
                // throw new Error();
            } else if (o.fin == 'ञ' && inc(c.jJ, o.beg)) { // o.fin == 'ञ' + beg = soft palatal, D.1.1b
                sutras.push('dental-palatal');
            } else if (o.fin == 'ण' && inc(c.qQ, o.beg)) { // o.fin == 'ण' + beg = soft cerebral, E.1.1b
                sutras.push('dental-cerebral');
            } else if (inc(c.YaNaRa, o.fin) && !inc(c.yalava, o.beg)) { // другой nasal -
                sutras.push('m-to-nasal');
            } else if (o.fin == c.n) {
                // то есть запретить те буквы, которые дадут nasal, но не -n в m-to-nasal:
                // кроме -n- -> calanDruvam - нужен пример, почему я добавил D сюда
                if (inc([c.h, 'द', 'ग', 'प', 'भ', 'क', 'ब', 'र', 'ध_'], o.beg) || inc(c.yalava, o.beg) || inc(c.sibilants, o.beg)) sutras.push('cut-cons');
                else sutras.push('m-to-nasal');
            } else {
                // log('======================================================== ODD NASAL ', o.fin);
                // throw new Error();
            }
        }
        /*
          итого при разрезании:
          -n -> дает -n и -m в конце слова
          -m -> то же самое
          -M -> - m в конце
          -Ms -> -n

          при сложении
          -n -> дает -n-, -m-,
          -m -> дает -n-, -m-, -M-

          остальные nasal
          -
        */
        else if (b.fin_S_beg_cC || b.fin_z_beg_wW || b.fin_s_beg_tT) sutras = ['visarga-sibilant']; // etacCrutvAH SrutvAH
        else if (b.fin_cerebral && b.beg_cerebral) {
            // dental class consonant followed by a cerebral class consonant changes to the corresponding cerebral; reverse: doubled cerebral
            sutras.push('dental-cerebral');
        } else if (b.fin_palatal && b.beg_palatal) {
            sutras.push('dental-palatal');
        } else if (b.lala) sutras = ['double-la'];
        else if (o.candra) {
            if (inc(c.yalava, o.beg)) sutras = ['m-to-candra'];
        }
        // тут я перепутал, при cut все наоборот надо D-h
        else if (o.fin == 'द' && o.beg == c.D) sutras.push('h-to-4class');
        // cut-cons:
        else if (!inc(c.Nam, o.fin) && !inc(c.Kay, o.fin) && inc(c.soft, o.beg)) sutras.push('cut-cons'); // sic! Kay, not Kar (Kar has sibilants)
        else if (inc(c.Kay, o.fin) && inc(c.Kar, o.beg)) sutras.push('cut-cons'); // обе глухих, beg includes sibolanta

        else if (sutras.length == 0) {
            return []; // unreal cut, rakzantu tu ?? n+t=anusvara
            // throw new Error();
        }
        break;
    case 'vow-ra':
        sutras = ['visarga-r', 'cut-cons-after-a']; // , 'just-cut' - дает ошибку, какую? м.б. правильно, что нет cut после -ra.
        break;
    case 'visarga':
        if (b.avagraha) {
            if (o.fin == c.e || o.fin == c.o) {
                sutras = ['visarga-avagraha'];
            }
        } else if (o.ra) {
            if (b.beg_soft_nasal_but_r) sutras = ['visarga-r'];
            if (u.isConsonant(o.fin)) sutras.push('guna');
        } else if (o.visarga) { // just-cut-visarga
            sutras = ['visarga-sibilant'];
        } else {
            sutras = ['visarga-avagraha'];
        }
        break;
    case 'om':
        if (o.mark == c.oM) sutras = ['just-cut-before']; // а если не голый ом, а в составе слова? // как это вообще работает?
        else sutras = ['cut-om'];
        break;
    default:
        throw new Error('unreal sutra');
        break;
    }
    // log('SUTRAS', sutras);
    return sutras;
}


function options(samasa, second) { // raw
    var beg = u.first(second);
    var spart = second;
    var re = new RegExp(spart + '$');
    var fpart = samasa.replace(re, '');
    var mark = u.last(fpart);
    if (fpart == samasa) {
        log('============== CAN NOT REMOVE TAIL', samasa, 2, second)
        throw new Error();
    }
    var o = {samasa: samasa, second: second, first: fpart, mark: mark};
    if (u.isVowel(mark)) {
        o.stype = 'vowel';
        o.first = u.wolast(fpart);
        o.fin = u.last(o.first);
        o.beg = u.first(second);
    } else if (u.isConsonant(mark)) {
        o.stype = 'vowel-cons'; // a.k.a. first ends on a
        o.fin = u.last(o.first);
        o.beg = u.first(second);
        if (mark == 'र') {
            o.penult = o.first.slice(-2,-1);
            if (o.penult != c.virama) o.stype = 'vow-ra';
        }
    } else if (mark == c.virama) {
        o.stype = 'cons';
        o.first = u.wolast(fpart); // removing virama
        o.mark = u.last(o.first);
        o.fin = o.mark;
        o.beg = u.first(second);
        o.virama = true;
        var penult = o.first.slice(-2,-1);
        if (penult == c.anusvara) { // i.e. anusvara-Sar // FIXME: а проверить на sibilant?
            o.anusvara_sib = true;
        }
        else if (o.mark == c.ra) {
            o.first = u.wolast(o.first); // removing ra
            o.stype = 'visarga';
            o.ra = true;
            o.fin = u.last(o.first);
        } else if (penult == c.candra) {
            o.first = u.wolast2(fpart);
            o.virama = true;
            o.candra = true;
            o.candraPENULT = true; // FIXME:
        }

    } else if (mark == c.anusvara) {
        o.stype = 'cons';
        o.first = u.wolast(fpart);
        o.mark = u.last(o.first);
        o.beg = u.first(second);
        o.virama = true;
        o.anusvara = true;
    } else if (mark == c.avagraha) {
        o.stype = 'visarga';
        o.avagraha = true;
        o.first = u.wolast(fpart);
    } else if (mark == c.candra || penult == c.candra) {
        o.stype = 'cons';

    } else if (mark == c.visarga) {
        o.stype = 'visarga'; // по висагре нельзя разрезать вообще - почему? можно-можно! нельзя, если следом श, cCwWtT
        o.beg = u.first(second);
        o.visarga = true;
    } else if (mark == c.oM) {
        o.stype = 'om';
        o.om = true;
    } else {
        log('WHAT???', mark, o);
        throw new Error();
    }
    o.fin = u.last(o.first);
    o.penult = o.first.slice(-2,-1); // just before .fin
    o.salat = salita.sa2slp(samasa);
    o.filat = salita.sa2slp(o.first);
    o.selat = salita.sa2slp(second);
    // o.next = second[0];
    // log('O', o)
    return o;
}

function possible(word) {
    if (!word || word.length == 0) return;
    if (word.length == 1) {
        if (inc(['न', 'च', 'स', 'ह', 'ॐ'], word)) return true; // отбрасываю все однобуквенные, кроме  // FIXME: ?
        else return;
    }
    var clean;
    var beg, fin, virama, penult;
    beg = word[0];
    fin = word.slice(-1);
    if (fin == '-') return; // FIXME: унести проверку в u.dirgha
    if (fin == c.virama) {
        virama = true;
        penult = word[word.length-2];
        if (word.length == 2) return; // 'न्', etc - should has syllable
        // if (word.slice(-3, -2) == c.virama) return; // two consonsnts at the end - нет, кажется так просто нельзя, неясно про rm, и вообще m вместо M
    }
    if (inc(c.cannotbeg, beg)) return;
    if (inc(c.allligas, fin) && inc(c.cannotfinligas, fin)) return;
    if (virama && inc(c.hal, penult) && !inc(c.shouldfincons, penult)) return;
    return true;
}

function possibleRes(res) {
    var clean = {firsts: [], seconds: []};
    res.firsts.forEach(function(first) {
        if (possible(first)) clean.firsts.push(first);
    })
    res.seconds.forEach(function(second) {
        if (possible(second)) clean.seconds.push(second);
    })
    if (clean.firsts.length > 0 && clean.seconds.length > 0 ) return clean;
}

// ============ ADD ==========

// TODO: will be completely rewritten:
function addOptions(first, second) {
    var first = first.split('');
    var second = second.split('');
    var fin = first.slice(-1)[0];
    if (inc(c.consonants, fin)) fin = '';
    var penult = first.slice(-2)[0];
    var beg = second[0];
    var opt;
    var candra;
    if (fin == c.virama) { //  && inc(c.hal, beg)
        var vir = false;
        candra = false;
        if (fin == c.virama) {
            first.pop();
            fin = first.slice(-1)[0];
            penult = first.slice(-2)[0];
            vir = true;
        }
        else if (fin == c.candra) {
            first.pop();
            fin = first.slice(-1)[0];
            candra = true;
        }
        var opt = {type: 'cons', first: first, fin: fin, vir: vir, second: second, beg: beg, pen: penult};
        if (vir) opt.vir = true;
        if (candra) opt.candra = true;
        if (beg == c.oM) {
            opt.second.shift();
            opt.oM = true;
        }
    } else if ((inc(c.consonants, fin) || inc(c.allligas, fin)) && inc(c.allvowels, beg)) {
        opt = {type: 'vowel', first: first, fin: fin, second: second, beg: beg};
    } else if (fin == c.visarga) {
        first.pop();
        fin = u.last(first)[0];
        opt = {type: 'visarga', first: first, fin: fin, second: second, beg: beg};
    }
    return opt;
}


function simpleSum(first, second) {
    var beg = u.first(second);
    var fin = u.last(first);
    if (u.isVowel(beg)) {
        if (u.isVirama(fin)) first = u.wolast(first);
        second = [u.liga(beg), u.wofirst(second)].join('');
    }
    var samasa = [first, second].join('');
    var result = {sutra: 'just-add', samasa: samasa};
    return [result];
}

sandhi.prototype.add = function(first, second) {
    if (second == '') return first;
    else if (first == '') return second;

    var opt = addOptions(first, second);
    // if (!opt) log('add: NO OPT', 'f', first, 's', second);
    if (!opt) return simpleSum(first, second); // just-cut
    switch (opt.type) {
    case 'vowel':
        addVowelFilter(opt);
        break;
    case 'cons':
        addConsFilter(opt);
        break;
    case 'visarga':
        addVisargaFilter(opt);
        break;
    }
    var sutra = vowRules[opt.num] || consRules[opt.num] || visRules[opt.num]  || cutRules[opt.num];
    if (!sutra) return simpleSum(first, second);
    var opts = sutra.add(opt);
    var sutras = opts.map(function(o) { return o.num});
    var res = opts.map(function(m) { return addResult(m)});
    if (res.length == 0) log('===== NO ADD RESULTS =====');
    if (debug) log('ADD=> RES', res);
    return res;
}

function addVowelFilter(opt) {
    var fin = opt.fin;
    // var penult = opt.pen;
    var beg = opt.beg;
    if (u.similar(fin, beg) || inc(c.aAliga, fin) && inc(c.aA, beg)) opt.num = 'dirgha';
    if (fin =='ृ' && beg == 'ऌ') opt.num = 'dirgha';
    if (inc(c.aAliga, fin) && inc(c.allsimples, beg)) opt.num = 'guna';
    // a or ā is followed by e, o, ai or au - vriddhi
    if (inc(c.aAliga, fin) && inc(c.diphtongs, beg)) opt.num = 'vriddhi';
    // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel
    if (inc(c.allsimpleligas, fin) && inc(c.allvowels, beg) && !u.similar(fin, beg)) opt.num = 'dissimilar';
    if (inc(c.allsimpleligas, fin) && inc(c.diphtongs, beg)) opt.num = 'dissimilar';
    // diphthong-to-semivowel - ayadi-guna - e,o+vow-a => ay,av+vow-a (comp. 6.1.109); - ayadi-vriddhi - E,O+vow => Ay,Av+vow, if vow=aA - next=cons
    // if (inc(c.diphtongs, u.vowel(fin)) && inc(c.allvowels, u.vowel(fin)) && !(inc(c.gunas, u.vowel(fin)) && beg =='अ')) opt.num = 'diphthong-to-semivowel';
    // diphthong-to-semivowel - diphthong followed by any vowel (e,o vow-a), including itself, changes to its semi-vowel equivalent - external - optional
    if (inc(c.gunas, u.vowel(fin)) && beg != 'अ') opt.num = 'ayadi';
    // the same, vriddhis
    if (inc(c.vriddhis, u.vowel(fin)) && inc(c.allvowels, beg)) opt.num = 'ayadi';

    if (inc(c.gunas, u.vowel(fin)) && beg == 'अ') opt.num = 'e-o-avagraha'; // 6.1.109
    // log('VOW ADD=', opt); // योग्योजस्
}

function addConsFilter(opt) {
    var fin = opt.fin;
    var penult = opt.pen;
    var beg = opt.beg;
    var next = opt.second[1];
    // === ADD FILTER CONSONATS ===
    // hard consonant followed by a soft consonant or vow. changes to the third of its class
    if (opt.vir && inc(c.Kay, fin) && (inc(c.allvowels, beg) || (inc(c.haS, beg) && !inc(c.Yam, beg)) ) ) opt.num = 'hard-to-soft';
    if (inc(c.Nam, opt.fin) && u.isShortSound(penult) && u.isVowel(opt.beg)) opt.num = 'doubled-nasals';
    if (u.isVowel(beg)) return;
    // дальше beg только consonants

    if (opt.vir && !inc(c.nasals, fin) && beg == c.h) opt.num = 'h-to-4class';
    // soft consonant except nasal, followed by a hard consonant changes to 1st consonant of class = > reverse: NO REVERSE!
    if (inc(c.haS, fin) && !inc(c.nasals, fin) && inc(c.Kar, beg)) opt.num = '8.4.55';
    // class consonant followed by (nasal) optionally changes to the nasal of class, or less commonly for class hard consonants, changes to 3rd consonant of class
    // FIXME: BUG: tAnnira - nira - дает лишнюю तात्निर
    if (inc(c.Jay, fin) && inc(c.nm, beg)) opt.num = 'cons-to-nasal-or-third';
    // dental class consonant followed by a palatal class consonant changes to the corresponding palatal
    if (inc(c.dentals, fin) && inc(c.palatals, beg) && beg != 'य') opt.num = 'dental-palatal';
    // dental class consonant followed by a cerebral class consonant changes to the corresponding cerebral
    if (inc(c.dentals, fin) && inc(c.cerebrals, beg)) opt.num = 'dental-cerebral';
    // m,n to anusvara or nasal + cons of class of that nasal
    // m-to-candra дает два варианта -nm+la и по одному -m+yava
    if (inc(c.nm, fin) && beg == 'ल') opt.num = 'm-to-candra'; // противоречит ananyenEva-yenEva, дает просто just-cut
    else if (fin == c.m && inc(c.yava, beg)) opt.num = 'm-to-candra'; // противоречит ananyenEva-yenEva, дает просто just-cut
    // if (fin == c.m && inc(c.yalava, beg)) opt.num = 'm-to-candra';
    // If den is followed by l, then den is replaced by la:
    else if (inc(c.dentals, fin) && beg == 'ल') opt.num = 'double-la'; // любые dentals

    // else if (fin == 'म' && inc(c.labials, beg)) opt.num = 'm-to-labial';
    // else if (fin == 'म' && inc(c.dentals, beg)) opt.num = 'm-to-dental';
    else if (fin == 'म') opt.num = 'm-to-nasal'; // дает -m- и -M-

    //ङ्, ण्, न् at the end of a word after a short vowel doules itself when followed by a vowel',

    // if (c.n == fin && c.cCtTwW[beg] && next != c.virama) opt.num = 'anusvara-Sar';
    if (c.n == fin && c.cCtTwW[beg]) opt.num = 'anusvara-Sar';

    if (opt.oM) opt.num = 'cut-om';
    // log('CONS ADD FILTER:', opt.num, 'fin:', fin, 'beg:', beg);
    // FIXME: порядок имеет значение - hard-to-soft д.б. раньше dental-palatal
}

function addVisargaFilter(opt) {
    var beg = opt.beg;
    var sec = opt.second[1];
    var fin = opt.fin;
    var ah = inc(c.hal, fin);
    var aah = c.A == fin;
    var bega = opt.beg == c.a;
    // visarga-r - только эти три случая - реверс:
    // vow but а,А + r + vow or cs-r
    // гласная but a - всегда, а a-A - только если стем на र् - хорошо бы создать список слов на -r
    // a + r + vow or cs-r - standing for अर् = पुनः, पितः, मातः
    // A + r + vow or cs-r - standing for आर् = द्वाः, द्वाः
    //
    // a + o + soft

    // if (u.vowsound(fin) && beg == 'ओ' && inc(c.soft, sec)) opt.num = 'visarga-o';
    if (u.vowsound(fin) && (inc(c.allvowels, beg) || inc(c.soft, beg))) opt.num = 'visarga-r'; // неотличимо от -o, двойной результат
    else if (ah && beg == c.a && fin != c.A) opt.num = 'visarga-avagraha';
    else if (inc(c.cCwWtT, beg)) opt.num = 'visarga-sibilant';
    else if (inc(c.Szs, beg)) opt.num = 'visarga-sibilant'; //D.4-6
    else if (u.vowsound(fin) && inc(c.Kar, beg)) opt.num = 'visarga-hard-cons';
    else {
        log('ADD UNREAL VISARGA', opt);
        throw new Error('add unreal visarga');
    }
    // log('VISARGA ADD FILTER sutra:', opt.num);
}

function addResult(mark) {
    if (mark.type == 'cons' && inc(c.allvowels, mark.beg)) {
        mark.second.shift();
        var liga = u.liga(mark.beg);
        mark.second.unshift(liga);
        mark.vir = false;
    }
    var space = (mark.space) ? ' ' : '';
    if (mark.end) mark.first.push(mark.end);
    if (mark.vir) mark.first.push(c.virama);
    // log('ADD sutra:', mark.num)
    var samasa = [mark.first.join(''), mark.second.join('')].join(space);
    return {sutra: mark.num, samasa: samasa};
}

// =================== internal consonant sandhi, will be completely rewritten =================

sandhi.prototype.int = function(form, flex, cflex, prefix, krit) {
    return internal.del(form, flex, cflex, prefix, krit);
}
