//

var salita = require('salita-component');
// var splitter = require('../splitter');

var s = require('../index');
var sandhi = s.sandhi;
var debug = (process.env.debug == 'true') ? true : false;

module.exports = utils();

function utils(str) {
    if (!(this instanceof utils)) return new utils(str);
    return this;
}

utils.prototype.test = function(test, idx) {
    var compound = test.shift();
    var first = test[0];
    var second = test[1];
    if (!compound) return;
    var addtext = test.join(' + ');
    var idxstr = ['_', idx+1, '_'].join('');
    var cotrn = salita.sa2slp(compound);
    var fitrn = salita.sa2slp(first);
    var setrn = salita.sa2slp(second);
    var trn = [fitrn, setrn, cotrn].join(' - ');
    // add
    var descr = [idxstr, 'add', addtext, compound, trn].join(' - ');
    it(descr, function() {
        var added = sandhi.add(first, second);
        // log('TEST ADD', added);
        isIN(added, compound).should.equal(true);
    });

    // delete
    /* как организовать тесты? В реальной жизни я имею samasa и хвост, а в сплиттере наоборот - начало от samasa
       здесь я могу посчитать длину second и вычислить половинки - вычитаю длину второго и символ начала (+1)
       вычитаю вторую половину для естественности
       salita не перекодирует начальные лиги
     */
    var descr = [idxstr, 'del', addtext, compound].join(' - ');
    it(descr, function() {
        var fres = false;
        var sres = false;
        var results = sandhi.del(compound, second);
        // log('TEST DEL', results);
        results.forEach(function(res) {
            if (isIN(res.firsts, first)) fres = true;
            if (isIN(res.seconds, second)) sres = true;
        });
        // log('TEST CUT', res);
        fres.should.equal(true);
        sres.should.equal(true);
    });

    // split
    // var descr = [idxstr, 'split', addtext, compound].join(' - ');
    // it(descr, function() {
    //     var splitted;
    //     var testStr = [first, second].join(' ');
    //     var hash = sandhi.split(compound);
    //     if (hash[compound]) {
    //         splitted = hash[compound]
    //         isIN(splitted, testStr).should.equal(true);
    //     } else {
    //         var spacedFirst = compound.split(' ')[0];
    //         splitted = hash[spacedFirst];
    //         isIN(splitted, first).should.equal(true);
    //         // splitted = hash[second];
    //         // isIN(splitted, second).should.equal(true);
    //     }
    //     // splitted = (hash[compound]) ? hash[compound] : testStr;
    //     // isIN(splitted, testStr).should.equal(true);
    // });
}

utils.prototype.gita = function(descr, sa, v, idx, idy) {
    it(descr, function() {
        // isIN(splitted, second).should.equal(true);
        // var vistr = JSON.stringify(v);
        var vistr = v.join(' ');
        // log(v.length, 'vi-str', vistr);
        var hash = sandhi.split(sa);
        // log(1, idx, idy, v);
        // log('hash', hash);
        var splitted = hash[sa];
        // log('test-gita splitted size', splitted.length);
        // log('hash', arr2string(res)); // '"भीरुः अयम्"'
        isIN(splitted, vistr).should.equal(true);
        // true.should.equal(true);

        // SPLITTER FIXME: убрать, это тест
        // splitter.get(sa);
    });
}

function arr2string(v) {
    // if (typeof(obj) == 'string') obj = [obj];
    return v.map(function(str) {return JSON.stringify(str) });
}

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

// true.should.equal(true);
function log() { console.log.apply(console, arguments) }
