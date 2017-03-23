// @flow

import Component from './Component.js';
import Pin from './Pin.js';
import ComponentType from '../ComponentType.js';

/**
 * Utilising Norton Companion Model and Trapezoidal Approximation
 */
export default class Capacitor extends Component {

    constructor(initCapacitance: number = 1e-6) {
        super('C');
        this.type = ComponentType.TYPE_CAPACITOR;
        this.controlled = { C: initCapacitance };
        this.dependant = {
            // Initial state
            I: 0,
            V: 0,
            // Companion model's values
            companionG: undefined,
            companionI: undefined
        };
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }

    /**
     * Stamps the Y and J matrices
     * @param {Matrix} matrixY 
     * @param {Matrix} matrixJ
     * @param {Object} simConfig
     */
    stamp(matrixY: Matrix, matrixJ: Matrix, simConfig: Object): void {

        if(this.dependant.companionG == undefined) {
            this.dependant.companionG = 2 * this.controlled.C / simConfig.timestep;
        }
        this.dependant.companionI = this.dependant.I + this.dependant.companionG * this.dependant.V;

        const [from, to] = this.nodes;

        // Stamp the conductance for the companion model's resistor
        matrixY.data[to][to]     += this.dependant.companionG;
        matrixY.data[from][from] += this.dependant.companionG;
        matrixY.data[to][from]   += -this.dependant.companionG;
        matrixY.data[from][to]   += -this.dependant.companionG;

        // Stamp the current for the companion model's current source
        // The nodes are swapped because it is in oppsite direction
        matrixJ.data[from][0] += this.dependant.companionI;
        matrixJ.data[to][0]   += -this.dependant.companionI;
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

        this.dependant.V = p0 - p1;
        this.dependant.I = (this.dependant.V * this.dependant.companionG) - this.dependant.companionI;
    }
}