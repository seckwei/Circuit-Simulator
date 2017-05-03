import Resistor from '../src/Components/Resistor.js';
import Pin from '../src/Components/Pin.js';
import ComponentType from '../src/ComponentType.js';
import Matrix from '../src/Matrix.js';

describe('Resistor', () => {

    let R;
    beforeEach(() => {
        R = new Resistor();
    });

    describe('constructor', () => {

        it('should have an ID with the format of Rx, where x is the n-th component created', () => {
            expect(/^R\d+$/.test(R.id)).toBe(true);
        });

        it('should have an ID which increases in number', () => {
            let intRegex = /\d+$/,
                R2 = new Resistor(),
                R3 = new Resistor(),
                num = parseInt(R2.id.match(intRegex)[0]),
                num2 = parseInt(R3.id.match(intRegex)[0]);

            expect(num2 - num).toBe(1);
        });
        
        it('should have type of Resistor', () => {
            expect(R.type).toBe(ComponentType.TYPE_RESISTOR);
        });

        it('should have resistance in controlled object field', () => {
            expect(Object.keys(R.controlled)).toContain("R");
            expect(Object.keys(R.dependant)).not.toContain("R");
        });

        it('should have 5 as the default resistance', () => {
            expect(R.controlled.R).toBe(5);
        });

        it('should be able to take in and set inital resistance value', () => {
            let R_initial = new Resistor(7);
            expect(R_initial.controlled.R).toBe(7);
        });

        it('should have voltage in dependant object field', () => {
            expect(Object.keys(R.dependant)).toContain("V");
            expect(Object.keys(R.dependant)).toContain("I");
            expect(Object.keys(R.controlled)).not.toContain("V");
            expect(Object.keys(R.controlled)).not.toContain("I");
        });

        it('should have 2 pins by default', () => {
            expect(R.pins).toEqual([new Pin(R,0), new Pin(R,1)]);
        });

        it('should have pins that "knows" its own index', () => {
            expect(R.pins[0].index).toBe(0);
            expect(R.pins[1].index).toBe(1);
        });

    });
        
    describe('otherPins(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {
            expect(R.otherPins(0)).toEqual([R.pins[1]]);
        });
    });

    describe('stamp(matrixY, matrixJ)', () => {

        let Y, J;
        let Ohm = 10,
            G = 1/Ohm;
        beforeEach(() => {
            Y = new Matrix(3);      // 3x3
            J = new Matrix(3, 1);   // 3x1
        });            

        it('should not stamp on matrixJ', () => {
            R.nodes = [1,2];
            R.stamp(Y, J);
            expect(J.data).toEqual([
                [0],
                [0],
                [0]
            ]);
        });
        
        it('should stamp matrixY in the correct cells', () => {
            R.controlled.R = Ohm;
            R.nodes = [1,2];
            R.stamp(Y, J);

            expect(Y.data).toEqual([
                [0,  0,  0],
                [0,  G, -G],
                [0, -G,  G]
            ]);
            expect(J.data).toEqual([
                [0],
                [0],
                [0]
            ]);
        });

        it('should stamp multiple components in matrixY in the correct cells', () => {
            R.controlled.R = Ohm;
            R.nodes = [1,2];
            R.stamp(Y, J);

            let R2 = new Resistor(Ohm);
            R2.nodes = [0,1];
            R2.stamp(Y, J);

            expect(Y.data).toEqual([
                [ G,  -G,  0],
                [-G, G+G, -G],
                [ 0,  -G,  G]
            ]);
            expect(J.data).toEqual([
                [0],
                [0],
                [0]
            ]);
        });
            
    });

    describe('update({vals})', () => {
        it('should update its voltage and current with the given values', () => {
            R.controlled.R = 2;
            R.update({pins: [10, 4]});

            expect(R.pins[0].V).toBe(10);
            expect(R.pins[1].V).toBe(4);

            expect(R.dependant.V).toBe(6);
            expect(R.dependant.I).toBe(3);
        });
    });
});