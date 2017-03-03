// @flow

/**
 * Pin class
 */
class Pin {
    
	parent : Component
	index : number
	position : number[]|null
	visited : boolean

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

module.exports = Pin;