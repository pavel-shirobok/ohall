module.exports.onQueryResolveError = function(error) {
    console.log(error);//TODO
}

module.exports.onPackageInstallComplete = function($package, url, files) {
    console.log($package.name, 'instalation complete');//TODO
};