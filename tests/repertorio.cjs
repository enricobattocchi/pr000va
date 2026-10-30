const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const engine = require('../assets/motore.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/repertorio.js'), 'utf8'), context);
const plates = engine.compile(context.window.TG_WORDS);
assert.equal(new Set(plates.map(e => e.plate)).size, plates.length, 'Targhe duplicate');
for (const entry of plates) {
  assert.match(entry.plate, /^[A-Z]{2} [0-8]{3} [A-Z]{2}$/);
  assert.equal(engine.decode(entry.plate), entry.word);
  if (entry.elongated) {
    const collapse = word => word.replace(/([AEIOU])\1+/g, '$1');
    assert.equal(collapse(entry.word), collapse(entry.baseWord));
  }
  if (engine.allowed(entry.plate)) assert.doesNotMatch(entry.plate, /[IOQU]/);
}
assert.equal(engine.decode('GO 000 OL'), 'GOOOOOL');
assert.equal(engine.decode('CI 400 OO'), 'CIAOOOO');
assert.equal(engine.decode('MA 551 MO'), 'MASSIMO');
assert.equal(engine.decode('ST 499 TA'), null);
assert.equal(engine.decode('EA 999 TS'), null);
assert.equal(engine.variants('PALLONE').length, 0);
assert.equal(engine.variants('CIAO').length, 0);
assert.deepEqual(engine.variants('GATTONA'), ['GA 770 NA']);
for (const invalid of ['SVISANO', 'BASTAVI', 'VISTALA', 'NOTAAAA', 'MAAAARE']) assert(!plates.some(e => e.word === invalid), invalid);
console.log(`${plates.length} targhe verificate: formato, decodifica, filtro e allungamenti.`);
