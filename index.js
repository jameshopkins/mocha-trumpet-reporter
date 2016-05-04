/*
  Shamelessly copied from https://github.com/mochajs/mocha/blob/master/lib/reporters/spec.js
*/

var fs = require('fs');
var sfx = require('sfx');

var Base = require('mocha/lib/reporters/base');
var inherits = require('mocha/lib/utils').inherits;
var color = Base.color;
var cursor = Base.cursor;

var trumpet = fs.readFileSync(__dirname + '/trumpet.txt', 'utf-8');

/**
 * Expose `Spec` w/ a trumpet.
 */

exports = module.exports = Trumpet;

/**
 * Initialize a new `Spec` test reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function Trumpet(runner) {
  Base.call(this, runner);

  var self = this;
  var indents = 0;
  var n = 0;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('start', function() {
    console.log();
  });

  runner.on('suite', function(suite) {
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function() {
    --indents;
    if (indents === 1) {
      console.log();
    }
  });

  runner.on('pending', function(test) {
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function(test) {
    var fmt;
    if (test.speed === 'fast') {
      fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s');
      cursor.CR();
      console.log(fmt, test.title);
    } else {
      fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s')
        + color(test.speed, ' (%dms)');
      cursor.CR();
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function(test) {
    console.log(trumpet);
    sfx.play(__dirname + '/sound.m4a');
    cursor.CR();
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.on('end', function() {
    return this.epilogue();
  }.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Trumpet, Base);
