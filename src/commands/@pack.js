var fs     = require('fs');
var path   = require('path');
var _      = require('lodash');
//var logger = require('../logger');

exports = module.exports = function(ohAll){




    var self = this;

    self.command = 'pack [query]';
    self.description = 'Packing version';
    self.fn = function(rawQuery) {

        var query = ohAll.parseQueryString(rawQuery);
        var _dir= './src';

        var $packages = ohAll.createPackageDescriptor(query, _dir);
        var $package = $packages.get(query.name);

        var path_list = ohAll.generatePathFromDescriptor($package, _dir);

        //noinspection JSUnresolvedFunction
        _.each(path_list, function(pathInfo){
            ohAll.pack(pathInfo.path, function(zip){

                var zipOptions = { type:'nodebuffer', compression:'DEFLATE', comment : pathInfo.comment };
                //noinspection JSUnresolvedFunction
                var zipFileContent = zip.generate(zipOptions);
                var zipFileName = path.normalize( './' + pathInfo.file + '.zip');

                fs.writeFileSync(zipFileName, zipFileContent, 'binary');
                //TODO logger
            }, function(err){
                console.log(err); //TODO logger
            });
        });

        var $rootPackages = ohAll.readPackagesFromFile('./packages.json');

        var $mergedPackages = $rootPackages.merge($packages);

        ohAll.writePackagesToFile($mergedPackages, './packages.json');
    }



};