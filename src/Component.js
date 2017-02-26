// @flow

const Matrix = require('./Matrix.js');

/**
 * Pin class
 */
class Pin {
    
	position : number[][]|null
	visited : boolean
	parent : Component
	index : number

    /**
     * Creates an instance of Pin.
     * @param {Component} parent 
     * @param {number} index 
     */
	constructor(parent: Component, index: number) {
        /**
         * Component that "owns" this pin
         * @type {Component}
         */
		this.parent = parent;
        /** 
         * Index of this pin in the parent
         * @type {number}
        */
		this.index = index;
        /**
         * Position on the board
         * @type {number[][] | null} [position=false]
         */
        this.position = null;
        /**
         * Visited by the Traverser during parsing
         * @type {boolean} [visited=false]
         */
        this.visited = false;
	}
}

module.exports.Pin = Pin;

/**
 * Component class
 */
class Component {

    static idCount: number;
    
    id: string;
    label: string;
    type: Symbol;
    controlled: Object;
    dependant: Object;
    pins: Pin[];
    nodes: number[];

    /**
     * Creates an instance of Component.
     * @param {string} prefix 
     */
    constructor(prefix: string) {
        if(this.constructor === Component) {
            throw TypeError('Unable to instantiate abstract Component class');
        }

        /**
         * Id of the component. Example: I1, R2, V3...
         * @type {string}
         */
        this.id = prefix + Component.idCount;

        /**
         * Static Id counter i.e. each component has ascending order of Id number
         * @type {number}
         */
        ++Component.idCount;

        /**
         * User defined label - currently not editable
         * @type {string}
         */
        this.label = 'unlabelled';

        /**
         * Type of component. Example: Source, Resistor...
         * @type {Symbol}
         */
        this.type = Symbol('untyped');

        /**
         * Object that holds the variables that are user-controlled
         * @type {Object}
         */
        this.controlled = {};

        /**
         * Object that holds the variables that are calculated from the analysis
         * @type {Object}
         */
        this.dependant = {};

        /**
         * Array of this component's pins
         * @type {Pin[]}
         */
        this.pins = [];

        /**
         * The nodes this component's pins are connected
         * @type {number[]}
         */
        this.nodes = [];
    }

    /**
     * Returns an array of the other pins aside from the pin index provided
     * @public
     * @param {number} pinIndex 
     * @returns {Pin[]}
     */
    otherPin(pinIndex: number): Pin[] {
        let copy = this.pins.slice();
        copy.splice(pinIndex, 1);
        return copy;
    }

    /**
     * Stamps the Y and J matrices
     * @public
     * @abstract
     * @param {Matrix} matrixY 
     * @param {Matrix} matrixJ
     */
    stamp(matrixY: Matrix, matrixJ: Matrix): void {
        throw TypeError('Abstract function stamp() not overriden');
    }
}

Component.idCount = 0;

module.exports.Component = Component;