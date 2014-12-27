var fs   = require('fs');
var _    = require('lodash');

exports = module.exports = (function(){
    //exporting all files with filename in @ as first letter
   return _.map(
        _.filter(
            fs.readdirSync( __dirname ),
            function (filename) { return filename != '.' && filename != '..' && filename[0] == '@' }
        ),
        function (filename) { return require('./' + filename); }
    );
})();
