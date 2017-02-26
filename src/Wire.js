// @flow

const { Component, Pin } = require('./Component.js');

/**
 * Wire class
 * A zero voltage source
 */
class Wire extends Component {

    /**
     * Creates an instance of Wire.
     */
    constructor() {
        super('W');
        this.controlled = { V: 0 };
        this.dependant = { V: undefined, I: undefined };
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }
}

module.exports = Wire;