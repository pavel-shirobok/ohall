var spin = require('term-spinner');

var Spinner = function() {
    this.spin = spin.new(spin.types.Spin1);
    this.interval = -1;
};

Spinner.prototype.start = function(){
    var self = this;
    this.print();
    this.interval = setInterval(function(){
        self.spin.next();
        self.print();
    }, 100)
};

Spinner.prototype.print = function(){
    this.clearSpinner();
    //todo logger
    process.stdout.write(["Processing...".blue, this.spin.current.red].join(" "));
};

Spinner.prototype.clearSpinner = function(){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
}

Spinner.prototype.stop = function(){
    if(this.interval == -1) return;
    clearInterval(this.interval);
    this.interval = -1;
    this.clearSpinner();
};


exports = module.exports = Spinner;