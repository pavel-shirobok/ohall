//function



/*
function PackageInfo (name, description, directory, default_version) {
    var self = this;
    var versions = {};

    self.addVersion = function(packageVersion){
        versions[packageVersion.version] = packageVersion;
    };

    self.__defineGetter__('name', function(){return name; });
    self.__defineGetter__('description', function(){return description; });
    self.__defineGetter__('directory', function(){return directory});
    self.__defineGetter__('versions', function(){return versions});
    self.__defineGetter__('default_version', function(){return default_version; });
}

function VersionInfo(version, directory, default_build) {
    var self = this;
    var builds = {};
    self.addBuild = function(name) {
        builds[name] = name;
    };

    self.__defineGetter__('builds', function(){return builds; });
    self.__defineGetter__('version', function(){ return version; });
    self.__defineGetter__('directory', function(){ return directory; });
    self.__defineGetter__('default_build', function(){ return default_build; });
}



module.exports.VersionInfo = VersionInfo;
module.exports.PackageInfo = PackageInfo;*/
