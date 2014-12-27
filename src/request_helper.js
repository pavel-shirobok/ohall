var request = require('request');
var _ = require('lodash');

var RQ = function (parameters) {
    var self = this;
    var noop = function () { };
    self.callbacks = {};
    self.parameters = parameters;

    self.onComplete = function (onCompleteCallback) {
        self.callbacks.onComplete = onCompleteCallback || noop;
        return self;
    };

    self.onProgress = function (onProgressCallback) {
        self.callbacks.onProgress = onProgressCallback || noop;
        return self;
    };

    self.onError = function (onErrorCallback) {
        self.callbacks.onError = onErrorCallback || noop;
        return self;
    };

    self.finish = function () {
        var config = _.extend({
            //TODO default params
            format: 'json'
        }, self.parameters);
        request(config, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                self.callbacks.onComplete(
                    format(body)
                );
            } else {
                self.callbacks.onError(error);
            }
        });

        function format(data) {
            switch (config.format) {
                case 'json' : return JSON.parse(data); break;

                case 'text': return data; break;
            }
        }

        return {};
    };


    self.
        onComplete(noop).
        onProgress(noop).
        onError(noop);
};

module.exports.RQ = function (parameters) {
    return new RQ(parameters);
};
