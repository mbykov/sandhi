//

var _ = require('underscore');
var slp = require('../../utils/slp');
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
        //log('----- test', test);
        var form = test[0];
        if (!form) return;
        var flex = test[1];
        var cflex = test[2];
        var ok = test[3];
        //ok =  'रुन्द्';
        var trnForm = slp.sk2slp(form);
        var trnOk = slp.sk2slp(ok);
        var descr = [trnOk, flex, cflex, trnForm].join(' -> ');
        it(descr, function(done) {
            var results = sandhi.del(form, flex, cflex);
            //log('======== results', results, ok)
            isIN(results, ok).should.equal(true);
            done();
        });
    });
}

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

function log() { console.log.apply(console, arguments) }
