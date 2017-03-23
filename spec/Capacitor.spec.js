import Capacitor from '../src/Components/Capacitor.js';
import Pin from '../src/Components/Pin.js';
import ComponentType from '../src/ComponentType.js';
import Matrix from '../src/Matrix.js';
import simConfig from '../src/SimulationConfig.js';

describe('Capacitor', () => {

    let C;
    beforeEach(() => {
        C = new Capacitor();
    });

    describe('constructor', () => {

        it('should have an ID with the format of Cx, where x is the n-th component created', () => {
            expect(/^C\d+$/.test(C.id)).toBe(true);
        });

        it('should have an ID which increases in number', () => {
            let intRegex = /\d+$/,
                C2 = new Capacitor(),
                C3 = new Capacitor(),
                num = parseInt(C2.id.match(intRegex)[0]),
                num2 = parseInt(C3.id.match(intRegex)[0]);

            expect(num2 - num).toBe(1);
        });
        
        it('should have type of Capacitor', () => {
            expect(C.type).toBe(ComponentType.TYPE_CAPACITOR);
        });
            
        it('should have capacitance in controlled object field', () => {
            expect(Object.keys(C.controlled)).toContain("C");
            expect(Object.keys(C.dependant)).not.toContain("C");
        });

        it('should have default 1micro Farad', () => {
            expect(C.controlled.C).toBeCloseTo(1e-6);
        });

        it('should be able to take in and set inital capacitance value', () => {
            let C_initial = new Capacitor(2);
            expect(C_initial.controlled.C).toBe(2);
        });

        it('should have voltage, current, companion models conductance and current in dependant object field', () => {
            expect(Object.keys(C.dependant).sort()).toEqual(['V', 'I', 'companionG', 'companionI'].sort());
        });

        it('should have 2 pins by default', () => {
            expect(C.pins).toEqual([new Pin(C,0), new Pin(C,1)]);
        });

        it('should have pins that "knows" its own index', () => {
            expect(C.pins[0].index).toBe(0);
            expect(C.pins[1].index).toBe(1);
        });

    });

    describe('otherPins(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {
            expect(C.otherPins(0)).toEqual([C.pins[1]]);
        });
    });

    describe('stamp(matrixY, matrixJ, simConfig)', () => {
        
        let Y, J,
            capacitance = 7,
            // We need to retain the state of C2 across the following two test so that
            // we can do the Trapezoidal rule to approximate the next timestep's value
            C2 = new Capacitor(capacitance),
            // Companion model's resistor's conductance
            companionG = 2 * capacitance / simConfig.timestep;

        beforeEach(() => {
            Y = new Matrix(3);      // 3x3
            J = new Matrix(3, 1);   // 3x1
        });

        it('should stamp matrix Y and J in the correct cells (when in intial condition)', () => {
            C2.nodes = [1,2];
            C2.stamp(Y, J, simConfig);

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
            C2.dependant.V = V;
            C2.dependant.I = I;

            C2.stamp(Y, J, simConfig);

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
            let capacitance = 10,
                companionG = 2 * capacitance / simConfig.timestep;

            // We are assuming this is in inital condition
            C.controlled.C = capacitance;
            C.dependant.companionG = companionG;
            C.dependant.companionI = 0;

            C.update({pins: [2, 6]});
            
            expect(C.pins[0].V).toBe(2);
            expect(C.pins[1].V).toBe(6);

            expect(C.dependant.V).toBe(-4);
            expect(C.dependant.I).toBeCloseTo(C.dependant.V * companionG - 0);
        });
    });
})