var r = function(name) { return require('./' + name); };
exports = module.exports = [
    r('configSet'),r('configGet'),
    r('list'),
    r('install')
];