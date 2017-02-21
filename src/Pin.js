// @flow

const Component = require('./Component.js');

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

module.exports = Pin;