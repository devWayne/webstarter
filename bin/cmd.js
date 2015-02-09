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
	.option('-f, --force', 'force on non-empty directory')
	.description('initial folder...')
	.parse(process.argv);

var destination_path = program.args.shift() || '.';

var config=fs.readFileSync(__dirname + '/template/config.json', 'utf-8'),
    gulpfile=fs.readFileSync(__dirname + '/template/gulpfile.js', 'utf-8'),
    pkg=fs.readFileSync(__dirname + '/template/package.json', 'utf-8'),
    less=fs.readFileSync(__dirname + '/template/src/assets/css/page.less', 'utf-8'),
    js=fs.readFileSync(__dirname + '/template/src/assets/js/index.js', 'utf-8'),
    html=fs.readFileSync(__dirname + '/template/src/index.html', 'utf-8');





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

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str, mode) {
  fs.writeFileSync(path, str, { mode: mode || 0666 });
  console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
  mkdirp(path, 0755, function(err){
    if (err) throw err;
    console.log('   \033[36mcreate\033[0m : ' + path);
    fn && fn();
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
  mkdir(path,function(){
      mkdir(path + '/src');
      mkdir(path + '/src/assets');
      mkdir(path + '/src/assets/css',function(){
          write(path+'/src/assets/css/page.less',less);
      });
      mkdir(path + '/src/assets/js',function(){
          write(path+'/src/assets/js/index.js',less);
      });
      mkdir(path + '/src/vendor');
      write(path + '/index.html', html);
      write(path + '/config.json', config);
      write(path + '/gulpfile.js', gulpfile);
      write(path + '/package.json',pkg);
  })
}
