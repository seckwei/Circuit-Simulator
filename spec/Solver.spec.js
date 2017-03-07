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

    describe('stampMatrices(Board.components, matrixY, matrixJ)', () => {
        it('should stamp correctly on matrix Y and J', () => {
            let nodes = Traverser.assignComponentNodes(Object.assign({}, WORKING_CIRCUIT.components)),
                numNode = nodes.length,
                numVSource = Solver.getNumVSource(nodes);

            let Y = new Matrix(numNode + numVSource),
                J = new Matrix(numNode + numVSource, 1);

            Solver.stampMatrices(Object.assign({}, WORKING_CIRCUIT.components), Y, J);

            expect(Y).toEqual([
                [1/8,  0,  0,  0,  0, 1/-8,  0,  1],
                [  0,  0,  0,  0,  0,  0,  1,  0],
                [  0,  0, 1/4+1/2, 1/-4,  0, 1/-2, -1,  0],
                [  0,  0, 1/-4, 1/6+1/4, 1/-6,  0,  0,  0],
                [  0,  0,  0, 1/-6,  1/6,  0,  0,  0],
                [1/-8,  0, 1/-2,  0,  0, 1/8+1/2,  0, -1],
                [  0,  1, -1,  0,  0,  0,  0,  0],
                [  1,  0,  0,  0,  0, -1,  0,  0]
            ]);

            expect(J).toEqual([
                [-5],
                [5],
                [0],
                [0],
                [0],
                [0],
                [0],
                [0]
            ]);
        });
    });

    describe('solve(Board.components)', () => {
        it('should return an array which has the voltages of nodes, and current of voltage sources', () => {
            let solution = Solver.solve(Object.assign({}, WORKING_CIRCUIT.components));
            expect(solution.sort()).toEqual(WORKING_CIRCUIT.solution.slice().sort());
        });
    });
});