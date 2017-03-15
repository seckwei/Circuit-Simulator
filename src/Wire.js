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

    /**
     * Updates this component's dependant values and pins' voltage.
     * Called from CircuitUpdater update() method
     * @param {Object} value 
     */
    update(value: Object): void {
        super.update(value);
        this.dependant.V = value.pins[0];
    }
}

module.exports = Wire;