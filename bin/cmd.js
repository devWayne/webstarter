#!/usr/bin/env node

var program = require('commander'),
	path = require('path'),
	pkg = require('../package.json'),
	sv = require('../index');
program
	.version(pkg.version)

program
	.command('init')
	.description('initial folder...')
	.action(function() {
	});

program.parse(process.argv);
