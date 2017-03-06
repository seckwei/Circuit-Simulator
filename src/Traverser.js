/// @flow

const ComponentType = require('./ComponentType.js');

/**
 * Singleton class.
 * Traverses components on the circuit board using BFS to assign Node numbers to each
 * component so that MNA (Modified Nodal Analysis) can later be applied onto the circuit.
 */
class Traverser {
    
    /**
     * Empty constructor
     */
    constructor() {}

    /**
     * Resets the visited flag of all components' pins to FALSE.
     * @private
     * @param {BoardComponents} components 
     */
    resetVisited(components: BoardComponents): void {
        for(let position in components) {
            for(let pin in components[position]) {
                components[position][pin].visited = false;
            }
        }
    }

    /**
     * Assigns the pin to a node by placing it on the nodeIndex of the nodes array
     * i.e. nodes array get mutated.
     * @private
     * @param {Pin} pin 
     * @param {Pin[][]} nodes 
     * @param {number} nodeIndex 
     */
    assignNode(pin: Pin, nodes: Pin[][], nodeIndex: number): void {
        nodes[nodeIndex] = (nodes[nodeIndex] || []).concat(pin);
    }

    /**
     * Changes the visited flag of a pin to TRUE.
     * @private
     * @param {Pin} pin 
     */
    flagVisited(pin: Pin): void {
        pin.visited = true;
    }

    /**
     * Records the nodes array index of the Ground component(s) before the rearrangment.
     * This is so that we can easily 'move' nodes that have Ground to the nodes index 0,
     * because in MNA, the nodes that have Ground is Node 0.
     * @private
     * @param {Pin} pin 
     * @param {number[]} groundNodeIndices 
     * @param {number} nodeIndex 
     */
    recordGndInd(pin: Pin, groundNodeIndices: number[], nodeIndex: number): void {
        if(pin.parent.type === ComponentType.TYPE_GROUND && 
            groundNodeIndices.indexOf(nodeIndex) === -1)
        {
            groundNodeIndices.push(nodeIndex);
        }
    }

    /**
     * We are using BFS Graph traversal.
     * This places unvisited pin(s) of a component into a queue to come back later.
     * @private
     * @param {Pin} pin 
     * @param {Pin[]} queue 
     */
    enqueue(pin: Pin, queue: Pin[]): void {
        if(!pin.visited && pin.parent.type !== ComponentType.TYPE_GROUND) {
            queue.push(...pin.parent.otherPins(pin.index));
        }
    }

    /**
     * Returns 'prearrangedNodes', a 2D array of Pins.
     * The first index denotes the n-th Node that we will be using for MNA.
     * The second index denotes the Pin in that node. Why store Pin rather 
     * than Component? Because Pin has parent and index field: parent is the
     * Component that 'owns' it, and 'index' is the n-th Pin of the parent.
     * 
     * nodes[0] array is expected to be empty, because we will later move all
     * nodes with Ground to nodes[0] and clear up empty nodes.
     * @private
     * @param {BoardComponents} components
     * @param {number[]} groundNodeIndices
     * 
     * @returns {Pin[][]} prearrangedNodes
     */
    getPrearrangedNodes(components: BoardComponents, groundNodeIndices: number[]): Pin[][] {
        let prearrangedNodes = [[]],
            nodeIndex = 1,
            queue = [];

        this.resetVisited(components);

        // Start from any source component's pin
        let pins: Pin[],
            startPin: Pin,
            strPos: string;

        // Search for that souce component's pin and its position on the board
        for(let position in components) {
            pins = components[position];
            for(let pinInd in pins) {
                if(pins[pinInd].parent.type === ComponentType.TYPE_SOURCE) {
                    strPos = position;
                    startPin = pins[pinInd];
                    break;
                }
            }
            if(startPin) break;
        }
        
        // Recurse through the connected components to construct the prearrangedNodes array
        let self = this;
        (function BFS(position: string){

            // Get array of pins that are in this position
            components[position].forEach((pin) => {
                if(!pin.visited) {
                    self.AERM(pin, prearrangedNodes, queue, groundNodeIndices, nodeIndex);
                }
            });
            ++nodeIndex;

            // Look for the next position to recurse on
            let nextPin: Pin;
            do {
                nextPin = queue.shift();
            } while(!!nextPin && nextPin.visited);

            if(nextPin) {
                BFS(nextPin.position.toString());
            }
            // End of BFS
        }(strPos));

        return prearrangedNodes;
    }

    /**
     * Supposed to run with the nodes from getPrearrangedNodes()
     * This method moves all nodes that have Ground component to nodes[0]
     * and removes the empty nodes.
     * @private
     * @param {Pin[][]} nodes
     * @param {number[]} groundNodeIndices
     * 
     * @return {Pin[][]} nodes
     */
    finaliseNodes(nodes: Pin[][], groundNodeIndices: number[]): Pin[][] {
        let finalNodes = nodes.slice();
        groundNodeIndices.forEach(index => {
            // We use splice to clear up that array as well 
            finalNodes[0] = [].concat(...finalNodes[index].splice(0, finalNodes.length));
        });

        let len = finalNodes.length;
        for(let i = 1; i < len;) {
            if(finalNodes[i].length === 0) {
                finalNodes.splice(i,1);
                --len;
            }
            else {
                ++i;
            }
        }

        return finalNodes;
    }

    /**
     * Returns the final nodes array, ready for stamping
     * @public
     * @param {BoardComponents} components 
     * 
     * @return {Pin[][]} nodes
     */
    getNodes(components: BoardComponents): Pin[][] {
        let groundNodeIndices = [], 
            prearrangedNodes = this.getPrearrangedNodes(components, groundNodeIndices);

        return this.finaliseNodes(prearrangedNodes, groundNodeIndices);
    }

    /**
     * This method assigns the FINAL node number into the Components' nodes field.
     * This method will encompass all the methods above to give the final result.
     * @public
     * @param {Pin[][]} nodes 
     */
    assignComponentNodes(nodes: Pin[][]): void {
        nodes.forEach((node, nodeNum) => {
            node.forEach(pin => {
                pin.parent.nodes[pin.index] = nodeNum;
            });
        });
    }
    
    /**
     * AERM stands for Assign-Enqueue-Record-Mark
     * @private
     * @param {Pin} pin 
     * @param {Pin[][]} nodes 
     * @param {Pin[]} queue 
     * @param {number[]} groundNodeIndices 
     * @param {number} nodeIndex 
     */
    AERM(pin: Pin, nodes: Pin[][], queue: Pin[],
        groundNodeIndices: Pin[], nodeIndex: number): void
    {
        this.assignNode(pin, nodes, nodeIndex);
        this.enqueue(pin, queue);
        this.recordGndInd(pin, groundNodeIndices, nodeIndex);
        this.flagVisited(pin);
    }
}

module.exports = new Traverser();