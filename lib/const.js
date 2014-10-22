//

var shiva = require('../../utils/shivasutra');

var Const = {};

Const.virama = '्';
Const.voiced_asp = shiva('झष्').result;
Const.unvoiced_asp = shiva('खव्').del('चव्').result;
Const.asps = Const.voiced_asp.concat(Const.unvoiced_asp);
Const.voiced_unasp = shiva('जश्').result;
Const.unvoiced_unasp = shiva('चय्').result;
Const.unasps = Const.voiced_unasp.concat(Const.unvoiced_unasp);


module.exports = Const;

//function log() { console.log.apply(console, arguments) }
