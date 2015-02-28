//

var _ = require('underscore');
var salita = require('salita-component');
var sandhi = require('../sandhi');
var debug = (process.env.debug == 'true') ? true : false;

module.exports = utils();

function utils(str) {
    if (!(this instanceof utils)) return new utils(str);
    return this;
}

// cflex - canon-flex, исходная форма флексии, -ti (а не -dhi, -di, etc)
utils.prototype.test = function(tests) {
    _.each(tests, function(test) {
        var form = test[0];
        if (!form) return;
        var flex = test[1];
        var cflex = test[2];
        var stem = test[3];
        var trnForm = salita.sa2slp(form);
        var trnStem = salita.sa2slp(stem);
        var descr = [form, trnForm, flex, cflex, trnStem, stem].join(' -> ');
        it(descr, function(done) {
            // log('----- test', form, flex, cflex);
            var results = sandhi.del(form, flex, cflex);
            if (debug) log('test-results', results, stem)
            isIN(results, stem).should.equal(true);
            done();
        });
    });
}

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

function log() { console.log.apply(console, arguments) }
