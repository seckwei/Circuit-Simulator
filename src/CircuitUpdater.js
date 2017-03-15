// @flow

const ComponentType = require('./ComponentType.js');

/**
 * Singleton class.
 * Responsible for updating the circuit components with the given solution from the Solver
 */
class CircuitUpdater {
    
    constructor() {}

    /**
     * Create and returns an object which has all the new values to update the components
     * @param {Pin[][]} nodes 
     * @param {number[]} solution
     * 
     * @returns {Ojbect} updateObject
     */
    getUpdateObject(nodes: Pin[][], solution: number[]): Object {
        let vSources = {},
            updateObject = {};

        nodes.forEach((node, index) => {
            node.forEach(pin => {
                
                if(pin.parent.vSourceNum !== undefined) {
                    vSources[pin.parent.id] = pin.parent;
                }

                if(pin.parent.type !== ComponentType.TYPE_GROUND) {
                    if(updateObject[pin.parent.id] == undefined) {
                        updateObject[pin.parent.id] = { component: pin.parent, value: { pins: [] } };
                    }
                    updateObject[pin.parent.id].value.pins[pin.index] = solution[index];
                }
            });
        });

        for(let id in vSources) {
            updateObject[id].value.I = solution[nodes.length - 1 + vSources[id].vSourceNum];
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

module.exports = new CircuitUpdater();