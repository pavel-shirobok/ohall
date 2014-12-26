var fs = require('fs');
var path = require('path');

var Settings = function(file, default_settings){
    this.file = path.resolve(__dirname + '\\..\\' + file);

    this.__createFileIfNotExist(this.file, default_settings);

    this.settings = this.__readSettingsFile(this.file);
};

Settings.prototype.__createFileIfNotExist = function(file, config){
    if(!fs.existsSync(file)){
        this.flushSettings(this.file, config);
    }
};

Settings.prototype.__readSettingsFile = function(file) {
    var settingsRaw = fs.readFileSync(file, {encoding : 'utf8'});
    return JSON.parse(settingsRaw);
};

Settings.prototype.set = function(name, value) {
    this.settings[name] = value;
    return this;
};

Settings.prototype.get = function(name) {
    return this.settings[name];
};

Settings.prototype.flushSettings = function(file, settings) {
    file = file || this.file;
    settings = settings || this.settings;

    fs.writeFileSync(
        file,
        JSON.stringify(settings, null, 4),
        {encoding : 'utf8'}
    )

    return this;
};

module.exports.createSettings = function(filename, default_settings){
    return new Settings(filename, default_settings);
};