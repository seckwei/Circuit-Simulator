// @flow

const { Component, Pin } = require('./Component.js'),
    ComponentType = require('./ComponentType.js');;

/**
 * VoltageSource class
 */
class VoltageSource extends Component {

    /**
     * Creates an instance of VoltageSource.
     * @param {number} [initVoltage=5]
     * @param {string} [symbol=V]
     */
    constructor(initVoltage: number = 5, symbol: string = 'V') {
        super(symbol);
        this.type = ComponentType.TYPE_SOURCE;
        this.controlled = { V: initVoltage };
        this.dependant = { I: undefined };
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }
}

module.exports = VoltageSource;