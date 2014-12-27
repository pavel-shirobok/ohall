require('colors').setTheme({
    variable : 'blue',
    value    : 'yellow',
    tab      : 'grey'
});

function Message(str){
    this.string = str || '';
}

Message.prototype.log = function(){
    console.log(this.string);
};



module.exports.createConfigGetMessage = function(name, value) {
    return new Message('> '.tab + name.variable + ' = "' + value.value + '"');
};

module.exports.createConfigSetMessage = function(name, value){
    return new Message('> '.tab + name.variable + ' is "' + value.value + '" now');
};

module.exports.createFindHeaderMessage = function(query) {
    return new Message('Query : "' + query.red + '". ' + 'Found : ');
};

module.exports.createFindResultMessage = function(packageName, packageDescription){
    return new Message(' * '.tab + packageName.green + ' : ' + packageDescription.green);
};