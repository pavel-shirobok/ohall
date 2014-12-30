var _ = require('lodash');

/**
 * Root of package's collection descriptor
 * @constructor
 */
var PackageCollection = function(){
    this.__packages = {};
};

/**
 * Adding new package to collections
 * @param $package  new package object, instance of {@link Package}
 * @returns {PackageCollection}
 */
PackageCollection.prototype.add = function($package){
    this.__packages[$package.name] = $package;
    return this;
};

/**
 * Return {@link Package} by name(if name exist), and all available packages(hash collection of {@link Package}) if name is undefined
 * @param name name of package
 * @returns {Package} || {Object[] = {@link Package}}
 */
PackageCollection.prototype.get = function(name){
    if(name){
        return this.__packages[name];
    }
    return this.__packages;
};

//to-tell
PackageCollection.prototype.toPOJO = function() {
    return PackageCollection.toPOJO(this);
};

//to-tell
PackageCollection.prototype.merge = function($otherCollection) {
    return PackageCollection.parseRawPackages(
        _.merge(
            this.toPOJO(),
            $otherCollection.toPOJO(),
            function(a, b) { return _.isArray(a) ? _.uniq(a.concat(b)) : undefined; }
        )
    );
};

/**
 * Create {@link PackageCollection} instance from raw object(from cdn packages.json)
 * @param rawPackages
 * @returns {PackageCollection}
 */
PackageCollection.parseRawPackages = function(rawPackages) {
    var packageCollection = new PackageCollection();

    //noinspection JSUnresolvedFunction
    _.each(rawPackages, function(pack){
        packageCollection.add(
            Package.parseRawPackage(pack)
        );
    });

    return packageCollection;
};

//to-tell
PackageCollection.toPOJO = function($packages){
    return _.mapValues($packages.get(),function($package){
        return $package.toPOJO();
    });
};

/**
 * Descriptor for package
 * @param name
 * @param fullName
 * @param description
 * @param defaultVersion
 * @constructor
 * @param url
 * @param apiUrl
 */
var Package = function(name, fullName, description, defaultVersion, url, apiUrl){
    this.name = name;
    this.fullName = fullName;
    this.description = description;
    this.defaultVersion = defaultVersion;
    this.url = url;
    this.apiUrl = apiUrl;
    this.__versions = {};
};

/**
 * Adding {@link Version}
 * @param version
 * @returns {Package}
 */
Package.prototype.add = function(version) {
    this.__versions[version.name] = version;
    return this;
};

/**
 * Get or one {@link Version} by name or all versions with name = undefined
 * @param name
 * @returns {*}
 */
Package.prototype.get = function(name){
    if(name){
        return this.__versions[name];
    }
    return this.__versions;
};

//to-tell
Package.prototype.toPOJO = function(){
    return Package.toPOJO(this);
};

/**
 * Create {@link Package} from raw object (packages.json)
 * @param rawPackage
 * @returns {Package}
 */
Package.parseRawPackage = function(rawPackage){
    var $package = new Package(
        rawPackage.name,
        rawPackage.fullName,
        rawPackage.description,
        rawPackage.defaultVersion,
        rawPackage.url,
        rawPackage.apiUrl
    );

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    _.each(rawPackage.versions, function(rawVersion){
        $package.add(
            Version.parseRawVersion(rawVersion)
        );
    });

    return $package;
};

//to-tell
Package.toPOJO = function($package){
    var pojo = _.mapValues($package, function(value, key){
        if(key == '__versions'){
            return _.mapValues(value, function($version){
                return $version.toPOJO();
            });
        }

        return value;
    });

    pojo.versions = pojo.__versions;
    delete pojo.__versions;

    return pojo;
};

/**
 * Version descriptor
 * @param name
 * @param defaultBuild
 * @constructor
 */
var Version = function(name, defaultBuild){
    this.name = name;
    this.defaultBuild = defaultBuild;
    this.__builds = {};
};

/**
 * Adding of {@link Build}
 * @param build
 * @returns {Version}
 */
Version.prototype.add = function(build){
    this.__builds[build.name] = build;
    return this;
};

/**
 * Get or one {@link Build} by name or all builds with name = undefined
 * @param name
 * @returns {*}
 */
Version.prototype.get = function(name){
    if(name){
        return this.__builds[name];
    }
    return this.__builds;
};

//to-tell
Version.prototype.toPOJO = function(){
    return Version.toPOJO(this);
}

/**
 * Create {@link Version} from raw object (packages.json)
 * @param rawVersion
 * @returns {Version}
 */
Version.parseRawVersion = function(rawVersion) {
    var version = new Version(
        rawVersion.version,
        rawVersion.defaultBuild
    );

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    _.each(rawVersion.builds, function(rawBuild){
        version.add(
            Build.parseRawBuild(rawBuild)
        );
    });

    return version;
};

//to-tell
Version.toPOJO = function($version) {
    var pojo = _.mapValues($version, function(value, key){
        if('__builds' == key){
            return _.map(value, function(v, k){
                return v.name;
            });
        }
        return value;
    });

    pojo.builds = pojo.__builds;
    delete pojo.__builds;

    pojo.version = pojo.name;
    delete pojo.name;

    return pojo;
};

/**
 * Descriptor for build
 * @param name
 * @constructor
 */
var Build = function(name){
    this.name = name;
};

/**
 * Create {@link Build} from raw object (packages.json)
 * @param rawBuild
 * @returns {Build}
 */
Build.parseRawBuild = function(rawBuild) {
    return new Build(rawBuild);
};

//noinspection JSUnresolvedVariable
exports = module.exports = PackageCollection;