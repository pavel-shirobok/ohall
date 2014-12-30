var _ = require('lodash');
var logger = require('../logger');

exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'tell [packageName]';
    self.description = 'Tell about versions and builds for concrete package';
    self.fn = function(packageName) {

        var $package = ohAll.packages.get(packageName);

        console.log($package.name);

        logger.createTellHeader(
            $package.name
        ).log();

        _.each(
            _.sortBy($package.get(), 'name'),
            function($version){
                var builds = [];

                _.each($version.get(), function($build) {
                    builds.push($build.name);
                });

                logger.createTellAboutVersion(
                    $version.name,
                    builds,
                    $package.defaultVersion,
                    $version.defaultBuild
                ).log();
            }
        );

    }
};