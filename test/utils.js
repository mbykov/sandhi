//

// var salita = require('salita-component');
var sandhi = require('../index');
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
    var descr = [idxstr, 'add', addtext, compound].join(' - ');
    // add
    it(descr, function() {
        var added = sandhi.add(first, second);
        if (!added) {
            log('===================false, no added');
            false.should.equal(true);
        }
        // log('TEST ADD', added);
        isIN(added, compound).should.equal(true);
    });
    // split
    var descr = [idxstr, 'split', addtext, compound].join(' - ');
    it(descr, function() {
        var splitted;
        var testStr = [first, second].join(' ');
        var hash = sandhi.split(compound);
        if (hash[compound]) {
            splitted = hash[compound]
            isIN(splitted, testStr).should.equal(true);
        } else {
            var spacedFirst = compound.split(' ')[0];
            splitted = hash[spacedFirst];
            isIN(splitted, first).should.equal(true);
            // splitted = hash[second];
            // isIN(splitted, second).should.equal(true);
        }
        // splitted = (hash[compound]) ? hash[compound] : testStr;
        // isIN(splitted, testStr).should.equal(true);
    });
}



function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

// true.should.equal(true);
function log() { console.log.apply(console, arguments) }
