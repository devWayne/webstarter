#!/usr/bin/env node

var program = require('commander'),
	path = require('path'),
	fs= require('fs'),
	pkg = require('../package.json'),
	readline = require('readline'),
	mkdirp = require('mkdirp');

program
	.version(pkg.version)
	.usage('[options] [dir]')
	.description('initial folder...')
	.parse(process.argv);

var destination_path = program.args.shift() || '.';

(function createApplication(path) {
  emptyDirectory(path, function(empty){
    if (empty || program.force) {
      createApplicationAt(path);
    } else {
      confirm('destination is not empty, continue? [y/N] ', function (ok) {
        if (ok) {
          process.stdin.destroy();
          createApplicationAt(path);
        } else {
          abort('aborting');
        }
      });
    }
  });
})(destination_path);

function emptyDirectory(path, fn) {
  fs.readdir(path, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
}

function confirm(msg, callback) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(msg, function (input) {
    rl.close();
    callback(/^y|yes|ok|true$/i.test(input));
  });
}

function abort(str) {
  console.error(str);
  process.exit(1);
}

function createApplicationAt(path) {
console.log(path);
}
