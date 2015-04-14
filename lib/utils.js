var Const = require('./const');

module.exports = utils();

function utils() {
    if (!(this instanceof utils)) return new utils();
    return this;
}

utils.prototype.c = utils.prototype.isIN = function(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

utils.prototype.similar = function(a, b) {
    // log('A', a, 'B', b, 'D', Const.dirghaLiga[a], Const.dirghaLiga[b]);
    return ((Const.dirghaLiga[a] && Const.dirghaLiga[a] == Const.dirghaLiga[b]) || ((isIN(Const.consonants, a)) && Const.dirghaLiga[b] == 'ा')) ? true : false;
}

utils.prototype.aA = function(v) {
    return ((isIN(Const.consonants, v)) || v == 'ा') ? true : false;
}

/* vowels liga2matra */
utils.prototype.matra = function(v) {
    return Const.allvowels[Const.allligas.indexOf(v)];
}

/* vowels matra2liga */
utils.prototype.liga = function(v) {
    return Const.allligas[Const.allvowels.indexOf(v)];
}





function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}


// ============== OLD =================

utils.prototype.unasp2asp = function(lett) {
    var idx = Const.unasps.indexOf(lett);
    return Const.asps[idx];
}

utils.prototype.asp2unasp = function(lett) {
    var idx = Const.asps.indexOf(lett);
    return Const.unasps[idx];
}

utils.prototype.unvoiced2voiced_unasp = function(lett) {
    var idx = Const.unvoiced_unasp.indexOf(lett);
    return Const.voiced_unasp[idx];
}

utils.prototype.ultima = function(stem) {
    var clean = stem.replace(/्$/, '');
    return (clean == stem) ? stem.slice(-1) : clean.slice(-1);
}

utils.prototype.virama = function(stem) {
    var clean = stem.replace(/्$/, '');
    return (clean == stem) ? false : true;
}

utils.prototype.replaceEnd = function(stem, from, to) {
    from = [from, Const.virama].join('');
    to = [to, Const.virama].join('');
    var re = new RegExp(from + '$');
    return stem.replace(re, to);
}


function ulog () {
    var obj = arguments[0];
    if (arguments.length > 1) {
        console.log('==', arguments[0], '==');
        var obj = arguments[1];
    }
    console.log(util.inspect(obj, showHidden=false, depth=null, colorize=true));
}

function log() { console.log.apply(console, arguments) }

utils.prototype.log = function() {
    console.log.apply(console, arguments)
}
