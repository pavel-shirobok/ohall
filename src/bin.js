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

console.log("Wait please..."); // TODO color

ohAll.loadPackages(
    function() {
        commander.parse(process.argv);
    },
    function(error){
        //TODO error console
        console.log(error);
    }
);



/*
var commander = require('commander');
var _ = require('lodash');

var dummer = require('./../src/index.js');
var Dummer = dummer.Dummer;

var dummerInstance = new Dummer();

commander.
    version('0.0.1');

commander.
    command('list').
    description('Get list af available libraries').
    action(function () {
        console.log("Retrieving packages list...".blue);
        dummerInstance.list(function (packages) {
            _.each(packages, function (value) {
                console.log('*', value.name.green, ':', value.description.grey);
            });
        });
    });

commander.
    command('install [packageName]').
    description('Install library in local directory').
    action(function(packageName){

        if(!packageName) {
            console.log('Define package name, please...'.red);
            return;
        }

        console.log("Retrieving packages list...".blue);
        dummerInstance.list(function(packages){

            var parsedVersion = dummer.parseVersion(packageName);
            var packageStructure = packages[parsedVersion.name];
            if( packageStructure ){

                var version = dummer.getVersion(packageStructure, parsedVersion.version);

                if(version){
                    var build = dummer.getBuild(packageStructure, version, parsedVersion.build);
                    if(build){
                        dummerInstance.install(
                            packageStructure, version, build,
                            __dirname,
                            function(filename){
                                console.log("Start loading of %s".green, filename.red);
                            }, function(){
                               //progress
                            }, function () {
                               //complete
                            }
                        );
                    }else{
                        console.log("Unknown build \"%s\".".red, parsedVersion.build);
                    }
                } else {
                    console.log("Unknown version \"%s\"".red, parsedVersion.version);
                }


                //var installInfo = dummer.createInstallInfo(packageInfo, packageStruct.version, packageStruct.build);

                //console.log("Installing %s  version: %s build: %s", installInfo.package.name.green, installInfo.version, installInfo.build.name);

                */
/*console.log(installInfo.package.name);
                console.log(installInfo.version.version);
                console.log(installInfo.build.name);*//*


                */
/*dummerInstance.install(installInfo.package, installInfo.version, installInfo.build, function(packageName, status, error){
                    switch (status) {
                        case 'started' : break;
                        case 'complete' : break;
                        case 'error' : break;
                    }
                });*//*

            }else{
                console.log("Unknown package name \"%s\". Please check available packages with \"dummer list\" command".red, packageStruct.name);
            }
        }, function(err){
            console.log('Error "%s" '.red, err.message)
        });
    });

commander.parse(process.argv);*/
