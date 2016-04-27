// var _ = require('underscore');
var u = require('./utils');
var inc = u.include;
var Const = require('./const');
var c = require('./const');
var log = u.log;
// var shiva = require('shiva-sutras');
// var d = u.debug;

var sutras = {

    'just-cut': { // cut after mark.mark - vowel
        // просто cut после гласной
        del: function(mark) {
            // log('M-just-cut', mark)
            var first = [mark.first, mark.mark].join('');
            var res = {firsts: [first], seconds: [mark.second]};
            return res;
        },

        add: function(mark) {
            return [mark];
        }
    },

    // cut перед гласной, но не first-a
    'just-cut-before-vowel': { // cut before mark.mark = is vowel
        del: function(mark) {
            // log('M', mark)
            // cut before mark, first does not end with a
            var first, first_hard, second, fin;
            // fin is soft:
            // o.penult != c.virama -> не может быть две согласных подряд в конце слова - FIXME: так, может, перенести это в фильтр?
            // if (inc(c.onlysoft, mark.fin) && mark.penult != c.virama) {
            if (inc(c.onlysoft, mark.fin)) {
                fin = mark.fin;
                hard_fin = u.soft2hard(fin);
                first_hard = u.wolast(mark.first);
                first_hard = [first_hard, hard_fin, c.virama].join('');
            }
            first = [mark.first, c.virama].join('');
            second = [u.vowel(mark.mark), mark.second].join('');

            var res = {firsts: [first, first_hard], seconds: [second]};
            // log('R', res);
            return res;
        },

        add: function(mark) {
            return [mark];
        }
    },

    // cut две согласных, между которыми вирама - просто разрезает, и добавляет hard, если обе - soft, и наоборот
    'cut-cons': { // 8.2.39    // just-cut two cons
        del: function(mark) {
            // log('M', inc(c.Kay, mark.mark), mark.mark)
            var second;
            var first, hard, soft;
            if (mark.fin == c.n) {
                first = [mark.first, c.virama].join('');
            } else if (inc(c.onlysoft, mark.mark) && inc(c.soft, mark.beg)) {
                // log('HERE')
                var hard_fin = u.soft2hard(mark.fin);
                hard = u.wolast(mark.first);
                hard = [hard, hard_fin, c.virama].join('');
            } else if (inc(c.Kay, mark.mark) && inc(c.soft, mark.beg)) {
                // log('HERE')
                var soft_fin = u.hard2soft(mark.fin);
                soft = u.wolast(mark.first);
                soft = [soft, soft_fin, c.virama].join('');
            }
            first = [mark.first, c.virama].join('');
            second = mark.second;

            var res = {firsts: [first], seconds: [second]};
            if (hard) res.firsts.push(hard);
            if (soft) res.firsts.push(soft);

            // log('R', res);
            return res;
        },

        add: function(mark) {
            // log('M', mark)
            var json = JSON.stringify(mark);
            var soft_mark = JSON.parse(json);
            var soft_fin = u.class3(soft_mark.fin);
            soft_mark.first.pop();
            soft_mark.first.push(soft_fin);
            return [soft_mark]; // mark ? тут всегда мягкая, правильно? Это при делении м.б. варианты?
        }
    },


    // just-cut two cons, first ends with consonant
    // cut между двумя согласными, вирамы нет
    // это по сути vowel-sutra, д.б. два случая - before и after 'a'.
    // before должен иметь обработку hard
    'cut-cons-after-a': {
        del: function(mark) {
            // log('M', mark)
            var first = mark.first;
            var second = mark.second;

            var res = {firsts: [first], seconds: [second]};
            // log('R', res);
            return res;
        },

        add: function(mark) {
            var json = JSON.stringify(mark);
            var soft_mark = JSON.parse(json);
            var soft = u.class3(soft_mark.fin);
            soft_mark.first.pop();
            soft_mark.first.push(soft);
            return [soft_mark]; // mark ? тут всегда мягкая, правильно? Это при делении м.б. варианты?
        }
    },

    'cut-cons-before-a': {
        del: function(mark) {
            // log('M==>', mark)
            var first, first_hard;
            var second;
            if (inc(c.onlysoft, mark.mark)) { //  here get - по сути а, а не inc(c.soft, mark.beg)
                var fin = mark.fin;
                var hard_fin = u.soft2hard(fin);
                first_hard = u.wolast(mark.first);
                // first_hard = mark.first;
                first_hard = [first_hard, hard_fin, c.virama].join('');
            }
            first = [mark.first, c.virama].join('');
            second = mark.second;
            second = [c.a, mark.second].join('');

            var res = {firsts: [first, first_hard], seconds: [second]};
            // log('R', res);
            return res;
        },

        add: function(mark) {
            var json = JSON.stringify(mark);
            var soft_mark = JSON.parse(json);
            var soft = u.class3(soft_mark.fin);
            soft_mark.first.pop();
            soft_mark.first.push(soft);
            return [soft_mark]; // mark ? тут всегда мягкая, правильно? Это при делении м.б. варианты?
        }
    },

    'cut-cons-after-a_': { // два after-before вместе было
        del: function(mark) {
            log('M', mark)
            var first;
            var second;
            if (inc(c.onlysoft, mark.mark) && inc(c.soft, mark.beg)) {
                var fin = mark.fin;
                var hard_fin = u.class1(fin);
                first = u.wolast(mark.first);
                first = [first, hard_fin, c.virama].join('');
            } else {
                first = mark.first;
            }
            second = mark.second;

            var res = {firsts: [first], seconds: [second]};
            // log('R', res);
            return res;
        },

        add: function(mark) {
            var json = JSON.stringify(mark);
            var soft_mark = JSON.parse(json);
            var soft = u.class3(soft_mark.fin);
            soft_mark.first.pop();
            soft_mark.first.push(soft);
            return [soft_mark]; // mark ? тут всегда мягкая, правильно? Это при делении м.б. варианты?
        }
    },

    // ======================== OLD

    'just-cut-before-vowel_': { // cut before mark.mark = is vowel
        del: function(mark) {
            // log('M', mark)
            // cut before mark: // first can not be wo virama, a at the end require special sutras
            var first, second;
            if (u.isConsonant(mark.mark)) {
                first = [mark.first, mark.mark, c.virama].join('');
                second = [c.a, mark.second].join('');
            } else {
                first = [mark.first, c.virama].join('');
                second = [u.vowel(mark.mark), mark.second].join('');
            }
            var res = {firsts: [first], seconds: [second]};
            // cut before, fin is soft:
            // if (inc(c.onlysoft, mark.fin)) . . . etc:
            // этого не может быть, потому что hard порождает лишнее значение - tvidametezAm - etezAm - tvidamet, при сложении даст невозможное tvidamed
            return res;
        },

        add: function(mark) {
            return [mark];
        }
    },

    // для cut-consonant, может быть, cons-hard-to-soft?

    // ========= OLD =============

    'just-cut-before': { // cut before mark.mark - vowel
        del: function(mark) {
            var second = [u.vowel(mark.mark), mark.second].join('');
            return {firsts: [mark.first], seconds: [second]};
        },

        add: function(mark) {
            return [mark];
        }
    },

    'just-cut-virama': {
        del: function(mark) {
            var first = [mark.first, c.virama].join('');
            var res = {firsts: [first], seconds: [mark.second]};
            return res;
        },

        add: function(mark) {
            return [mark];
        }
    },

    'just-cut-virama-vowel': {
        del: function(mark) {
            // log(mark)
            var first = [mark.first, c.virama].join('');
            var vowel = u.vowel(mark.mark);
            var second = [vowel, mark.second].join('');
            var res = {firsts: [first], seconds: [second]};
            return res;
        },

        add: function(mark) {
            return [mark];
        }
    },

    'cut-after-a': {
        del: function(mark) {
            var first = [mark.first + mark.mark, c.virama].join('');
            var second_a = [c.a, mark.second].join('');
            return {firsts: [first], seconds: [second_a]};
        },

        add: function(mark) {
            return [mark];
        }
    },

    'cut-before-a': {
        del: function(mark) {
            var first_a = [mark.first + mark.mark].join('');
            var second = [mark.second].join('');
            return {firsts: [first_a], seconds: [second]};
        },

        add: function(mark) {
            return [mark];
        }
    },

    'cut-soft-after-vowel': { // tvidametezAm => tvidam-etezAm
        del: function(mark) {
            var vowel = u.vowel(mark.mark);
            var first = [mark.first, c.virama].join('');
            var hard = [u.wolast(mark.first), u.soft2hard(mark.fin), c.virama].join('');
            // log(1, mark) // योद्धव्यमस्मिन्  अस्मिन्
            var uniq = (first == hard) ? [first] : [first, hard]; // FIXME: неаккуратно
            var second = [vowel, mark.second].join('');
            var res = {firsts: uniq, seconds: [second]};
            return res;
        },

        add: function(mark) {
            return [mark];
        }
    },

    'soft-cw-vowel': {
        del: function(mark) {
            // FIXME: д.б. вариант для не-а, для а - virama
            var ends = [u.soft2hard(mark.pattern) + c.virama];
            var starts = [''];
            return u.combine(mark.first, mark.second, ends, starts);
        },

        add: function(mark) {
            // TODO:
            var res = [];
            return res;
        }
    },

    'nn-vowel': {
        del: function(mark) {
            var first = mark.first;
            if (first.slice(-1) != c.virama) first = first + mark.pattern + c.virama; // case of -nn at the end of first component
            var res = {firsts: [first], seconds: [mark.second]};
            return res;
        },

        add: function(mark) {
            return [mark];
        }
    },

    'cut-om': {
        del: function(mark) {
            var first = [mark.first, c.virama].join('');
            var second = [c.oM, u.wofirst2(mark.second)].join('');
            var res = {firsts: [first], seconds: [second]};
            return res; // ॐकारः
        },

        add: function(mark) {
            mark.second.unshift('ोङ्');
            mark.vir = false;
            // log(222, mark)
            return [mark]; // पवित्रमोङकारः // पवित्रमोङ्कारः
        }
    },

    '': {
        // type: 'vowel',
        // only: 'ext',
        del: function(mark) {
            var res = {};
            return res;
        },

        add: function(mark) {
            var res = [];
            return res;
        }
    },

}

module.exports = sutras;
