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

            self.__install(
                packages[0],
                eventHandlers.onPackageInstallComplete
            );
        } else {
            console.log('coming soon in version 0.2.0');
            //install from ohall.json
        }
    };

    self.__install = function(packageName, onComplete, onError){

        ohAll.resolveQuery(packageName, function($package, $version, $build){
            var blobUrl = ohAll.getBlobUrl($package, $version, $build);
            ///TODO some console output
            ohAll.install(blobUrl,
                function(){

                    onComplete && onComplete($package);

                    self.index++;
                    if(self.index < self.packages.length){
                        self.__install(self.packages[self.index], eventHandlers.onPackageInstallComplete);
                    }else {
                        //TODO global complete callback
                    }
                }, function(){
                    //TODO error
                }
            )


        }, eventHandlers.onQueryResolveError);
    }

};