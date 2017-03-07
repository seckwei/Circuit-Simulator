/// @flow

const ComponentType = require('./ComponentType.js');

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

    solve(components: BoardComponents): number[] {

    }
}

module.exports = new Solver();