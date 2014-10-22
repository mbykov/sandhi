var shiva = require('../../utils/shivasutra');

var Const = {};

Const.voiced_asp = shiva('झष्').result;
Const.unvoiced_asp = shiva('खव्').del('चव्').result;
Const.asps = voiced_asp.concat(unvoiced_asp);
Const.voiced_unasp = shiva('श्').result;
Const.unvoiced_unasp = shiva('चय्').result;
Const.unasps = voiced_unasp.concat(unvoiced_unasp);


module.exports = Const;

function log() { console.log.apply(console, arguments) }
