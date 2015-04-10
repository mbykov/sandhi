//

var salita = require('salita-component');
var sandhi = require('../index');
var debug = (process.env.debug == 'true') ? true : false;

module.exports = utils();

function utils(str) {
    if (!(this instanceof utils)) return new utils(str);
    return this;
}

utils.prototype.test = function(test) {
    var compound = test.shift();
    var descr = test.toString();
    it(descr, function() {
        var results = sandhi.add(test);
        true.should.equal(true);
        isIN(results, compound).should.equal(true);
    });
}



function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

function log() { console.log.apply(console, arguments) }
