/// @flow

const Matrix = require('./Matrix.js'),
    ComponentType = require('./ComponentType.js'),
    Numeric = require('numericjs');

/**
 * Singleton class.
 */
class Solver {
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

    stampMatrices(components: BoardComponents, Y: Matrix, J: Matrix): void {
        let componentDict: {string: Component} = {};
        for(let pos in components) {
            components[pos].forEach(pin => {
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
                componentDict[id].stamp(Y, J);
            }
        }
    }

    solve(components: BoardComponents, nodes: Pin[][]): number[] {
        let numNode = nodes.length,
            numVSource = this.getNumVSource(nodes);

        let Y = new Matrix(numNode + numVSource),
            J = new Matrix(numNode + numVSource, 1);

        this.stampMatrices(components, Y, J);

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

module.exports = new Solver();