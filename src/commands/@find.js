var _ = require('lodash');
var logger = require('../logger');

exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'find [query]';
    self.description = 'Finding available packages by query';
    self.fn = function(query) {

        var findResult = ohAll.find(query);

        if(findResult.length == 0){
            logger.createEmptyFindResultMessage(
                query
            ).log();
            return;
        }

        logger.createFindHeaderMessage(query).log();
        _.each(findResult, function($package){
            logger.createFindResultMessage(
                $package.name, $package.description
            ).log();
        });
    }
};