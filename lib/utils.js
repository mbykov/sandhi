var _ = require('underscore');
var Const = require('./const');

module.exports = utils();

function utils() {
    if (!(this instanceof utils)) return new utils();
    return this;
}

utils.prototype.unasp2asp = function(lett) {
    var idx = Const.unasps.indexOf(lett);
    log(lett, Const.unasps)
    log('IDX', idx)
    return Const.asps[idx];
}

utils.prototype.ultima = function(form) {

}

function log() { console.log.apply(console, arguments) }
