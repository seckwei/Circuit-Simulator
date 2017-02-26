// @flow

const { Component, Pin } = require('./Component.js'),
    ComponentType = require('./ComponentType.js');;

/**
 * Ground class
 */
class Ground extends Component {

    /**
     * Creates an instance of Ground.
     */
    constructor() {
        super('G');
        this.type = ComponentType.TYPE_GROUND;
        this.controlled = { V: 0 };
        this.dependant = {};
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }
}

module.exports = Ground;