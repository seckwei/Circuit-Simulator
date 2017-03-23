import { 
        VoltageSource,
        CurrentSource,
        Resistor,
        Wire,
        Ground 
    } from '../src/AllComponents.js';

import ComponentType from '../src/ComponentType.js';
import WORKING_CIRCUIT from './test_data.spec.js';
import Traverser from '../src/Traverser.js';

describe('Traverser Module', () => {

    describe('resetVisited(Board.pins)', () => {
        it('should reset all \'visited\' flag of the pins to false', () => {
            // Copy the object before we mutate it for testing
            const pins = Object.assign({}, WORKING_CIRCUIT.pins);

            // Set some pins visited to true
            for(let key in pins){
                pins[key][0].visited = true;
            }

            // Then, we reset them
            Traverser.resetVisited(pins);

            // Finally, test
            let flag = true;
            for(let key in pins){
                if(pins[key].some(pin => pin.visited)){
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
            expect(nodes[nodeIndex]).toEqual([R1.pins[0], R2.pins[0]]);

            nodeIndex = 3;
            Traverser.assignNode(R1.pins[1], nodes, nodeIndex);
            Traverser.assignNode(R2.pins[1], nodes, nodeIndex);
            expect(nodes[nodeIndex]).toEqual([R1.pins[1], R2.pins[1]]);
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

    describe('enqueuePin(pin, queue)', () => {
        it('should update array with the component\'s other pin, provided if it has not been visited', () => {
            let queue = [],
                R1 = new Resistor(),
                R2 = new Resistor();

            Traverser.enqueue(R1.pins[0], queue);
            expect(queue).toEqual([R1.pins[1]]);

            R2.pins[1].visited = true;
            Traverser.enqueue(R2.pins[1], queue);

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

    describe('getPrearrangedNodes(Board.pins)', () => {
        it('should return a 2D array, cells may contain Pins', () => {
            /**
             * We are going to compare equality of 2D array of objects, so what I have done here
             * is to convert each Pin object into a string of ComponentID + PinIndex. Then, I sort
             * the inner arrays first and finally the outer array itself. I assume The outer array
             * auto sorts by comparing the inner array's first element.
             */
            let sortedActual = Traverser.getPrearrangedNodes(Object.assign({}, WORKING_CIRCUIT.pins));
            
            sortedActual = sortedActual.map(node => node.map(pin => pin.parent.id + pin.index).sort()).sort();

            let sortedExpected = WORKING_CIRCUIT.nodes_prearranged.slice();
            sortedExpected = sortedExpected.map(node => node.map(pin => pin.parent.id + pin.index).sort()).sort();

            expect(sortedActual).toEqual(sortedExpected);
        });
    });

    describe('finaliseNodes(nodes) + getNodes(Board.pins)', () => {
        it('should return arranged array nodes - rows with GND moved to row-0, and emptied rows are removed', () => {
            let prearrangedNodes = Traverser.getPrearrangedNodes(Object.assign({}, WORKING_CIRCUIT.pins)),
                arrangedNodes = Traverser.finaliseNodes(prearrangedNodes);

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

            expect(sortedActual).toEqual(sortedExpected);
        });
    });

    describe('assignComponentNodes(Board.pins)', () => {
        // We need this method so that we can let each component stamp their value into matrix Y and J.

        it('should fill in the components \'nodes\' field with the corresponding node indices', () => {
            let pins = Object.assign({}, WORKING_CIRCUIT.pins)
            Traverser.assignComponentNodes(pins);

            let actual = Object.values(pins),
                expected = Object.values(WORKING_CIRCUIT.pins);

            actual = [].concat(...actual);
            actual = actual.map(pin => `${pin.parent.id}_${pin.parent.nodes.toString()}`).sort();
            expected = [].concat(...expected);
            expected = expected.map(pin => `${pin.parent.id}_${pin.parent.nodes.toString()}`).sort();

            expect(actual).toEqual(expected);
        });
    });

});