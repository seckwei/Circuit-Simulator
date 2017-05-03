// @flow

import Matrix from './Matrix.js';
import ComponentType from './ComponentType.js';
import Numeric from 'numericjs';

/**
 * Solver class of the simulator.
 * Creates the matrices and initiates the stamping, and solve using NumericJS' LUsolve method.
 */
export default class Solver {

    simConfig: Object;
    LU_Y: Object;

    constructor(simConfig: Object) {
        /**
         * Key-value object that holds the config for this simulation
         * @type {Object}
         */
        this.simConfig = simConfig;

        /**
         * Stores the LU decomposed Y matrix result object from Numeric.LU()
         * @type {Object}
         */
        this.LU_Y = undefined;
    }

    /**
     * Gets the number of voltage sources
     * @param {BoardComponents} components 
     * 
     * @returns {number}
     */
    getNumVSource(components: BoardComponents): number {
        let vSourceCount = 0;
        for(let id in components) {
            if('vSourceNum' in components[id]) {
                ++vSourceCount;
            }
        }
        return vSourceCount;
    }

    /**
     * Stamps Y and J matrices with the values of the components
     * @param {BoardComponents} components 
     * @param {Matrix} Y 
     * @param {Matrix} J 
     */
    stampMatrices(components: BoardComponents, Y: Matrix, J: Matrix): void {

        let vSourceNum = 1;
        for(let id in components) {
            let component = components[id];
            if(component.vSourceNum !== undefined) {
                component.vSourceNum = vSourceNum++;
            }

            if(components[id].type !== ComponentType.TYPE_GROUND) {
                components[id].stamp(Y, J, this.simConfig);
            }
        }
    }

    /**
     * In MNA, we have three matrices Yx = J.
     * This method solves the circuit by calculating the values for
     * matrix x and returns it.
     * @param {BoardComponents} components 
     * @param {Pin[][]} nodes
     * 
     * @returns {number[]} solution
     */
    solve(components: BoardComponents, nodes: Pin[][]): number[] {
        let numNode = nodes.length,
            numVSource = this.getNumVSource(components);

        let Y = new Matrix(numNode + numVSource),
            J = new Matrix(numNode + numVSource, 1);

        this.stampMatrices(components, Y, J);

        if(this.LU_Y == undefined) {

            // Remove the 0-th row and column because we don't need Ground nodes
            Y.data.splice(0,1);
            for(let row in Y.data) {
                Y.data[row] = Y.data[row].splice(1, Y.data[row].length);
            }
            this.LU_Y = Numeric.LU(Y.data);
        }
        // Same as above for matrix J
        J.data.splice(0,1);

        // Start with 0, which is the voltage of the 0th/ground node
        return [0].concat(...Numeric.LUsolve(this.LU_Y, J.data));
    }
}

