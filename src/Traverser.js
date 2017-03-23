// @flow

import ComponentType from './ComponentType.js';

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
     * @param {BoardPins} pins 
     */
    resetVisited(pins: BoardPins): void {
        for(let position in pins) {
            for(let pin in pins[position]) {
                pins[position][pin].visited = false;
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
     * The second index denotes the Pin in that node. We store Pin rather 
     * than Component, because Pin has 'parent' and 'index' field: parent is the
     * Component that 'owns' it, and 'index' is the n-th Pin of the parent.
     * 
     * nodes[0] array is expected to be empty, because we will later move all
     * nodes with Ground to nodes[0] and clear up empty nodes.
     * @private
     * @param {BoardPins} pins
     * 
     * @returns {Pin[][]} prearrangedNodes
     */
    getPrearrangedNodes(pins: BoardPins): Pin[][] {
        let prearrangedNodes = [[]],
            nodeIndex = 1,
            queue = [];

        this.resetVisited(pins);

        // Start from any source component's pin
        let currentPins: Pin[],
            startPin: Pin,
            strPos: string;

        // Search for that souce component's pin and its position on the board
        for(let position in pins) {
            currentPins = pins[position];
            for(let pinInd in currentPins) {
                if(currentPins[pinInd].parent.type === ComponentType.TYPE_SOURCE) {
                    strPos = position;
                    startPin = currentPins[pinInd];
                    break;
                }
            }
            if(startPin) break;
        }
        
        // Recurse through the connected components to construct the prearrangedNodes array
        let self = this;
        (function BFS(position: string){

            // Get array of pins that are in this position
            pins[position].forEach((pin) => {
                if(!pin.visited) {
                    self.AEF(pin, prearrangedNodes, queue, nodeIndex);
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
     * AEF stands for Assign-Enqueue-Flag, used in the recursive BFS in
     * getPrearrangedNodes() method.
     * @private
     * @param {Pin} pin 
     * @param {Pin[][]} nodes 
     * @param {Pin[]} queue
     * @param {number} nodeIndex 
     */
    AEF(pin: Pin, nodes: Pin[][], queue: Pin[], nodeIndex: number): void
    {
        this.assignNode(pin, nodes, nodeIndex);
        this.enqueue(pin, queue);
        this.flagVisited(pin);
    }

    /**
     * Supposed to run with the nodes from getPrearrangedNodes()
     * This method moves all nodes that have Ground component to nodes[0]
     * and removes the empty nodes.
     * @private
     * @param {Pin[][]} nodes
     * 
     * @return {Pin[][]} nodes
     */
    finaliseNodes(nodes: Pin[][]): Pin[][] {
        let finalNodes = nodes.slice();

        // Find all nodes with Ground component and move that node to node 0
        finalNodes.forEach((node, index) => {
            let hasGround = node.some(pin => {
                return pin.parent.type === ComponentType.TYPE_GROUND;
            });
            if(hasGround) {
                finalNodes[0] = [].concat(...finalNodes[index].splice(0, finalNodes[index].length));
            }
        });

        // Then we clear out the empty nodes
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
     * Returns the final nodes array, ready to be assigned to the components.
     * @public
     * @param {BoardPins} pins 
     * 
     * @return {Pin[][]} nodes
     */
    getNodes(pins: BoardPins): Pin[][] {
        let prearrangedNodes = this.getPrearrangedNodes(pins);

        return this.finaliseNodes(prearrangedNodes);
    }

    /**
     * This method assigns the FINAL node number into the Components' nodes field.
     * @public
     * @param {BoardPins} pins
     * 
     * @returns {Pin[][]} nodes
     */
    assignComponentNodes(pins: BoardPins): Pin[][] {
        let nodes = this.getNodes(pins);
        nodes.forEach((node, nodeNum) => {
            node.forEach(pin => {
                pin.parent.nodes[pin.index] = nodeNum;
            });
        });
        return nodes.slice();
    }
}

const Singleton = new Traverser();

export { Singleton as default };