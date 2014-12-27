var _ = require('lodash');
exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'find [query]';
    self.description = 'Finding available packages by query';
    self.fn = function(query) {
        //TODO make some format
        _.each(ohAll.find(query), function($package){
            console.log('*', $package.name, ':' + $package.description);
        });
    }
};