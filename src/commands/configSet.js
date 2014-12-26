exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'set [name] [value]';
    self.description = 'Setting global config\'s value';
    self.fn = function(name, value) {
        //TODO make some console
        ohAll.setSetting(name, value);
    }
};