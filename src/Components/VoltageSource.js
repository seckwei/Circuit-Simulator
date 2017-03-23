// @flow

import Component from './Component.js';
import Pin from './Pin.js';
import ComponentType from '../ComponentType.js';

/**
 * VoltageSource class
 */
export default class VoltageSource extends Component {

    vSourceNum: number;

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

        /**
         * Denotes the n-th voltage source. This is so that we know
         * which row and col of the Y and J matrices to stamp.
         * @type {number}
         */
        this.vSourceNum = 0;
    }

    /**
     * Stamps the matrices Y and J
     * @param {Matrix} matrixY 
     * @param {Matrix} matrixJ
     */
    stamp(matrixY: Matrix, matrixJ: Matrix): void {
        const [from, to] = this.nodes,
            vSourceIndex = matrixY.data.length - this.vSourceNum;

        matrixY.data[vSourceIndex][from] = matrixY.data[from][vSourceIndex] = 1;
        matrixY.data[vSourceIndex][to] = matrixY.data[to][vSourceIndex] = -1;

        matrixJ.data[vSourceIndex][0] = this.controlled.V
    }

    /**
     * Updates this component's dependant values and pins' voltage.
     * Called from CircuitUpdater update() method
     * @param {Object} value 
     */
    update(value: Object): void {
        this.dependant.I = value.I;
        this.pins[0].V = value.pins[0];
        this.pins[1].V = value.pins[1];
    }
}

