var eventHandlers = require('../commonEventHandlers');

exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'install [packages...]';
    self.description = 'Install packages';


    self.index = 0;
    self.packages = [];
    self.fn = function(packages) {

        if(packages.length){
            self.packages = packages;

            self.next();

        } else {
            console.log('coming soon in version 0.2.0');
            //install from ohall.json
        }
    };

    self.next = function(){
        self.__nextInstall(function(packageName){
            self.__install(
                packageName,
                eventHandlers.onPackageInstallComplete,
                eventHandlers.onPackageInstallError
            );
        }, function(){/*TODO on complete all tasks*/});
    };

    self.__nextInstall = function(onNext, onComplete) {

        if(self.index < self.packages.length){
            var old_index = self.index;
            self.index ++;
            onNext && onNext(self.packages[old_index], old_index);
        }else {
            onComplete && onComplete();
        }
    };

    self.__install = function(packageName, onComplete, onError){

        ohAll.resolveQuery(packageName, function($package, $version, $build){

            var blobUrl = ohAll.getBlobUrl($package, $version, $build);

            ohAll.install(blobUrl,
                function(){
                    onComplete && onComplete($package);
                    self.next();
                }, onError
            );
        }, eventHandlers.onQueryResolveError);
    }

};