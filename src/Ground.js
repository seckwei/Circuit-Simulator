// @flow

const Component = require('./Component.js'),
    Pin = require('./Pin.js'),
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

    /**
     * Throw error if this is called.
     * This method is implemented to override the parent's.
     */
    stamp(): void {
        throw new TypeError('Ground component does not need to stamp any matrices!');
    }
}

module.exports = Ground;