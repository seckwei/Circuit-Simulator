// @flow

import Component from './Component.js';
import Pin from './Pin.js';
import ComponentType from '../ComponentType.js';

/**
 * CurrentSource class
 */
export default class CurrentSource extends Component {

    /**
     * Creates an instance of CurrentSource.
     * @param {number} [initCurrent=5] 
     */
    constructor(initCurrent: number = 5) {
        super('I');
        this.type = ComponentType.TYPE_SOURCE;
        this.controlled = { I: initCurrent };
        this.dependant = { V: undefined };
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }

    /**
     * Stamps the 'current' value only on the J matrix
     * @param {Matrix} matrixY 
     * @param {Matrix} matrixJ 
     */
    stamp(matrixY: Matrix, matrixJ: Matrix):void {
        const [from, to] = this.nodes,
            I = this.controlled.I;

        matrixJ.data[from][0] += -I;
        matrixJ.data[to][0] += I;
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
    }
}