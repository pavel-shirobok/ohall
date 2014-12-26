exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'list';
    self.description = 'Show all available packages';
    self.fn = function() {
        //TODO make some console
        ohAll.getList(function($package){
            console.log($package.name + ' : ' + $package.description);
        });
    }
};