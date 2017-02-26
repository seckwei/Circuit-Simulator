// @flow

const { Component, Pin } = require('./Component.js'),
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
}

module.exports = CurrentSource;