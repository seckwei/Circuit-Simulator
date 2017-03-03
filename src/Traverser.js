/// @flow

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
    resetVisited(components: BoardComponents): void {}

    /**
     * Assigns the pin to a node by placing it on the nodeIndex of the nodes array
     * i.e. nodes array get mutated.
     * @private
     * @param {Pin} pin 
     * @param {Pin[][]} nodes 
     * @param {number} nodeIndex 
     */
    assignNode(pin: Pin, nodes: Pin[][], nodeIndex: number): void {}

    /**
     * Changes the visited flag of a pin to TRUE.
     * @private
     * @param {Pin} pin 
     */
    flagVisited(pin: Pin): void {}

    /**
     * Records the nodes array index of the Ground component(s) before the rearrangment.
     * This is so that we can easily 'move' nodes that have Ground to the nodes index 0,
     * because in MNA, the nodes that have Ground is Node 0.
     * @private
     * @param {Pin} pin 
     * @param {number[]} groundNodeIndices 
     * @param {number} nodeIndex 
     */
    recordGndInd(pin: Pin, groundNodeIndices: number[], nodeIndex: number): void {}

    /**
     * We are using BFS Graph traversal.
     * This places unvisited pin(s) of a component into a queue to come back later.
     * @private
     * @param {Pin} pin 
     * @param {Pin[]} queue 
     */
    enqueue(pin: Pin, queue: Pin[]): void {}

    /**
     * Returns 'nodes', a 2D array of Pins.
     * The first index denotes the n-th Node that we will be using for MNA.
     * The second index denotes the Pin in that node. Why store Pin rather 
     * than Component? Because Pin has parent and index field: parent is the
     * Component that 'owns' it, and 'index' is the n-th Pin of the parent.
     * 
     * nodes[0] array is expected to be empty, because we will later move all
     * nodes with Ground to nodes[0] and clear up empty nodes.
     * @private
     * @param {BoardComponents} components 
     * 
     * @returns {Pin[][]} nodes
     */
    getNodes(components: BoardComponents): Pin[][] {}

    /**
     * Supposed to run with the nodes from getNodes()
     * This method moves all nodes that have Ground component to nodes[0]
     * and removes the empty nodes.
     * @private
     * @param {Pin[][]} nodes 
     */
    rearrangeNodes(nodes: Pin[][]): void {}

    /**
     * This method assigns the FINAL node number into the Components' nodes field.
     * This method will encompass all the methods above to give the final result.
     * @public
     * @param {BoardComponents} components 
     * @param {Pin[][]} nodes 
     */
    assignComponentNodes(components: BoardComponents, nodes: Pin[][]): void {}
    
}

module.exports = new Traverser();