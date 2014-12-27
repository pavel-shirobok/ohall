var _ = require('lodash');
var logger = require('../logger');

exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'find [query]';
    self.description = 'Finding available packages by query';
    self.fn = function(query) {

        logger.createFindHeaderMessage(query).log();

        _.each(ohAll.find(query), function($package){
            logger.createFindResultMessage(
                $package.name, $package.description
            ).log();
        });
    }
};