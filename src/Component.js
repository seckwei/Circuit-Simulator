// @flow

const Pin = require('./Pin.js');

class Component {
    constructor() {
        if(this.constructor === Component) {
            throw TypeError('Unable to instantiate abstract Component class');
        }
    }

    otherPin(pinIndex: number): Array<Pin> {}

    stamp(matrixY: Matrix, matrixJ: Matrix): void {
        throw TypeError('Abstract function stamp() not overriden');
    }
}

module.exports = Component;