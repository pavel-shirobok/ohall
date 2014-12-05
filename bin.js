#!/usr/bin/env node
var commander = require('commander');
var _ = require('lodash');

var dummer = require('./index.js');
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

            var packageStruct = dummer.parseVersion(packageName);
            var packageInfo = packages[packageStruct.name];

            if( packageInfo ){
                var installInfo = dummer.createInstallInfo(packageInfo, packageStruct.version, packageStruct.build);

                //console.log("Installing %s  version: %s build: %s", installInfo.package.name.green, installInfo.version, installInfo.build.name);

                /*console.log(installInfo.package.name);
                console.log(installInfo.version.version);
                console.log(installInfo.build.name);*/

                dummerInstance.install(installInfo, function(packageName, status, error){
                    switch (status) {
                        case 'started' : break;
                        case 'complete' : break;
                        case 'error' : break;
                    }
                });
            }else{
                console.log("Unknown package name \"%s\". Please check available packages with \"dummer list\" command".red, packageStruct.name);
            }
        });
    });

commander.parse(process.argv);