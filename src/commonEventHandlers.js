module.exports.onQueryResolveError = function(error) {
    console.log(error);//TODO
}

module.exports.onPackageInstallComplete = function($package) {
    console.log($package.name, 'instalation complete');//TODO
}