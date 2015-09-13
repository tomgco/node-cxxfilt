module.exports = function (input, cb) {
  var index = 0;
  if ((index = input.indexOf('_Z')) > 0) {
    var mangled = input.substr(index + 2)
    cb(null, mangled);
  } else {
    return cb(new Error('Not a mangled'));
  }
};
