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

// module.exports = sandhi();

module.exports = {
    sandhi: sandhi(),
    const: Const,
    u: u
}

/**/
function sandhi() {
    if (!(this instanceof sandhi)) return new sandhi();
    return this;
}

// ============= DELETE ==================
function delVowFilter(marker) {
    var markers = [];
    var fin = marker.fin;
    var penult = marker.pen;
    var beg = marker.beg;

    var pushMark = function(num) {
        var mark = _.clone(marker);
        mark.num = num;
        markers.push(mark);
    }

    // simple vowel, followed by a similar vowel => dirgha
    if (u.c(Const.dirgha, u.vowel(marker.pattern))) pushMark('6.1.101');

    // a or ā is followed by simple ->  guna; reverse: guna = a+simple
    if (u.vowsound(marker.fin) && u.c(Const.gunas, u.vowel(marker.pattern))) pushMark('6.1.87');
    if ((marker.fin == 'र' || marker.fin == 'ल') && marker.pattern == Const.virama) pushMark('6.1.87');

    // a or ā is followed by e, o, ai or au - vriddhi
    if (u.c(Const.vriddhis, u.vowel(marker.pattern))) pushMark('6.1.88');

    // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel (+virama); yana-sandhi; reverse: semi-vow = simple + dissimilar
    // if (marker.pen == Const.virama && u.c(Const.yaR, marker.fin) && u.c(Const.allligas, marker.pattern) && !u.similar(u.base(marker.fin), marker.beg)) pushMark('6.1.77');
    if (marker.pen == Const.virama && u.c(Const.yaR, marker.fin) && u.c(Const.allligas, marker.pattern) && (!u.similar(u.base(marker.fin), u.vowel(marker.pattern)) || u.c(Const.diphtongs, u.vowel(marker.pattern)) && u.c(Const.hal, marker.next))) { // dissimilar OR diphtong
        marker.pattern = marker.fin;
        marker.first = marker.first.slice(0,-2);
        marker.pos = marker.first.length + 1; // virama
        marker.fin = marker.first.slice(-1);
        pushMark('6.1.77');
    }
    else if (marker.fin == Const.virama && u.c(Const.yaR, marker.pattern) && u.c(Const.hal, marker.next)) pushMark('6.1.77');  // a after pattern, i.e. -ya-
    // OLD: else if (marker.pen == Const.virama && u.c(Const.yaR, marker.fin) && u.c(Const.diphtongs, u.vowel(marker.pattern)) && u.c(Const.hal, marker.next)) pushMark('6.1.77'); // diphtongs

    // diphthong followed by any vowel (e,o vow-a), including itself, changes to its semi-vowel equivalent - external - optional
    // else if ((u.c(Const.yaR, marker.fin) || u.c(Const.yaR, marker.pen)) && marker.pattern != Const.avagraha && u.c(Const.allvowels, marker.beg)) pushMark('6.1.78');
    // FIXME: тут ИЛИ слишком много, уточнить - иначе перекрывается с R-visarga, пока убрал
    // else if ((u.c(Const.yaR, marker.fin) || u.c(Const.yaR, marker.pen)) && marker.pattern != Const.avagraha) pushMark('6.1.78');

    // 6.1.109 - ayadi - e,o+a => avagraha
    // FIXME: похоже, это вообще убрать. 109 дает o на конце, а visarga-ah-a в тех же тестах дает висаргу, что правильно. О - нечто промежуточное, им. смысл для add
    // if (marker.pattern == Const.avagraha) pushMark('6.1.109');

    if (u.c(Const.allvowels, u.vowel(marker.pattern)) && (u.c(Const.class3, marker.fin))) { // xdVyy->xt->Vyy
        var mark = _.clone(marker);
        mark.type = 'cons';
        mark.num = '8.2.39';
        markers.push(mark);
    }

    //ङ्, ण्, न् at the end of a word after a short vowel doubles itself when followed by a vowel',
    if (u.c(Const.Nam, fin) && penult == Const.virama) {
        var third = marker.first.slice(-3,-2);
        if (third == fin) {
            var mark = _.clone(marker);
            mark.type = 'cons';
            mark.first = mark.first.slice(0,-1);
            mark.num = 'nasal-doubled';
            markers.push(mark);
        }
    }    // ['सुगण्णिति', 'सुगण्', 'इति'],

    //  visarga after any vowel changes to र् when followed by a vowel // vowel part of visarga-r sutra
    if ((fin == 'र' && u.vowsound(marker.pen)) || (marker.pattern == 'र' && u.vowsound(fin))) {
        var mark = _.clone(marker);
        if (fin == 'र') mark.first = mark.first.slice(0,-1);
        mark.type = 'visarga';
        mark.num = 'visarga-r';
        markers.push(mark);
    }

    // log('DEL-VOW-MARKER', marker);
    // log('DEL-VOW-MARKERS', markers);
    return markers;
}

// ================= DEL CONS FILTERS ================
function delConsFilter(marker) {
    var markers = [];
    var fin = marker.fin;
    var penult = marker.pen;
    var beg = marker.beg;

    var pushMark = function(num) {
        var mark = _.clone(marker);
        mark.num = num;
        markers.push(mark);
    }

    // hard consonant followed by a soft consonant but nasal or vow. changes to the third of its class => reverse: class3 + soft but nasal or vowels
    // NB: beg in vow processed in vowel filters:
    // NB: palatal after palatal - 8.4.40
    if (u.c(Const.jaS, fin) && u.c(Const.haS, beg) && !u.c(Const.Yam, beg) && ! (u.c(u.palatal(), fin) && u.c(u.palatal(), beg))) pushMark('8.2.39');

    // dental class consonant followed by a palatal class consonant changes to the corresponding palatal; reverse: doubled palatal
    if (u.c(u.palatal(), fin) && u.c(u.palatal(), beg)) pushMark('8.4.40');

    // dental class consonant followed by a cerebral class consonant changes to the corresponding cerebral; reverse: doubled cerebral
    if (u.c(u.cerebral(), fin) && u.c(u.cerebral(), beg)) pushMark('8.4.41');

    // 8.4.55 =>soft consonant except nasal, followed by a hard consonant changes to 1st consonant of class = > reverse: NO REVERSE!

    // class consonant followed by (nasal) optionally changes to the nasal of class, or less commonly for class hard consonants, changes to 3rd consonant of class    // reverse: nasal or 3-rd to hard fin
    if ((u.c(Const.nasals, fin) || u.c(Const.class3, fin)) && u.c(Const.nm, beg)) pushMark('8.4.45');

    // m at fin to anusvara; reverse: anusvara to m
    if (marker.anusvara) pushMark('8.3.23');
    // nasal + cons of class of that nasal; reverse: nasal to m
    // if (u.c(Const.nasals, fin) && u.eqvarga(fin, beg)) pushMark('8.3.23'); // убрал пока - g=.40.+_3_ - tAn - janAn - tAYjanAn - попадает сюда, а не нужно

    // If n is followed by l, then n is replaced by nasal l. If a dental other than n and s is followed by l, then the dental is replaced by l.
    if (u.c(u.dental(), fin) && beg == 'ल') marker.num = '8.4.60'; //  ल ँ ् ल
    if (fin == 'ल' && beg == 'ल')  pushMark('8.4.60');
    if (marker.pen == 'ल' && fin == Const.candra && beg == 'ल')  pushMark('8.4.60');

    if (marker.fin == 'र' && u.vowsound(marker.pen) && (u.c(Const.JaS, marker.beg) || (u.c(Const.yaR, marker.beg) && marker.beg != 'र') ))  {
        var mark = _.clone(marker);
        mark.first = mark.first.slice(0,-1);
        mark.type = 'visarga';
        mark.num = 'visarga-r';
        markers.push(mark);
    }

    // log('DEL-CONS-MARKERS', markers);
    return markers;
}

// ================= DEL VISARGA FILTERS ================
function delVisFilter(marker) {
    var markers = [];
    var fin = marker.fin;
    var penult = marker.penult;
    var beg = marker.beg;
    var pattern = marker.pattern;

    var pushMark = function(num) {
        var mark = _.clone(marker);
        mark.num = num;
        markers.push(mark);
    }
    // FIXME: ифы тут повторяют условия makeMarker, и неясно нужно ли в delete-висарге вообще массив и соотв., клонирование

    if (fin == 'ो' && pattern == Const.avagraha)  pushMark('visarga-ah-a');
    // else if (u.c(Const.Sar, marker.pattern) && marker.virama && u.c(Const.Kar, beg)) pushMark('visarga-hard-cons');

    // log('DEL-VISARGA-MARKERS', markers);
    return markers;
}

/*
  разрезаю samasa - получаю пару first-second. Второе слово может менять первую букву
  методы cut() и del() - del() возвращает пару first-second, cut() возвращает first
*/
sandhi.prototype.del = function(samasa, second) {
    if (second.length < 2) second = ''; // second should be long enough
    if (second == '') return [{pos: 0, num: 'cut', firsts: [samasa], seconds: [''], delta: {} }]; // cut => start
    else if (samasa == second) return [{pos: 0, num: 'cut', firsts: [''], seconds: [samasa], delta: {} }];
    var marker = delMarker(samasa, second);

    var markers = [];
    switch (marker.type) {
    case 'vowel':
        markers = delVowFilter(marker);
        break;
    case 'cons':
        markers = delConsFilter(marker);
        break;
    case 'visarga':
        markers = delVisFilter(marker);
        break;
    }

    if (markers.length == 0) {
        // log('====== SANDHI: ======= NO MARKERS =======');
        var cutMark = {firsts: [marker.first], seconds: [marker.second], pos: marker.pos, num: 'cut', delta: {}};
        return [cutMark];
    }

    var cutted = [];
    markers.forEach(function(mark) {
        var sutra = vowRules[mark.num] || consRules[mark.num] || visRules[mark.num];
        var res = sutra.del(mark);
        res.pos = mark.pos;
        res.num = mark.num;
        res.pat = mark.pattern;
        if (!res.delta) {
            res.delta = {};
            res.delta[res.pos] = false;
        }
        cutted.push(res);
    });

    // log('DEL=> MARKERS', markers);
    // log('DEL=> RES', cutted);
    return cutted;
}


/**/
function delMarker(samasa, second) {
    var spart = second.slice(1);
    var re = new RegExp(spart + '$');
    var fpart = samasa.replace(re, '');
    samasa = samasa.split('');

    var beg = second[0];
    var next = second[1];// just after .beg
    var pattern = fpart.slice(-1); // pattern - стоит на месте beg
    var first = fpart.slice(0, -1);
    var clean = first.split(Const.virama).join('');
    var size = first.length; // ===> вирама не считается за позицию - попытка
    var fin = first[size-1];
    var penult = first[size-2];
    var pos = size;
    var type;
    var virama, candra;
    var spec;

    if (fin == 'ो' && pattern == Const.avagraha) { // visarga-ah-a
        type = 'visarga';
    } else if (u.c(Const.Sar, penult) && fin == Const.virama && !u.c(u.palatal(), beg) && u.c(Const.Kar, beg)) { // visarga-hard-cons
        type = 'visarga';
        pattern = penult;
        first = first.slice(0, -2);
        spec = Const.virama;
        size = first.length;
        fin = first[size-1];
        penult = first[size-2];
        pos = size+1; // cause virama
    } else if (u.c(Const.allvowels, beg)) { // FIXME: а как тут будет условие про последний символ перевого слова?
        type = 'vowel';
    } else if (u.isConsonant(beg) && u.c(Const.special, fin) && u.isConsonant(pattern)) {
        type = 'cons';
        first = first.slice(0, -1);
        spec = fin;
        size = first.length;
        fin = first[size-1];
        penult = first[size-2];
        pattern = beg; // что здесь pattern? всегда - символ, который стоит на месте fin?
        pos = size+1; // cause virama
    } else {
        type = 'cut';
    }
    var marker = {type: type, first: first, second: second, pen: penult, fin: fin, pattern: pattern, beg: beg, next: next, pos: pos};
    if (spec == Const.virama) marker.virama = true;
    else if (spec == Const.anusvara) marker.anusvara = true;
    else if (spec == Const.candra) marker.candra = true;
    else if (spec == Const.anunasika) marker.anunasika = true;

    // log('DEL-marker', '\n', marker); //
    return marker;
}


// ============ ADD ==========

function addMarker(first, second) {
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
        marker = {type: 'cons', first: first, fin: fin, vir: vir, second: second, beg: beg, pen: penult};
        if (vir) marker.vir = true;
        if (candra) marker.candra = true;
    } else if ((u.c(Const.consonants, fin) || u.c(Const.allligas, fin)) && u.c(Const.allvowels, beg)) {
        marker = {type: 'vowel', first: first, fin: fin, second: second, beg: beg};
    } else if (fin == Const.visarga) {
        first.pop();
        fin = first.slice(-1)[0];
        marker = {type: 'visarga', first: first, fin: fin, second: second, beg: beg};
    }
    // log('ADD-marker', marker);
    return marker;
}

sandhi.prototype.add = function(first, second) {
    if (second == '') return first;
    else if (first == '') return second;

    var marker = addMarker(first, second);
    switch (marker.type) {
    case 'vowel':
        addVowelFilter(marker);
        break;
    case 'cons':
        addConsFilter(marker);
        break;
    case 'visarga':
        addVisargaFilter(marker);
        break;
    }
    var sutra = vowRules[marker.num] || consRules[marker.num] || visRules[marker.num];
    var markers = sutra.add(marker);
    // log('ADD=> MARKERS', markers);
    // log('ADD=> RES', markers.map(function(m) { return addResult(m)}));
    return markers.map(function(m) { return addResult(m)});
}

function addVowelFilter(marker) {
    var fin = marker.fin;
    // var penult = marker.pen;
    var beg = marker.beg;
    if (u.similar(fin, beg) || u.c(Const.aAliga, fin) && u.c(Const.aA, beg)) marker.num = '6.1.101';
    if (fin =='ृ' && beg == 'ऌ') marker.num = '6.1.101';
    if (u.c(Const.aAliga, fin) && u.c(Const.allsimples, beg)) marker.num = '6.1.87';
    // a or ā is followed by e, o, ai or au - vriddhi
    if (u.c(Const.aAliga, fin) && u.c(Const.diphtongs, beg)) marker.num = '6.1.88';
    // simple vowel except Aa followed by a dissimilar simple vowel changes to its semi-vowel
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

function addConsFilter(marker) {
    var fin = marker.fin;
    var penult = marker.pen;
    var beg = marker.beg;
    // === ADD FILTER CONSONATS ===
    // hard consonant followed by a soft consonant or vow. changes to the third of its class
    if (u.c(Const.Kay, fin) && (u.c(Const.allvowels, beg) || (u.c(Const.haS, beg) && !u.c(Const.Yam, beg)))) marker.num = '8.2.39';
    // soft consonant except nasal, followed by a hard consonant changes to 1st consonant of class = > reverse: NO REVERSE!
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
    if (u.c(Const.Nam, fin) && u.vowshort(penult) && u.c(Const.allvowels, beg)) marker.num = 'nasal-doubled';

    // FIXME: порядок имеет значение - 8.2.39 д.б. раньше 8.4.40
    // log('CONS ADD FILTER:', marker.num, 'fin:', fin, 'beg:', beg, Const.Yam);
}

function addVisargaFilter(marker) {
    var visarga = marker.fin;
    var penult = marker.pen;
    var beg = marker.beg;
    var fin = marker.fin;
    var ah = u.c(Const.hal, fin);
    var aah = Const.A == fin;
    if (ah && beg =='अ') marker.num = 'visarga-ah-a';
    if (u.vowsound(fin) && u.c(Const.Kar, beg)) marker.num = 'visarga-hard-cons';
    if (u.vowsound(fin) && u.c(Const.allvowels, beg) || (u.c(Const.JaS, marker.beg) || (u.c(Const.yaR, marker.beg) && marker.beg != 'र')) ) marker.num = 'visarga-r';

    // log('VISARGA ADD FILTER:', marker);
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
