// @flow

/**
 * Pin class
 */
export default class Pin {
    
	parent : Component
	index : number
	position : number[]|null
	visited : boolean
    V: number

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
         * @type {number[][] | null} [position=null]
         */
        this.position = null;
        /**
         * Visited by the Traverser during parsing
         * @type {boolean} [visited=false]
         */
        this.visited = false;
        /**
         * Voltage on this pin
         * @type {number} [V=0]
         */
        this.V = 0;
	}
}

