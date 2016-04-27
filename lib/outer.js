//
// outer sandhi - aka sandhi across the space between two words

var _ = require('underscore');
var u = require('./utils');
var log = u.log;
var d = u.debug;
var inc = u.include;
// var Const = require('./const');
var c = require('./const');
var bool = require('./boolean');

module.exports = outer;

/*
  - заменяю простые - sa, esha, ya, но отправляю в sandhi, а это уже результат?
  - в outer могут быть любые правила сандхи, если вообще есть возможность написать результат раздельно
  - когда можно раздельно? все проверять? И что - несколько результатов?
*/

function outer(samasa, next) {
    // log('samasa:', samasa, 'next', next);
    var pattern;
    var virama;
    var fin = u.last(samasa);
    if (fin == 'ं' && next == '।') return [u.wolast(samasa), 'म', c.virama].join('');
    else if (!next) return samasa;
    else if (next.form) next = next.form; // откуда это взялось, не должно быть? => flakes - evamukto
    var beg = next[0];
    if (fin == c.virama) {
        pattern = fin;
        fin = u.penult(samasa);
        // *** pattern лучше заменить на opt.virama = true; или даже opt.hardCons
        virama = true;
    }
    var opt = {beg: beg, fin: fin, pattern: pattern};
    if (virama) opt.virama = true;
    var b = bool(opt);

    if (!u.isVowel(beg)) { // FIXME: B7. (visarga) in सः and एषः is dropped when followed by (vowel except अ) or a (consonant).
        if (samasa == 'स') return 'सः';
        else if (samasa == 'एष') return 'एषः';
        else if (u.endsWith(samasa, 'ेष')) return [samasa, c.visarga].join(''); // if second pada is the same eza;
    }
    if (samasa == 'य' && beg != c.a) return 'यः';
    else if (samasa == 'त' && beg != c.a) return 'ते'; // FIXME: ?? всегда ли ?


    // else if (samasa == 'शक्य') return 'शक्यः'; // есть случай -a, и 2 -e; м.б. исключение?

    // // исключения из-за отсутствия правила на -e:
    // // E1. (ए) changes to (अय्) or (अ) when followed by (vowel-अ)
    // // beg == 'इ' или все же inc(c.all ex a, beg) ?
    // // то есть это потециальный баг, если правильный результат - с висаргой:
    // else if (samasa == 'वर्तन्त' && beg == 'इ') return 'वर्तन्ते';
    // else if (samasa == 'मोदिष्य' && beg == 'इ') return 'मोदिष्ये';
    // else if (samasa == 'योत्स्य' && beg == 'इ') return 'योत्स्ये';
    // else if (samasa == 'लोक' && beg == 'इ') return 'लोके';
    // else if (samasa == 'यजन्त' && beg == 'इ') return 'यजन्ते';

    // // без правила на e, beg = e:
    // else if (samasa == 'सर्व' && beg == 'ए') return 'सर्वे';
    // else if (samasa == 'वर्त' && beg == 'ए') return 'वर्ते';

    // // те же исключения, но samasa в line.dicts
    // else if (samasa == 'रथोपस्थ' && beg == 'उ') return 'रथोपस्थे';

    // else if (samasa == 'एवमुक्तो') return 'एवमुक्तः';

    // TODO: FIXME: к общей архитектуре:
    // वर्त वर्ते = I am engaged - пример, почему нельзя в первом шаге, терминах, проверять склоняемые.
    // Даже частые. varta найдется, и ага. Сначала нужно хотя бы outer-sandhi. Но это реально
    // интересно, можно ли проверять местоимения ?
    // то есть три шага - простые термины, сандхи-через-пробел, частые-склоняемые-компоненты
    // чск - предварительно нужен анализ флексии, -sup, -tin

    // log('FIN', fin, fin == 'ो', 'NEXT', next)
    var clean = samasa;
    // три простые частые правила:
    if (fin == 'ो' && inc(c.soft, beg)) clean = [u.wolast(samasa), c.visarga].join('');
    else if (fin == 'ा' && (inc(c.allvowels, beg) || inc(c.soft, beg))) clean = [samasa, c.visarga].join('');
    else if (fin == c.anusvara) clean = [u.wolast(samasa), 'म', c.virama].join('');

    // ==> первое - если beg - не a, могут быть -e, и -:, то есть два результата?
    // FIXME: м.б. лучше общее правило - дaвать visarga, а e - в исключениях?

    // FIXME: TODO: next two rules contradict each other, should be two results, with e and with visarga? then syntax analyze?
    // 1.6 - e: सर्व सर्वे, next एव, ; 1.6-visarga विक्रान्त विक्रान्तः, next उ
    // BUT: 10.1 - भूय  भूयः, next eva, for now भूय placed in exceptions at the beginning

    // FIXME: 23 февраля 2016 - второе правило - A - to - visarga - судя по гите - применяется не всегда, но когда, непонятно
    // в гите я могу подсмотреть ответ. Но в реальной жизи что делать?
    // в обоих случаях, и -A, и -H - эти окончания будут отброшены при обращении к BD


    // a+visarga (v for s) + vow ex a: // 5.1 - yacCreya-यच्छ्रेय
    else if (inc(c.consonants, fin) && inc(c.allexa, beg)) clean = [samasa, c.visarga].join(''); // visarga dropped before simple
    // сейчас я заменяю в Гите visarga обратно на e, если расшифровка на e.
    // что некорректно, но здесь я расшифровки не знаю
    // правило на e:
    // else if (inc(c.consonants, fin) && inc(c.allexa, beg) && beg != 'ए') clean = [samasa, c.visarga].join('');
    // else if (inc(c.consonants, fin) && beg == 'ए') clean = [samasa, u.liga('ए')].join(''); // e dropped - ayadi-sandhi

    // ==> второе - не хочется перебирать все варианты сандхи-правил, но что делать?
    // soft to hard
    else if (b.hardConsFollowedBySoftCons) {
        var hard = u.class1(fin);
        clean = samasa.slice(0, -2);
        clean = [clean, hard, c.virama].join('');
        // log('============ hard to soft');
    }
    // log('================', samasa, 'clean', clean);

    return clean;
}
