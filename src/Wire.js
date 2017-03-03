// @flow

const Component = require('./Component.js'),
    Pin = require('./Pin.js'),
    VoltageSource = require('./VoltageSource.js'),
    ComponentType = require('./ComponentType.js');

/**
 * Wire class
 * A zero voltage source
 */
class Wire extends VoltageSource {

    /**
     * Creates an instance of Wire.
     */
    constructor() {
        super(0, 'W');
        this.type = ComponentType.TYPE_CONNECTOR;
        this.dependant = { V: undefined, I: undefined };
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
    }
}

module.exports = Wire;