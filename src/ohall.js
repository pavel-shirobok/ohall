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
    _.each(this.packages.get(), onPackage);
};

OhAll.prototype.getBlobUrl = function($package, $version, $build){
    var file_name = $package.name + '@' + $version.name + '!' + $build.name + '.zip';
    return [this.settings.get('CDN_URL'), file_name].join('/')
};

OhAll.prototype.install = function(url, onComplete, onError, onProgress) {

    setTimeout(function(){
        onComplete && onComplete();
    }, 500);

    /*RQ({ url : url }).
        onComplete(function(data){

        }).
        onError(onError);*/
};

OhAll.prototype.resolveQuery = function(query, onResolved, onError) {
    var parsedQuery = this.__parseQueryString(query);

    var self = this;
    // Resolving package by name :
    self.__resolvePackage(
        parsedQuery.name,
        function($package){

            // Package resolved. Resolving version :
            self.__resolveVersion(
                $package,
                parsedQuery.version,
                function($version){

                    //Version resolved. Resolving build:
                    self.__resolveBuild(
                        $package,
                        $version,
                        parsedQuery.build,
                        function($build){

                            //All parts resolved!
                            onResolved && onResolved($package, $version, $build);

                        }, onError
                    )
                }, onError
            )
        },onError
    )

};

OhAll.prototype.__resolvePackage = function(name, onResolved, onError){
    var resolvedPackage = this.packages.get(name);
    if(resolvedPackage){
        onResolved && onResolved(resolvedPackage);
    }else{
        onError && onError('Unknown package name : ' + name);
    }
};

OhAll.prototype.__resolveVersion = function($package, ver, onResolved, onError){

    var version = ver;
    if(version == 'default'){
        version = $package.defaultVersion;
    }

    var $version = $package.get(version);
    if($version){
        onResolved && onResolved($version);
    }else{
        onError && onError('Unknown version : ' + ver);
    }
};

OhAll.prototype.__resolveBuild = function($package, $version, bld, onResolved, onError){

    var build = bld;
    if(build == 'default'){
        build = $version.defaultBuild;
    }

    var $build = $version.get(build);
    if($build){
        onResolved && onResolved($build);
    }else{
        onError && onError('Unknown build name : ' + bld);
    }
};

OhAll.prototype.__parseQueryString = function(query) {
    var p = { "*" : "", "@" : "", "!" : "" };

    var currentKey = '*', src = '*' + query;

    for(var i = 1; i < src.length; i++){
        var c = src[i];
        if(c in p){
            currentKey = c;
        }else{
            p[currentKey]+=c;
        }
    }

    return {
        name : p['*'],
        version : p['@'] || 'default',
        build : p['!'] || 'default'
    };
};

module.exports.createOhAll = function(settings){
    return new OhAll(settings);
};