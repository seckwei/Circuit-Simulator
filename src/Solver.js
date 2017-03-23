// @flow

import Matrix from './Matrix.js';
import ComponentType from './ComponentType.js';
import Numeric from 'numericjs';

/**
 * Solves the circuit
 */
export default class Solver {

    simConfig: Object;

    constructor(simConfig: Object) {
        /**
         * Key-value object that holds the config for this simulation
         * @type {Object}
         */
        this.simConfig = simConfig;
    }

    /**
     * Gets the number of voltage sources
     * @param {Pin[][]} nodes 
     * 
     * @returns {number}
     */
    getNumVSource(nodes: Pin[][]): number {
        let vSourceCount = {};
        nodes.forEach(node => {
            node.forEach(pin => {
                if(pin.parent.vSourceNum !== undefined) {
                    vSourceCount[pin.parent.id] = 0;
                }
            })
        });
        return Object.keys(vSourceCount).length;
    }

    /**
     * Stamps Y and J matrices with the values of the components
     * @param {BoardPins} pins 
     * @param {Matrix} Y 
     * @param {Matrix} J 
     */
    stampMatrices(pins: BoardPins, Y: Matrix, J: Matrix): void {
        let componentDict: {}|{string: Component} = {};
        for(let pos in pins) {
            pins[pos].forEach(pin => {
                componentDict[pin.parent.id] = pin.parent;
            });
        }

        let vSourceNum = 1;
        for(let id in componentDict) {
            let component = componentDict[id];
            if(component.vSourceNum !== undefined) {
                component.vSourceNum = vSourceNum++;
            }

            if(componentDict[id].type !== ComponentType.TYPE_GROUND) {
                componentDict[id].stamp(Y, J, this.simConfig);
            }
        }
    }

    /**
     * In MNA, we have three matrices Yx = J.
     * This method solves the circuit by calculating the values for
     * matrix x and returns it.
     * @param {BoardPins} pins 
     * @param {Pin[][]} nodes
     * 
     * @returns {number[]} solution
     */
    solve(pins: BoardPins, nodes: Pin[][]): number[] {
        let numNode = nodes.length,
            numVSource = this.getNumVSource(nodes);

        let Y = new Matrix(numNode + numVSource),
            J = new Matrix(numNode + numVSource, 1);

        this.stampMatrices(pins, Y, J);

        // Remove the 0-th row and column because we don't need Ground nodes
        Y.data.splice(0,1);
        for(let row in Y.data) {
            Y.data[row] = Y.data[row].splice(1, Y.data[row].length);
        }
        // Same as above for matrix J
        J.data.splice(0,1);

        // Start with 0, which is the voltage of the 0th/ground node
        return [0].concat(...Numeric.solve(Y.data, J.data));
    }
}

