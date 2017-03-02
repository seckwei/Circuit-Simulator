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

    stamp(matrixY: Matrix, matrixJ: Matrix):void {
        const from = this.nodes[0],
            to = this.nodes[1],
            I = this.controlled.I;

        matrixJ.data[from][0] += -I;
        matrixJ.data[to][0] += I;
    }
}

module.exports = CurrentSource;