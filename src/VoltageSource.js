// @flow

const Component = require('./Component.js'),
    Pin = require('./Pin.js'),
    ComponentType = require('./ComponentType.js');

/**
 * VoltageSource class
 */
class VoltageSource extends Component {

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
    stamp(matrixY: Matrix, matrixJ: Matrix):void {
        const [from, to] = this.nodes,
            vSourceIndex = matrixY.data.length - this.vSourceNum;

        matrixY.data[vSourceIndex][from] = matrixY.data[from][vSourceIndex] = 1;
        matrixY.data[vSourceIndex][to] = matrixY.data[to][vSourceIndex] = -1;

        matrixJ.data[vSourceIndex][0] = this.controlled.V
    }
}

module.exports = VoltageSource;