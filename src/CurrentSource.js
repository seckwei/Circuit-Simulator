// @flow

const { Component, Pin } = require('./Component.js');

class CurrentSource extends Component {
    constructor(initCurrent: number = 5) {
        super('I');
        this.controlled = { I: initCurrent };
        this.dependant = { V: undefined };
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }
}

module.exports = CurrentSource;