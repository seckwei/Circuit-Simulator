// @flow

const Component = require('./Component.js'),
    Pin = require('./Pin.js'),
    ComponentType = require('./ComponentType.js');

/**
 * CurrentSource class
 */
class CurrentSource extends Component {

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
}

module.exports = CurrentSource;