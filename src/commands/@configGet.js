exports = module.exports = function(ohAll){
    var self = this;

    self.command = 'get [name]';
    self.description = 'Getting global config\'s value';
    self.fn = function(name) {
        //TODO make some format
        console.log(name + " : " + ohAll.getSetting(name));
    }
};