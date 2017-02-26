// @flow

const { Component, Pin } = require('./Component.js'),
    ComponentType = require('./ComponentType.js');;

/**
 * Resistor class
 */
class Resistor extends Component {

    /**
     * Creates an instance of Resistor.
     * @param {number} [initResistance=5] 
     */
    constructor(initResistance: number = 5) {
        super('R');
        this.type = ComponentType.TYPE_RESISTOR;
        this.controlled = { R: initResistance };
        this.dependant = { I: undefined, V: undefined };
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }
}

module.exports = Resistor;