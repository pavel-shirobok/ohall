#!/usr/bin/env node
var Spinner     = require('./spinner');
var argv        = require('optimist').argv;
var _           = require('lodash');
var config      = require('./config');
var settings    = require('./settings').
    createSettings(
        config.GLOBAL_CONFIG_FILENAME,
        config.DEFAULT_GLOBAL_CONFIG
    );

var ohAll = require('./ohall').createOhAll(settings);

var commander = require('commander');
commander.
    version(require('../package.json').version).
    option('--dev', 'Fast loading, using fake packages list');

_(require('./commands/commandsList')).each(function(CommandClass){
    var command = new CommandClass(ohAll);
    commander.
        command(command.command).
        description(command.description).
        action(command.fn);
});

var spinner = new Spinner();
spinner.start();




if(argv.dev) {
    console.log('Dev start'); // TODO logger
    ohAll.loadEmptyPackages(); //refactor for using loadFromObject({})
    spinner.stop();
    commander.parse(process.argv);
}else {
    ohAll.loadPackages(
        function() {
            spinner.stop();
            commander.parse(process.argv);
        },
        function(error){
            spinner.stop();
            //TODO error console
            console.log(error);
        }
    );
}

