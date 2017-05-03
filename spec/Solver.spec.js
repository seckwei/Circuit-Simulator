import Matrix from '../src/Matrix.js';
import Traverser from '../src/Traverser.js';
import SimConfig from '../src/SimulationConfig.js';
import Solver from '../src/Solver.js';
import WORKING_CIRCUIT from './test_data.spec.js';

describe('Solver', () => {
    
    const solver = new Solver(SimConfig);

    describe('getNumVSource(Board.components)', () => {
        it('should return the number of voltage sources (which includes wires)', () => {
            expect(solver.getNumVSource(WORKING_CIRCUIT.components)).toBe(2);
        });
    });

    describe('solve(Board.components)', () => {
        it('should return an array which has the voltages of nodes, and current of voltage sources', () => {
            let solution = solver.solve(Object.assign({}, WORKING_CIRCUIT.components), WORKING_CIRCUIT.nodes_arranged.slice()),
                actual = solution.slice().sort(),
                expected = WORKING_CIRCUIT.solution.slice().sort();

            actual.forEach((value, index) => {
                expect(value).toBeCloseTo(expected[index]);
            });
        });
    });
});