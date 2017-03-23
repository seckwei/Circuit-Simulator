import Updater from '../src/CircuitUpdater.js';
import Solver from '../src/Solver.js';
import WORKING_CIRCUIT from './test_data.spec.js';

describe('Ciruit Updater', () => {

    let nodes = WORKING_CIRCUIT.nodes_arranged,
        solution = WORKING_CIRCUIT.solution,
        updateObject = Updater.getUpdateObject(nodes, solution);

    describe('getUpdateObject(nodes, solution)', () => {
        it('should return an object with the values to update for each component', () => {
            expect(updateObject).toEqual(WORKING_CIRCUIT.updateObject);
        });
    });

    describe('update(updateObj)', () => {
        it('should call update(vals) on each component to update its \'dependant\' field and pins', () => {
            Updater.update(updateObject);

            expect(updateObject.I0.component.dependant.V).toBeCloseTo(48.33);
            expect(updateObject.I0.component.pins[0].V).toBeCloseTo(0);
            expect(updateObject.I0.component.pins[1].V).toBeCloseTo(48.33);

            expect(updateObject.W2.component.dependant.I).toBeCloseTo(5);
            expect(updateObject.W2.component.pins[0].V).toBeCloseTo(48.33);
            expect(updateObject.W2.component.pins[1].V).toBeCloseTo(48.33);
            expect(updateObject.W2.component.dependant.V).toBeCloseTo(48.33);

            expect(updateObject.W3.component.dependant.I).toBeCloseTo(0.83333);
            expect(updateObject.W3.component.pins[0].V).toBeCloseTo(40);
            expect(updateObject.W3.component.pins[1].V).toBeCloseTo(40);
            expect(updateObject.W3.component.dependant.V).toBeCloseTo(40);

            // 2 Ohm
            expect(updateObject.R4.component.pins[0].V).toBeCloseTo(48.33);
            expect(updateObject.R4.component.pins[1].V).toBeCloseTo(40);
            expect(updateObject.R4.component.dependant.I).toBeCloseTo(8.33/2);
            expect(updateObject.R4.component.dependant.V).toBeCloseTo(8.33);

            // 4 Ohm
            expect(updateObject.R5.component.pins[0].V).toBeCloseTo(48.33);
            expect(updateObject.R5.component.pins[1].V).toBeCloseTo(45);
            expect(updateObject.R5.component.dependant.I).toBeCloseTo(3.33/4);
            expect(updateObject.R5.component.dependant.V).toBeCloseTo(3.33);

            // 6 Ohm
            expect(updateObject.R6.component.pins[0].V).toBeCloseTo(45);
            expect(updateObject.R6.component.pins[1].V).toBeCloseTo(40);
            expect(updateObject.R6.component.dependant.I).toBeCloseTo(5/6);
            expect(updateObject.R6.component.dependant.V).toBeCloseTo(5);

            // 8 Ohm
            expect(updateObject.R7.component.pins[0].V).toBeCloseTo(40);
            expect(updateObject.R7.component.pins[1].V).toBeCloseTo(0);
            expect(updateObject.R7.component.dependant.I).toBeCloseTo(40/8);
            expect(updateObject.R7.component.dependant.V).toBeCloseTo(40);
        });
    });
});