var logger = require('../logger');
var prompt = require('prompt');

exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'default';
    self.description = 'Resetting all settings to default';
    self.fn = function(name) {
        //TODO logger

        var schema = {
            properties: {
                answer: {
                    description: 'Are you agree with full reset of settings for ohall cli? (yes or no)'.blue,
                    pattern: /^(yes|no)$/i,
                    message: 'Only yes or no',
                    required: true
                }
            }
        };

        prompt.delimiter = '';
        prompt.message = '';
        prompt.start();
        prompt.get(schema, function (err, result) {
            if(err){
                console.log(err);
                return;
            }
            if(result.answer.toLowerCase() == 'yes') {
                ohAll.settingsToDefault();
                console.log('to default');//todo logger
            }
        });
    }
};