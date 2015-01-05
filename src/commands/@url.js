var logger = require('../logger');
var open = require('open');
exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'url [package]';
    self.description = 'Open url for specific package';
    self.fn = function(packageName) {
        var $package = ohAll.packages.get(packageName);
        if(!$package){
            //todo logger error
            console.log('unknown %s', packageName);
            return;
        }

        open($package.url);
    };
};