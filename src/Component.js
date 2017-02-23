// @flow

const Matrix = require('./Matrix.js');

class Pin {
	position : Array<Array<number>>
	visited : boolean
	parent : Component
	index : number

	constructor(parent: Component, index: number) {
		this.parent = parent;
		this.index = index;
	}
}

module.exports.Pin = Pin;

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

module.exports.Component = Component;