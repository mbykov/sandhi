//

var shiva = require('../../utils/shivasutra');

var Const = {};

Const.virama = '्';
Const.vowels = shiva('अच्').result;
Const.semivowels = shiva('यण्').result;
Const.consonants = shiva('हल्').result;
Const.nasals = shiva('ञम्').result; // ञ म ङ ण न म्
Const.voiced_asp = shiva('झष्').result;
Const.unvoiced_asp = shiva('खव्').del('चव्').result;
Const.asps = Const.voiced_asp.concat(Const.unvoiced_asp);
Const.voiced_unasp = shiva('जश्').result;
Const.unvoiced_unasp = shiva('चय्').result;
Const.unasps = Const.voiced_unasp.concat(Const.unvoiced_unasp);
Const.gdb = ['ग', 'द', 'ब'];
Const.GDB = ['घ', 'ध', 'भ'];
//Const.voiced_asp_h = shiva('झष्').add(['ह']).result;
Const.BsDv = ['भ', 'स', 'ध्व'];
Const.kzq = ['क', 'ष', 'ड'];
Const.t_th = ['त', 'थ'];
Const.t_th_dh = ['त', 'थ', 'ध'];
Const.t_h = ['त', 'ह'];
Const.wW = ['ट', 'ठ'];

Const.longshort = {
    //"आ": "अ", // A a
    "ई": "इ", // I i
    "ऊ": "उ", // U u
    "ू": "ु", // U u
    "ी": "ि", // I i
    //"": "",
}



module.exports = Const;
