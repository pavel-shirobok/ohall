#!/usr/bin/env node

var _ = require('lodash');
var config = require('./config');
var settings = require('./settings').
    createSettings(
        config.GLOBAL_CONFIG_FILENAME,
        config.DEFAULT_GLOBAL_CONFIG
    );

var ohAll = require('./ohall').createOhAll(settings);

var commander = require('commander');

_(require('./commands/commandsList')).each(function(CommandClass){

    var command = new CommandClass(ohAll);
    commander.
        command(command.command).
        description(command.description).
        action(command.fn);
});

ohAll.loadPackages(
    function() {
        commander.parse(process.argv);
    },
    function(error){
        //TODO error console
        console.log(error);
    }
);