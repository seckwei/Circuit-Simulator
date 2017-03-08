const Matrix = require('../src/Matrix.js'),
    Traverser = require('../src/Traverser.js'),
    Solver = require('../src/Solver.js'),
    { WORKING_CIRCUIT } = require('./test_data.spec.js');

describe('Solver', () => {
    describe('getNumVSource(nodes)', () => {
        it('should return the number of voltage sources (which includes wires)', () => {
            let nodes = Traverser.assignComponentNodes(Object.assign({}, WORKING_CIRCUIT.components));
            expect(Solver.getNumVSource(nodes)).toBe(2);
        });
    });

    describe('solve(Board.components)', () => {
        it('should return an array which has the voltages of nodes, and current of voltage sources', () => {
            let solution = Solver.solve(Object.assign({}, WORKING_CIRCUIT.components), WORKING_CIRCUIT.nodes_arranged.slice()),
                actual = solution.slice().sort(),
                expected = WORKING_CIRCUIT.solution.slice().sort();

            actual.forEach((value, index) => {
                expect(value).toBeCloseTo(expected[index]);
            });
        });
    });
});