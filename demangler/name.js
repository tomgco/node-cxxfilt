function lookAheadForNum(mangled) {
  var point = 0;
  var num = '';
  while (!Number.isNaN(+mangled[point])) {
    num += '' + mangled[point];
    point++;
  };
  return num;
}

module.exports = function isName(mangled, cb) {
  var first = true;
  if (mangled[0] === 'N') {
    return demangle(mangled.substr(1), first, [], cb);
  }
  cb(new Error('Not a name'));
};

function demangle(mangled, first, state, cb) {
  var tokenLength = lookAheadForNum(mangled);
  if (!tokenLength && first) {
    return cb(new Error('End of name'));
  }
  var item = mangled.substr(tokenLength.length, tokenLength);
  if (item) {
    state.push(item);
  }

  if (!tokenLength && !first) {
    var fnName = state.join('::');
    return cb(null, fnName);
  };


  demangle(mangled.substring(tokenLength.length + Number(tokenLength)), false, state, cb);
}
