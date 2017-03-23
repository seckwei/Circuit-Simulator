// @flow

import Component from './Component.js';
import Pin from './Pin.js';
import VoltageSource from './VoltageSource.js';
import ComponentType from '../ComponentType.js';

/**
 * Wire class
 * A zero voltage source
 */
export default class Wire extends VoltageSource {

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

