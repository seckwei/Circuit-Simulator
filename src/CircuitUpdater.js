// @flow

import ComponentType from './ComponentType.js';

/**
 * Singleton class.
 * Responsible for updating the circuit components with the given solution from the Solver
 */
class CircuitUpdater {
    
    constructor() {}

    /**
     * Creates and returns an object which has all the new values to update the components
     * @param {Pin[][]} nodes 
     * @param {number[]} solution
     * 
     * @returns {Ojbect} updateObject
     * @example 
     * // The return object's structure
     *  {
     *      <component id>: {
     *          component: <component obj>,
     *          values: {
     *              pins: <number[]>,   // node voltage for each pin
     *              I: <number>         // current, only for voltage source
     *          }
     *      }
     *  }
     */
    getUpdateObject(nodes: Pin[][], solution: number[]): Object {
        let vSources = {},
            updateObject = {};

        nodes.forEach((node, index) => {
            node.forEach(pin => {

                // Get a list of voltage source components, will be used later                
                if(pin.parent.vSourceNum !== undefined) {
                    vSources[pin.parent.id] = pin.parent;
                }

                if(pin.parent.type !== ComponentType.TYPE_GROUND) {

                    // Initialise the update obj for this component if hasn't already been made
                    if(updateObject[pin.parent.id] == undefined) {
                        updateObject[pin.parent.id] = {
                            component: pin.parent,
                            value: { pins: [] } 
                        };
                    }
                    // Finally, place the solution into the update object
                    updateObject[pin.parent.id].value.pins[pin.index] = solution[index];
                }
            });
        });

        // Update for Voltage Sources' current
        let numVSources = Object.keys(vSources).length;
        for(let id in vSources) {
            updateObject[id].value.I = solution[nodes.length + numVSources - vSources[id].vSourceNum];
        }

        return updateObject;
    }

    /**
     * Calls each component's update() method
     * @param {Object} updateObject 
     */
    update(updateObject: Object): void {
        for(let id in updateObject) {
            updateObject[id].component.update(updateObject[id].value);
        }
    }
}

const Singleton = new CircuitUpdater;

export { Singleton as default };