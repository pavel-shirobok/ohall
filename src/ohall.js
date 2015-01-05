var _                 = require('lodash');
var zip               = require('node-zip');
var fs                = require('fs');
var recursive         = require('recursive-readdir');
var path              = require('path');
var mkdirp            = require('mkdirp').sync;

var RQ                = require('./request_helper');
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

OhAll.prototype.settingsToDefault = function(){
    return this.settings.resetToDefault();
};

OhAll.prototype.loadPackages = function(onComplete, onError) {

    var request_parameters = {
        url : this.settings.get('CDN_URL') + '/' + config.PACKAGES_FILENAME
    };

    var self = this;
    RQ(request_parameters).
        onComplete(function(data){
            self.packages = PackageCollection.parseRawPackages(data);
            onComplete && onComplete();
        }).
        onProgress(function(){}).
        onError(onError).
        finish();
};

OhAll.prototype.loadEmptyPackages = function(){
    this.packages = PackageCollection.parseRawPackages({});
};

OhAll.prototype.getList = function(onPackage) {
    _.each(this.packages.get(), onPackage);
};

OhAll.prototype.getBlobUrl = function($package, $version, $build){
    var file_name = this.getBlobStringFormat($package.name, $version.name, $build.name) + '.zip';
    return [this.settings.get('CDN_URL'), file_name].join('/')
};

OhAll.prototype.getBlobStringFormat = function(packageName, versionName, buildName){
    return packageName + '@' + versionName + '!' + buildName;
};

OhAll.prototype.install = function(url, onComplete, onError, onProgress) {

    var self = this;
    RQ({ url : url, format : 'text', encoding: null}).
        onComplete(function(data){
            self.__unzip(
                data,
                function(fileName, fileContent){

                    var splited = fileName.split('\\');
                    splited.pop();

                    mkdirp(splited.join('\\'));
                    fs.writeFileSync(fileName, fileContent);
                },
                function(directory) {
                    if (!fs.existsSync(directory)){
                        fs.mkdirSync(directory);
                    }
                },
                onComplete,
                onError
            );
        }).
        onError(onError).
        finish();
};

OhAll.prototype.__unzip = function(data, onFile, onDirectory, onComplete, onError) {

    var unpacked;

    try{
        unpacked = zip( data, { base64:false, checkCRC32:true } );
    }catch ( zipError ) {
        onError && onError(zipError);
        return;
    }

    _.each(unpacked.files, function(value, key){
        if( key.charAt(key.length - 1) == '\\' ){
            onDirectory && onDirectory(key);
        } else {
            onFile && onFile(key, value._data);
        }
    });

    onComplete && onComplete();
};

OhAll.prototype.resolveQuery = function(query, onResolved, onError) {
    var parsedQuery = this.parseQueryString(query);

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

OhAll.prototype.parseQueryString = function(query) {
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

OhAll.prototype.find = function(query) {
    query = query.toLowerCase();
    var self = this;
    return _.filter(self.packages.get(), function($package){
        return  self.search($package.name, query) ||
                self.search($package.description, query) ||
                self.search($package.fullName, query);
    });
};

OhAll.prototype.search = function(str, query){
    query = query.toLowerCase();
    str   =   str.toLowerCase();
    return str.indexOf(query) > -1;
};

OhAll.prototype.createPackageDescriptor = function(query, _dir){
    var self = this;

    var $package = {};

    if(query.name.length == 0){
        throw new Error('Package query is empty');
    }

    scan(_dir, query.name,
        self.noop,
        function(packagePath){

            scan(
                [_dir, packagePath].join('/'),
                query.version,

                //Reading manifest
                function(dot) {
                    if('.manifest' == dot){
                        $package = JSON.parse(
                            fs.readFileSync([_dir, packagePath, dot].join('/'))
                        );
                        $package.versions = {};
                    }
                },
                //Reading version's directories
                function(versionPath){

                    $package.versions[versionPath] = {
                        version : versionPath,
                        builds : []
                    };

                    scan(
                        [_dir, packagePath, versionPath].join('/'),
                        query.build,
                        function(dot){
                            if('.defaultVersion' == dot){
                                $package.defaultVersion = versionPath;
                            }
                        },
                        //
                        function(buildPath){
                            $package.versions[versionPath].builds.push(buildPath);
                            scan(
                                [_dir, packagePath, versionPath, buildPath].join('/'),
                                'default',
                                function(dot){
                                    if('.defaultBuild' == dot){
                                        $package.versions[versionPath].defaultBuild = buildPath;
                                    }
                                }
                            )

                        }
                    )

                }

            );
    });
    function scan(path, query, onDot, onDir){
        _.each(
            fs.readdirSync(path),
            function(p){
                if(p == '.' || p == '..')return;

                if(p[0] == '.'){
                    onDot && onDot(p);
                } else {
                    if(query == 'default' || query == p){
                        onDir && onDir(p);
                    }
                }
            }
        )
    }

    return PackageCollection.parseRawPackages([$package]);
};

OhAll.prototype.generatePathFromDescriptor = function($package, _dir){
    var pathes = [];
    var self = this;
    _.each($package.get(), function($version){
        _.each($version.get(), function($build){
            pathes.push(
                {
                    path : [_dir, $package.name, $version.name, $build.name].join('/'),
                    file : self.getBlobStringFormat($package.name, $version.name, $build.name),
                    comment : $package.name + ' : ' + $package.description
                }
            );
        });
    });

    return pathes;
};

OhAll.prototype.pack = function(packageSourcePath, onComplete, onError){

    packageSourcePath = String(path.normalize(packageSourcePath));

    recursive(packageSourcePath, ['.defaultBuild'], function(err, packageSources){
        if(err)
            onError && onError(err);

        var zipHandle = zip();

        _.each(packageSources, function(srcPath){
            //some problem with pathes started with '\' so need to remove it before create file into zip
            zipHandle.file(
                path.normalize(srcPath.replace(packageSourcePath + '\\', '')),
                fs.readFileSync(srcPath),
                { createFolders : true }
            );
        });
        onComplete && onComplete(zipHandle);
    });

};

OhAll.prototype.noop = function(){};

OhAll.prototype.readPackagesFromFile = function(path){
    var raw = JSON.parse(fs.readFileSync(path));
    return PackageCollection.parseRawPackages(raw);
};

OhAll.prototype.writePackagesToFile = function($packages, path) {
    var pojo = $packages.toPOJO();
    fs.writeFileSync(path, JSON.stringify(pojo, null, 2));
};

module.exports.createOhAll = function(settings){
    return new OhAll(settings);
};