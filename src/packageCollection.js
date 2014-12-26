var _ = require('lodash');

var PackageCollection = function(){
    this.__packages = {};
};

PackageCollection.prototype.add = function($package){
    this.__packages[$package.name] = $package;
    return this;
};

PackageCollection.prototype.get = function(name){
    if(name){
        return this.__packages[name];
    }
    return this.__packages;
};

PackageCollection.parseRawPackagesJson = function(rawPackages) {
    var packageCollection = new PackageCollection();

    _.each(rawPackages, function(pack){
        packageCollection.add(
            Package.parseRawPackage(pack)
        );
    });

    return packageCollection;
};

var Package = function(name, description, defaultVersion){
    this.name = name;
    this.description = description;
    this.defaultVersion = defaultVersion;
    this.__versions = {};
};

Package.prototype.addVersion = function(version) {
    this.__versions[version.name] = version;
    return this;
};

Package.parseRawPackage = function(rawPackage){
    var $package = new Package(
        rawPackage.name,
        rawPackage.description,
        rawPackage.default_version
    );

    _.each(rawPackage.versions, function(rawVersion){
        $package.addVersion(
            Version.parseRawVersion(rawVersion)
        );
    });

    return $package;
};

var Version = function(name, defaultBuild){
    this.name = name;
    this.defaultBuild = defaultBuild;
    this.__builds = {};
};

Version.prototype.addBuild = function(build){
    this.__builds[build.name] = build;
    return this;
};

Version.parseRawVersion = function(rawVersion) {
    var version = new Version(
        rawVersion.version,
        rawVersion.default_build
    );

    _.each(rawVersion.builds, function(rawBuild){
        version.addBuild(
            Build.parseRawBuild(rawBuild)
        );
    });

    return version;
};

var Build = function(name){
    this.name = name;
};

Build.parseRawBuild = function(rawBuild) {
    return new Build(rawBuild);
};

exports = module.exports = PackageCollection;