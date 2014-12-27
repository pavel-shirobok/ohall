var logger = require('../logger');

exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'get [name]';
    self.description = 'Getting global config\'s value';
    self.fn = function(name) {
        logger.createConfigGetMessage(
            name, ohAll.getSetting(name)
        ).log();
    }
};