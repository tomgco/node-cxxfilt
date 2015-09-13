const assert = require('assert');
const fixtures = require('./fixtures');

const isMangled = require('../demangler/is-mangled');
const name = require('../demangler/name');
const args = require('../demangler/arguments');

fixtures.actual.forEach(function (input, item) {
  isMangled(input, function (err, mangled, i) {
    if (err) return;
    name(mangled, function (err, mapped) {
      args(mapped, function (err, mapped) {
        console.log('mangled: ', mangled);
        console.log('actual: ', mapped);
        console.log('expected: ', fixtures.expected[item], '\n');
        assert.equal(mangled, fixtures.expected[item]);
      });
    })
  });

});
