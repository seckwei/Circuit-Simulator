// @flow

const Component = require('./Component.js'),
    Pin = require('./Pin.js'),
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
            [from, to] = this.nodes;

        matrixY.data[to][to] += G;
        matrixY.data[from][from] += G;
        matrixY.data[to][from] += -G;
        matrixY.data[from][to] += -G;
    }

    /**
     * Updates this component's dependant values and pins' voltage.
     * Called from CircuitUpdater update() method
     * @param {Object} value 
     */
    update(value: Object): void {
        let [p0, p1] = value.pins;
       
        this.pins[0].V = p0;
        this.pins[1].V = p1;
        
        this.dependant.V = Math.abs(p0 - p1);
        this.dependant.I = this.dependant.V / this.controlled.R;
    }
}

module.exports = Resistor;