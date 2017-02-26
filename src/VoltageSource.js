// @flow

const { Component, Pin } = require('./Component.js');

/**
 * VoltageSource class
 */
class VoltageSource extends Component {

    /**
     * Creates an instance of VoltageSource.
     * @param {number} [initVoltage=5] 
     */
    constructor(initVoltage: number = 5) {
        super('V');
        this.controlled = { V: initVoltage };
        this.dependant = { I: undefined };
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }
}

module.exports = VoltageSource;