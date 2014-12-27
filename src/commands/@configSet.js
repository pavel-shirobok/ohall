var logger = require('../logger');

exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'set [name] [value]';
    self.description = 'Setting global config\'s value';
    self.fn = function(name, value) {
        ohAll.setSetting(name, value);
        logger.createConfigSetMessage(
            name, value
        ).log();
    };
};