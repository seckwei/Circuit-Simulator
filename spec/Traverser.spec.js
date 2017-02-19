const TEST_DATA = require('./test_data.spec.js'),
    Traverser = require('../src/Traverser.js');

describe('Traverser Module', () => {

    describe('clearVisited(Board.Component)', () => {
        it('should reset all \'visited\' flag of the pins to false', () => {
            fail();
        });
    });

    describe('assignNode(component, pinIndex, nodes, nodeIndex)', () => {
        it('should return updated array with newly assigned component and pin index in the given node index', () => {
            fail();
        });
    });

    describe('flagVisited(component, pinIndex)', () => {
        it('should change the \'visited\' field of that pin to true', () => {
            fail();
        });
    });

    describe('recordGndInd(component, GndIndex, nodeIndex)', () => {
        it('should return updated array with newly added node index if the component is GND', () => {
            fail();
        });

        it('should return same array if component is not GND', () => {
            fail();
        });
    });

    describe('enqueuePin(component, pinIndex)', () => {
        it('should return update array with the component\'s other pin', () => {
            fail();
        });

        it('should return same array if all other component pins have been visited', () => {
            fail();
        });
    });

    describe('getNodes(Board.Component)', () => {
        it('should return a 2D array, cells may contain { Component, pinIndex }', () => {
            fail();
        });
    });

    describe('rearrange(nodes)', () => {
        it('should return arranged array nodes - rows with GND moved to row-0, and emptied rows are removed', () => {
            fail();
        });
    });

    describe('updateComponentNodes(nodes)', () => {
        it('should fill in the components \'nodes\' field with the corresponding node indices', () => {
            fail();
        });
    });

});