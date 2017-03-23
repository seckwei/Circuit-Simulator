import Inductor from '../src/Components/Inductor.js';
import Pin from '../src/Components/Pin.js';
import ComponentType from '../src/ComponentType.js';
import Matrix from '../src/Matrix.js';
import simConfig from '../src/SimulationConfig.js';

describe('Inductor', () => {

    let L;
    beforeEach(() => {
        L = new Inductor();
    });

    describe('constructor', () => {

        it('should have an ID with the format of Cx, where x is the n-th component created', () => {
            expect(/^L\d+$/.test(L.id)).toBe(true);
        });

        it('should have an ID which increases in number', () => {
            let intRegex = /\d+$/,
                L2 = new Inductor(),
                L3 = new Inductor(),
                num = parseInt(L2.id.match(intRegex)[0]),
                num2 = parseInt(L3.id.match(intRegex)[0]);

            expect(num2 - num).toBe(1);
        });
        
        it('should have type of Inductor', () => {
            expect(L.type).toBe(ComponentType.TYPE_INDUCTOR);
        });
            
        it('should have inductance in controlled object field', () => {
            expect(Object.keys(L.controlled)).toContain("L");
            expect(Object.keys(L.dependant)).not.toContain("L");
        });

        it('should have default 1 Henry', () => {
            expect(L.controlled.L).toBe(1);
        });

        it('should be able to take in and set inital inductance value', () => {
            let L_initial = new Inductor(2);
            expect(L_initial.controlled.L).toBe(2);
        });

        it('should have voltage, current, companion models conductance and current in dependant object field', () => {
            expect(Object.keys(L.dependant).sort()).toEqual(['V', 'I', 'companionG', 'companionI'].sort());
        });

        it('should have 2 pins by default', () => {
            expect(L.pins).toEqual([new Pin(L,0), new Pin(L,1)]);
        });

        it('should have pins that "knows" its own index', () => {
            expect(L.pins[0].index).toBe(0);
            expect(L.pins[1].index).toBe(1);
        });

    });

    describe('otherPins(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {
            expect(L.otherPins(0)).toEqual([L.pins[1]]);
        });
    });

    describe('stamp(matrixY, matrixJ, simConfig)', () => {
        
        let Y, J,
            inductance = 7,
            // We need to retain the state of L2 across the following two test so that
            // we can do the Trapezoidal rule to approximate the next timestep's value
            L2 = new Inductor(inductance),
            // Companion model's resistor's conductance
            companionG = simConfig.timestep / 2 * inductance;

        beforeEach(() => {
            Y = new Matrix(3);      // 3x3
            J = new Matrix(3, 1);   // 3x1
        });

        it('should stamp matrix Y and J in the correct cells (when in intial condition)', () => {
            L2.nodes = [1,2];
            L2.stamp(Y, J, simConfig);

            expect(Y.data).toEqual([
                [0,  0,  0],
                [0,  companionG, -companionG],
                [0, -companionG,  companionG]
            ]);
            
            // Current of the companion model is 0 for initial condition
            expect(J.data).toEqual([
                [0],
                [0],
                [0]
            ]);
        });
        
        it('should stamp matrix Y and J in the correct cells (at subsequent timestep)', () => {
            let V = 1, I = 2,
                companionI = I + companionG * V;

            // Assuming the component has been updated after the first timestep
            L2.dependant.V = V;
            L2.dependant.I = I;

            L2.stamp(Y, J, simConfig);

            expect(Y.data).toEqual([
                [0,  0,  0],
                [0,  companionG, -companionG],
                [0, -companionG,  companionG]
            ]);

            expect(J.data).toEqual([
                [0],
                [companionI],
                [-companionI]
            ]);
        });
            
    });

    describe('update({vals})', () => {
        it('should update its voltage with the given value', () => {
            let inductance = 10,
                companionG = simConfig.timestep / 2 * inductance;

            // We are assuming this is in inital condition
            L.controlled.L = inductance;
            L.dependant.companionG = companionG;
            L.dependant.companionI = 0;

            L.update({pins: [2, 6]});
            
            expect(L.pins[0].V).toBe(2);
            expect(L.pins[1].V).toBe(6);

            expect(L.dependant.V).toBe(-4);
            expect(L.dependant.I).toBeCloseTo(L.dependant.V * companionG - 0);
        });
    });
})