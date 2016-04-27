// bolean conditions of sandhi
var u = require('./utils');
var inc = u.include;
var c = require('./const');


function boolean(opt) {
    this.lala = (opt.fin == 'ल' && opt.beg == 'ल');
    this.begSoftButNasal = (inc(c.soft, opt.beg) && !inc(c.Nam, opt.beg));
    // hard cons followed by soft cons but nasal changes to the 3- of its class; reverse: class3 + soft but nasal or vow, but nasals, but la-la
    this.hardConsFollowedBySoftCons  = (opt.virama && (inc(c.class3, opt.fin) || inc(c.yava, opt.fin)) && this.begSoftButNasal && !this.lala);

    this.dirgha = inc(c.dirgha, u.vowel(opt.mark)); // FIXME: ditghas?
    this.diphtong = inc(c.diphtongs, u.vowel(opt.mark))
    this.guna = inc(c.gunas, u.vowel(opt.mark))
    this.vriddhi = inc(c.vriddhis, u.vowel(opt.mark));
    this.fin_semi = inc(c.yaR, opt.fin);
    this.fin_yava = inc(c.yava, opt.fin); // && inc(c.allligas, opt.mark) // ????
    this.mark_semi = inc(c.yaR, opt.mark);
    this.mark_yava = inc(c.yava, opt.mark);
    this.can_be_ayadi = (opt.penult && inc(c.yava, opt.fin) && (u.isConsonant(opt.penult) || opt.penult == c.A));
    this.rala = (opt.fin == 'र' || opt.fin == 'ल');
    this.mark_ra = (opt.mark == 'र');
    this.mark_oM = (opt.mark == c.o && opt.beg == 'ङ');

    this.fin_palatal = inc(c.palatals, opt.fin);
    this.mark_palatal = inc(c.palatals, opt.mark);
    this.beg_palatal = inc(c.palatals, opt.beg);
    // this.fin_S = (opt.fin == c.S);
    // this.beg_cC = (inc(c.cC, opt.beg));
    // this.fin_S_beg_cC = (opt.fin == c.S && inc(c.cC, opt.beg));

    // if (inc(c.cerebrals, opt.fin) && inc(c.cerebrals, opt.beg) && !((opt.fin == c.z && inc(c.wW, opt.beg)))) sutras.push('8.4.41'); // but not visarga
    this.fin_cerebral = inc(c.cerebrals, opt.fin);
    this.beg_cerebral = inc(c.cerebrals, opt.beg);
    this.fin_nasal = inc(c.nasals, opt.fin);
    this.beg_soft = (inc(c.soft, opt.beg));
    this.beg_onlysoft_nasal = (inc(c.onlysoft, opt.beg) || inc(c.nasals, opt.beg)); // c.nasals or c.Nam ? => i.e. ञ म ङ ण न or ङ,ण,न ?
    this.beg_soft_nasal_but_r = ((inc(c.soft, opt.beg) && opt.beg != c.ra) || inc(c.Nam, opt.beg)); // c.nasals or c.Nam ? => i.e. ञ म ङ ण न - or - ङ,ण,न ?
    this.beg_nm = inc(c.nm, opt.beg);
    // if (inc(c.class3, opt.fin) && !inc(c.yam, opt.pattern) ) sutras.push('8.2.39');
    this.fin_class3 = inc(c.class3, opt.fin);

    // if (opt.fin == c.S && inc(c.cC, opt.beg)) sutras.push('visarga-hard-cons');
    // else if (opt.fin == c.z && inc(c.wW, opt.beg)) sutras.push('visarga-hard-cons');
    // else if (opt.fin == c.s && inc(c.tT, opt.beg)) sutras.push('visarga-hard-cons');
    this.fin_S_beg_cC = (opt.fin == c.S && inc(c.cC, opt.beg));
    this.fin_z_beg_wW = (opt.fin == c.z && inc(c.wW, opt.beg));
    this.fin_s_beg_tT = (opt.fin == c.s && inc(c.tT, opt.beg));
    // else if fin_o_beg_soft (opt.fin == 'ो' && inc(c.soft, opt.beg)) sutras = ['visarga-ah-soft'];
    this.fin_o_beg_soft = (opt.fin == 'ो' && inc(c.soft, opt.beg));

    // visarga
    this.avagraha = (opt.mark == c.avagraha);
    // doubled-nasal
    // J1. (ङ्, ण्, न्) at the end of a word after a (short vowel) (doubles itself) when followed by a (vowel)
    this.doubled_nasal = (inc(c.Nam, opt.fin) && u.isShortSound(opt.penult) && u.isVowel(opt.beg));
    // Const.doubledns = ['ङ्ङ', 'ण्ण', 'न्न'];

    return this;
}

module.exports = boolean;
