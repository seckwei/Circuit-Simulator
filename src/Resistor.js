// @flow

const { Component, Pin } = require('./Component.js'),
    ComponentType = require('./ComponentType.js');

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

    /**
     * Stamps the admittance matrix - matrixY
     * @param {Matrix} matrixY 
     */
    stamp(matrixY: Matrix):void {
        const G = 1 / this.controlled.R, //conductance
            from = this.nodes[0],
            to = this.nodes[1];

        matrixY.data[to][to] += G;
        matrixY.data[from][from] += G;
        matrixY.data[to][from] += -G;
        matrixY.data[from][to] += -G;
    }
}

module.exports = Resistor;