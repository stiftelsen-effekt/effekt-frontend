const Pane = require('./paneClass.js');

module.exports = class PaypalPane extends Pane {
    constructor(config) {
        super(config);

        this.resizableOnMobile = true;
        
        this.hide();
    }

    focus() {
        
    }

    submit() {
        //Goto result for vipps
    }
} 