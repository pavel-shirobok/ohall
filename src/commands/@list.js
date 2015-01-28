exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'list';
    self.description = 'Show all available packages';
    self.fn = function() {
        ohAll.getList(function($package){
            console.log($package.name + ' : ' + $package.description);
        });
    }
};