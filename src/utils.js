function parseVersion(string) {
    var p = { "*" : "", "@" : "", "!" : "" };

    var currentKey = '*', src = '*' + string;

    for(var i = 1; i < src.length; i++){
        var c = src[i];
        if(c in p){
            currentKey = c;
        }else{
            p[currentKey]+=c;
        }
    }

    return {
        name : p['*'],
        version : p['@'] || 'default',
        build : p['!'] || 'default'
    };
}



exports.modules.parseVersion = parseVersion;