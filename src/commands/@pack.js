var fs     = require('fs');
var path   = require('path');
var _      = require('lodash');
var logger = require('../logger');

exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'pack [query]';
    self.description = 'Packing version';
    self.fn = function(rawQuery) {

        var _dir= './src'
        var rootPackages = JSON.parse(fs.readFileSync('./packages.json'));
        var packageDescriptor = ohAll.createPackageDescriptor(rawQuery, _dir);

        var path_list = ohAll.generatePathFromDescriptor(packageDescriptor, _dir);

        _.each(path_list, function(pathInfo){
            ohAll.pack(pathInfo.path, function(zip){

                var zipOptions = { type:'nodebuffer', compression:'DEFLATE', comment : pathInfo.comment };
                var zipFileContent = zip.generate(zipOptions)
                var zipFileName = path.normalize( './' + pathInfo.file + '.zip');

                fs.writeFileSync(zipFileName, zipFileContent, 'binary');
                //TODO logger
            }, function(err){
                console.log(err); //TODO logger
            })
        });





        //read packages.json
        // - add package
        // - add default version
        // - add versions
        // - add builds
        // - add default builds
    }



};