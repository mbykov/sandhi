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
    var add = test.join(' + ');
    var descr = [idx, 'add', add, compound].join(' - ');
    it(descr, function() {
        var added = sandhi.add(test);
        isIN(added, compound).should.equal(true);
    });
    descr = [idx, 'del', compound, test.toString()].join(' - ');
    it(descr, function() {
        var del = sandhi.del(compound, second);
        log('DEL', del);
        del.first.should.equal(first);
        del.second.should.equal(second);
        // true.should.equal(true);
    });
}



function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

// true.should.equal(true);
function log() { console.log.apply(console, arguments) }
