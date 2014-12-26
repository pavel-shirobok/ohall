var _                 = require('lodash');


var RQ                = require('./request_helper').RQ;
var PackageCollection = require('./packageCollection');
var config            = require('./config');


var OhAll = function(settings){
    this.settings = settings;
    this.packages = undefined;
};

OhAll.prototype.setSetting = function(name, value) {
    this.settings.set(name, value).flushSettings();
    return this;
};

OhAll.prototype.getSetting = function(name) {
    return this.settings.get(name);
};

OhAll.prototype.loadPackages = function(onComplete, onError) {

    var request_parameters = {
        url : this.settings.get('CDN_URL') + '/' + config.PACKAGES_FILENAME
    };

    var self = this;
    RQ(request_parameters).
        onComplete(function(data){
            self.packages = PackageCollection.parseRawPackagesJson(data);
            onComplete && onComplete();
        }).
        onProgress(function(){}).
        onError(function(error){
            onError && onError(error);
        }).
        finish();
};

OhAll.prototype.getList = function(onPackage) {
    _.each(this.packages.__packages, function($package){
        onPackage && onPackage($package);
    });
};

OhAll.prototype.getBlobUrl = function(blob, version, build){
    //TODO
};

OhAll.prototype.install = function(url, onComplete, onError, onProgress) {
    //TODO
};





module.exports.createOhAll = function(settings){
    return new OhAll(settings);
};