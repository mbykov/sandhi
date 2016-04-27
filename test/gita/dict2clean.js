// reads Couch/gita, then sandhi.outer, sandhi.del
// removes all components of a samasa in the cycle, so that last component is contained in the final result
// make test
// total = 448
// make gita ==> 701
// $ node lib/dict2clean.js ==> 701; the same as make gita
// total = 1849

var salita = require('salita-component');
var _ = require('underscore');
// var fs = require('fs');
// var util = require('util');
var s = require('sandhi');
var u = s.u;
var c = s.const;
var sandhi = s.sandhi;
var outer = s.outer;
var log = u.log;
var p = u.p;
var inc = u.include;
var Relax = require('relax-component');
var relax = new Relax('http://admin:kjre4317@localhost:5984');
relax.dbname('gita');

total = 0;

getSamasa();

function getSamasa() {
    getDocs(function(docs) {
        var cleans = cleaner(docs)
        log(cleans.length);
    });
}

function cleaner(docs) {
    // docs = docs.slice(0, 3);
    docs.forEach(function(doc, idy) {
        // log('IDY', idy);
        // if (doc.num != '1.47') return;
        var sloka = doc.shloka.split('॥')[0]; // doc.SH-loka !
        var samasas = sloka.split(' ');
        samasas.forEach(function(samasa, idx) {
            var next = samasas[idx+1];
            if (!next || samasa == '।') return; // FIXME: это бы надо проверить - вдруг есть случай, где есть line.clean и нет next ?
            var line = doc.lines[idx];
            if (!line) throw new Error('no line for samasa');
            if (line.form !=samasa) {
                log(doc.num, idx, samasa, line.form, doc._id);
                throw new Error('fine.form !=samasa');
            }

            if (!line.dicts) return;

            var clean = outer(samasa, next);

            var last = clean[clean.length-1];
            if (last == c.H) {
                var lastdict = line.dicts[line.dicts.length-1];
                var lastform = lastdict.form;
                var fin = lastform[lastform.length-1];
                if (fin == c.A) clean = samasa;
                if (fin == 'ो') clean = samasa;
                if (fin == 'े') clean = [samasa, c.e].join(''); // это верно, только если samasa на -a
                if (u.isConsonant(fin)) clean = samasa;
            }

            // FIXME: убрал из-за 11.17 - замена fin-d на глухую fin-t в среднем компоненте. А в outer, выходит, этого у меня нет
            checkOuter(idy, idx, doc, line, samasa, next, clean);
            if (!line.clean && line.dicts.length ==0) {
                log(doc.num, idx, samasa, line.form, doc._id);
                throw new Error('empty dicts');
            }
            checkDicts(idx, doc, line, samasa, next, clean);
        });
    });
    return docs;
}

function checkDicts(idx, doc, line, samasa, next, clean) {
    var num = doc.num;
    var size = line.dicts.length;
    var first = line.dicts[0].form; // result
    first = correct(first);
    var reverse = line.dicts.reverse();
    var results = [clean];
    // log('C=>');
    // log('clean===>', clean);
    reverse.forEach(function(dict, idz) {
        var current = dict.form;
        var dictform = reverse[idz-1];
        var dictformclean = (dictform) ? dictform.form : '';
        var dictnext = (reverse[idz+1]) ? reverse[idz+1].form : 'none';
        // if (idz == 0) current = outer(current, next); // на outer проверяю только первую паду
        // else current = correct(current, dictnext); // но в остальных  нужно все же поправить анусвару
        current = correct(current, dictnext); // но в остальных  нужно все же поправить анусвару
        current = u.wofirstIfVow(current);
        if (idz == size - 1) {
            total+=1;
            // log('T', total);
            if (inc(results, first)) return; // это final ok <<<=====
            log('== error: not final ok ==', doc.num, idx, 'idz:', idz, 'size:', line.dicts.length, samasa, 'stems:', results, 'last-form', dict.form);
            throw new Error('not ok');
        }
        results = removePada(doc.num, results, current, dictnext, line);
    });
}

// вычитаю очередную паду из каждого стема, суммирую
function removePada(num, results, current, dictnext, line) {
    var trnres = results.map(function(r) { return salita.sa2slp(r)}); // FIXME:
    var trncur = salita.sa2slp(current);

    log('=> remove pada - current', num, results, trnres, current, trncur, 'next', dictnext);

    var stems = [];
    var anySeconds = [];
    results.forEach(function(clean, idz) {
        var res = sandhi.del(clean, current);
        if (!res) return;
        var firsts = res.map(function(r) { return r.firsts});
        firsts = _.flatten(firsts);
        stems = stems.concat(firsts);
    });

    if (stems.length == 0 || stems == []) {
        log('== no stems [] ==', num, 'results:', JSON.stringify(results), 'current:', current, 'stems', stems);
        log('L', line)
        throw new Error('no stems');
    }
    return stems;
}

// проверка целого слова на outer-sandhi
function checkOuter(idy, idx, doc, line, samasa, next, clean) {
    if (!line.clean) return;
    var result = correct(line.clean, next);
    if (clean != result) log('==>', idy, doc.num, doc._id);
    if (clean != result) log('line.clean', line.clean);
    if (clean != result) log('CLEAN: samasa', idx, samasa, 'clean', clean, 'result', result, 'next', next);
    if (clean != result) throw new Error('doc.clean != clean');
    return result;
}

// line.clean сам нуждается в исправлении, в частности, анусвара - на m
// a.k.a outer-light, только для составных внутренних line.clean, последняя требует outer
function correct(str, next) {
    var clean = str;
    var fin = u.last(str);
    if (!next) next = '';
    var beg = next[0];
    var n = 'म';
    // здесь изображение правила: doubled palatal - var dental = u.palatal2dental(mark.fin);
    // if (beg == 'च') n = 'न';
    if (fin == c.anusvara) clean = [u.wolast(str), n, c.virama].join('');
    // три простые правила, как в outer ?
    // else if (fin == 'ो' && inc(c.soft, beg)) clean = [u.wolast(samasa), c.visarga].join('');
    // else if (fin == 'ा' && (inc(c.allvowels, beg) || inc(c.soft, beg))) clean = [samasa, c.visarga].join('');
    // if (inc(c.soft, beg)) log('============>>>>>>', fin, 2, beg, 3, fin == 'ो' ) // मय्यर्पितमनो
    return clean;
}


function getDocs(cb) {
    var view = 'gita/byDocs';
    relax
        .view(view)
    // .query(query)
        .query({include_docs: true})
        .query({limit: 10000})
        .end(function(err, res) {
            if (err) cb(err);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs = _.map(rows, function(row) { return row.doc; });
            cb(docs);
        });
    // cb([]);
}
