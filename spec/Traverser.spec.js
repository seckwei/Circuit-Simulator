const VoltageSource = require('../src/VoltageSource.js'),
    CurrentSource = require('../src/CurrentSource.js'),
    Resistor = require('../src/Resistor.js'),
    Wire = require('../src/Wire.js'),
    Ground = require('../src/Ground.js'),
    ComponentType = require('../src/ComponentType.js');

const { WORKING_CIRCUIT } = require('./test_data.spec.js'),
    Traverser = require('../src/Traverser.js');

describe('Traverser Module', () => {

    describe('resetVisited(Board.components)', () => {
        it('should reset all \'visited\' flag of the pins to false', () => {
            // Copy the object before we mutate it for testing
            const components = Object.assign({}, WORKING_CIRCUIT.components);

            // Set some pins visited to true
            for(let key in components){
                components[key][0].visited = true;
            }

            // Then, we reset them
            Traverser.resetVisited(components);

            // Finally, test
            let flag = true;
            for(let key in components){
                if(!components[key].every(pin => pin.visited)){
                    flag = false;
                    break;
                }
            }
            expect(flag).toBe(true);
        });
    });

    describe('assignNode(pin, nodes, nodeIndex)', () => {
        it('should update array with newly assigned pin in the given node index', () => {
            let nodes = [],
                nodeIndex = 1,
                R1 = new Resistor(),
                R2 = new Resistor();

            Traverser.assignNode(R1.pins[0], nodes, nodeIndex);
            Traverser.assignNode(R2.pins[0], nodes, nodeIndex);
            expect(nodes[nodeIndex]).toEqual([R1.pins[0], R1.pins[0]]);

            nodeIndex = 3;
            Traverser.assignNode(R1.pins[1], nodes, nodeIndex);
            Traverser.assignNode(R2.pins[1], nodes, nodeIndex);
            expect(nodes[nodeIndex]).toEqual([R1.pins[1], R1.pins[1]]);
        });
    });

    describe('flagVisited(pin)', () => {
        it('should change the \'visited\' field of that pin to true', () => {
            let R1 = new Resistor();

            Traverser.flagVisited(R1.pins[0]);
            expect(R1.pins[0].visited).toBe(true);

            Traverser.flagVisited(R1.pins[1]);
            expect(R1.pins[1].visited).toBe(true);
        });
    });

    describe('recordGndInd(pin, groundNodeIndices, nodeIndex)', () => {

        let nodes,
            nodeIndex,
            groundNodeIndices,
            GND;

        beforeEach(() => {
            nodes = [],
            nodeIndex = 1,
            groundNodeIndices = [],
            GND = new Ground();
        });

        it('should update groundNodeIndices array with the corresponding node index if the component is GND', () => {
            Traverser.recordGndInd(GND.pins[0], groundNodeIndices, nodeIndex);
            expect(groundNodeIndices).toEquals([nodeIndex]);
        });

        it('should not update groundNodeIndices array with the same node index', () => {
            Traverser.recordGndInd(GND.pins[0], groundNodeIndices, nodeIndex);
            Traverser.recordGndInd(GND.pins[0], groundNodeIndices, nodeIndex);
            expect(groundNodeIndices).toEquals([nodeIndex]);
        });

        it('should not update the groundNodeIndices array if component is not GND', () => {
            let R1 = new Resistor();

            Traverser.recordGndInd(R1.pins[0], groundNodeIndices, nodeIndex);
            expect(groundNodeIndices).toEquals([]);
        });
    });

    describe('enqueuePin(pin, queue)', () => {
        it('should update array with the component\'s other pin, provided if it has not been visited', () => {
            let queue = [],
                R1 = new Resistor(),
                R2 = new Resistor();

            Traverser.enqueue(R1.pins[0], queue);
            expect(queue).toEqual([R1.pins[1]]);

            R2.pins[1].visited = true;
            Traverser.enqueue(R2.pins[0], queue);

            // R2's pin should not be enqueued, because it was visited already
            expect(queue).toEqual([R1.pins[1]]); 
        });

        it('should update array with the component\'s other pin, provided if it is not a GND', () => {
            let queue = [],
                R1 = new Resistor(),
                GND = new Ground();

            Traverser.enqueue(R1.pins[0], queue);
            Traverser.enqueue(GND.pins[0], queue);
            Traverser.enqueue(GND.pins[1], queue);

            expect(queue).toEqual([R1.pins[1]]);
        });
    });

    describe('getNodes(Board.components)', () => {
        it('should return a 2D array, cells may contain { Component, pinIndex }', () => {
            /**
             * We are going to compare equality of 2D array of objects, so what I have done here
             * is to convert each Pin object into a string of ComponentID + PinIndex. Then, I sort
             * the inner arrays first and finally the outer array itself. I assume The outer array
             * auto sorts by comparing the inner array's first element.
             */
            let sortedActual = Traverser.getNodes(Object.assign({}, WORKING_CIRCUIT.components));
            sortedActual = sortedActual.map(node => node.map(pin => pin.parent.id + pin.index).sort()).sort();

            let sortedExpected = WORKING_CIRCUIT.nodes_prearranged.slice();
            sortedExpected = sortedExpected.map(node => node.map(pin => pin.parent.id + pin.index).sort()).sort();

            expect(sortedActual).toEquals(sortedExpected);
        });
    });

    describe('rearrange(nodes)', () => {
        it('should return arranged array nodes - rows with GND moved to row-0, and emptied rows are removed', () => {
            let prearrangedNodes = Traverser.getNodes(WORKING_CIRCUIT.nodes_prearranged.slice()),
                arrangedNodes = Traverser.rearrange(prearrangedNodes);

            // Quick check - length should be same
            expect(arrangedNodes.length).toBe(WORKING_CIRCUIT.nodes_arranged.length);

            // Only Node 0 should have all the Ground components pins
            let groundOnlyInIndex0 = true;
            for(let i = 1; i < arrangedNodes.length; ++i){
                if(!arrangedNodes[i].every(pin => pin.parent.type !== ComponentType.TYPE_GROUND)) {
                    groundOnlyInIndex0 = false;
                    break;
                }
            }
            expect(groundOnlyInIndex0).toBe(true);

            // Finally we check if they have the same content
            let sortedActual = arrangedNodes.map(node => node.map(pin => pin.parent.id + pin.index).sort()).sort();
            let sortedExpected = WORKING_CIRCUIT.nodes_arranged.slice();
            sortedExpected = sortedExpected.map(node => node.map(pin => pin.parent.id + pin.index).sort()).sort();

            expect(sortedActual).toEquals(sortedExpected);
        });
    });

    describe('assignComponentNodes(components, nodes)', () => {
        // We need this method so that we can let each component stamp their value into matrix Y and J.

        it('should fill in the components \'nodes\' field with the corresponding node indices', () => {
            let components = Object.assign({}, WORKING_CIRCUIT.components),
                nodes = Traverser.getNodes(components);
                nodes = Traverser.rearrange(nodes);

            Traverser.assignComponentNodes(components, nodes);

            let actual = Object.values(components),
                expcted = Object.values(WORKING_CIRCUIT.components);

            actual = [].concat(...actual);
            actual = actual.map(c => `${c.id}_${c.nodes.toString()}`).sort();
            expcted = [].concat(...expcted);
            expcted = expcted.map(c => `${c.id}_${c.nodes.toString()}`).sort();

            expect(actual).toEqual(expected);
        });
    });

});