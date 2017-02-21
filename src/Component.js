// @flow

const Pin = require('./Pin.js');

class Component {

    static idCount: number;
    
    id: String;
    label: String;
    type: Symbol;
    controlled: Object;
    dependant: Object;
    pins: Pin[];
    nodes: number[];

    constructor(prefix: string) {
        if(this.constructor === Component) {
            throw TypeError('Unable to instantiate abstract Component class');
        }
        this.id = prefix + Component.idCount;
        ++Component.idCount;
    }

    otherPin(pinIndex: number): Pin[] {
        let copy = this.pins.slice();
        copy.splice(pinIndex, 1);
        return copy;
    }

    stamp(matrixY: Matrix, matrixJ: Matrix): void {
        throw TypeError('Abstract function stamp() not overriden');
    }
}

Component.idCount = 0;

module.exports = Component;