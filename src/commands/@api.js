var logger = require('../logger');
var open = require('open');
exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'api [package]';
    self.description = 'Open  API url for specific package';
    self.fn = function(packageName) {
        var $package = ohAll.packages.get(packageName);
        if(!$package){
            //todo logger error
            console.log('unknown %s', packageName);
            return;
        }

        open($package.apiUrl);
    };
};