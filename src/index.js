/*
var prompt = require('prompt');
var color = require('color');
var request = require('request');
var info = require('./package_infos.js');
var _ = require('lodash');
var zip = require('node-zip');
var fs = require('fs');

var CDN_ROOT = 'http://localhost:333';

function Dummer() {
    var self = this;

    self.list = function(callback, onError) {
        Get(
            CDN_ROOT +  '/packages.json',
            function(list){

                var packages = {};
                _.each(list, function(value){
                    var packageInfo = new info.PackageInfo
                    (
                        value.name,
                        value.description,
                        value.directory,
                        value.default_version
                    );

                    _.each(value.versions, function(version){

                        var versionInfo = new info.VersionInfo(
                            version.version,
                            version.directory,
                            version.default_build
                        );

                        _.each(version.builds, function(build){
                           */
/* var buildInfo = new info.BuildInfo(
                                build.name,
                                build.js,
                                build.font,
                                build.css,
                                build.img
                            );*//*


                            versionInfo.add(build);
                        });

                        packageInfo.add(versionInfo);
                    });

                    packages[value.name] = packageInfo;
                });

                callback && callback(packages);
            },
            onError,
            'json'
        );
    };

    self.install = function(packageInfo, version, build, dest, onStart, onProgress, onFinish, onError){

        var file_name = packageInfo.name + '@' + version.version + '!' + build + '.zip';

        onStart && onStart(file_name, packageInfo, version, build);

        Get(CDN_ROOT + '/' + file_name, function(data){

                var unpacked = zip(data, {base64:false, checkCRC32:true });

                _.each(unpacked.files, function(value, key){
                    if(key.charAt(key.length - 1) == '/'){
                        if (!fs.existsSync(key)){
                            fs.mkdirSync(key);
                        }
                        return
                    }

                    var path = dest + '/' + key;
                    //console.log(path);

                    fs.writeFile(key, value._data, function(err){
                        console.log(path, err == undefined);
                    })

                    //console.log(v, key._data);
                });




                //console.log(unpacked.files['js/jquery-1.11.1.js']._data.length);

                onFinish && onFinish();
        },function(err){
            onError && onError();
        }, 'text',
        function(){
            //on progress
            onProgress && onProgress();
        },
            {
                encoding: null
            }
        );
    }
}




module.exports.parseVersion = parseVersion;
module.exports.Dummer = Dummer;

module.exports.getVersion = function (packageStructure, version) {
    if(version == 'default'){
        version = packageStructure.default_version;
    }

    return packageStructure.versions[version];
};

module.exports.getBuild = function(packageStructure, version, build){
    if(build == 'default'){
        build = version.default_build;
    }
    return version.builds[build];
};*/






module.exports.createOhAll = function(){
    return null;
};
