// @flow

/**
 * Component class
 */
export default class Component {

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
         * User defined label - not used at the moment
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
         * The nodes this component's pins are connected to
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
    otherPins(pinIndex: number): Pin[] {
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
     * @param {Object} simConfig
     */
    stamp(matrixY: Matrix, matrixJ: Matrix, simConfig: Object): void {
        throw TypeError('Abstract function stamp() not overriden');
    }
    
    /**
     * Updates the component's dependant field and the pins' voltage
     * @public
     * @abstract
     * @param {Object} values
     */
    update(values: {string: number}): void {
        throw TypeError('Abstract function update() not overriden');
    }
}

Component.idCount = 0;

