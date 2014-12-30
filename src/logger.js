var _ = require('lodash');
require('colors').setTheme({
    variable : 'blue',
    value    : 'yellow',
    tab      : 'grey',
    pckg     : 'red'
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

module.exports.createEmptyFindResultMessage = function(query){
    return new Message( (' I can\'t find anything by "' + query + '"').red );
};

module.exports.createTellHeader = function(packageName) {
    return new Message('> I tell you about "' + packageName.pckg + '". There are next versions :')
};

module.exports.createTellAboutVersion = function(versionName, builds, defaultVersion, defaultBuild){
    function highlight(value, flag){ return value == flag ? value.bgGreen.white : value.red; }

    return new Message(
        ' * ' + highlight(versionName, defaultVersion) +
        '\t - [ ' +
            _.map(
                _.sortBy(builds),
                function(b){ return highlight(b, defaultBuild); }
            ).join(', ') +
        ' ]'
    );
};