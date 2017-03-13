const CurrentSource = require('../src/CurrentSource.js'),
   Pin = require('../src/Pin.js'),
   ComponentType = require('../src/ComponentType.js'),
   Matrix = require('../src/Matrix.js');

describe('Current Source', () => {

    let I;
    beforeEach(() => {
        I = new CurrentSource();
    });

    describe('constructor', () => {

        it('should have an ID with the format of Ix, where x is the n-th component created', () => {
            expect(/^I\d+$/.test(I.id)).toBe(true);
        });

        it('should have an ID which increases in number', () => {
            let intRegex = /\d+$/,
                I2 = new CurrentSource(),
                I3 = new CurrentSource(),
                num = parseInt(I2.id.match(intRegex)[0]),
                num2 = parseInt(I3.id.match(intRegex)[0]);

            expect(num2 - num).toBe(1);
        });
        
        it('should have type of Source', () => {
            expect(I.type).toBe(ComponentType.TYPE_SOURCE);
        });
            
        it('should have current in controlled object field', () => {
            expect(Object.keys(I.controlled)).toContain("I");
            expect(Object.keys(I.dependant)).not.toContain("I");
        });

        it('should have 5 as the default current', () => {
            expect(I.controlled.I).toBe(5);
        });

        it('should be able to take in and set inital current value', () => {
            let I_initial = new CurrentSource(7);
            expect(I_initial.controlled.I).toBe(7);
        });

        it('should have voltage in dependant object field', () => {
            expect(Object.keys(I.dependant)).toContain("V");
            expect(Object.keys(I.controlled)).not.toContain("V");
        });

        it('should have 2 pins by default', () => {
            expect(I.pins).toEqual([new Pin(I,0), new Pin(I,1)]);
        });

        it('should have pins that "knows" its own index', () => {
            expect(I.pins[0].index).toBe(0);
            expect(I.pins[1].index).toBe(1);
        });

    });

    describe('otherPins(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {
            expect(I.otherPins(0)).toEqual([I.pins[1]]);
        });
    });

    describe('stamp(matrixY, matrixJ)', () => {
        
        let Y, J;
        let Amp = 7;

        beforeEach(() => {
            Y = new Matrix(3);      // 3x3
            J = new Matrix(3, 1);   // 3x1
        });

        it('should not stamp on matrixY', () => {
            I.nodes = [1,2];
            I.stamp(Y, J);
            expect(Y.data).toEqual([
                [0,0,0],
                [0,0,0],
                [0,0,0]
            ]);
        });
        
        it('should stamp matrixJ in the correct cells', () => {
            I.controlled.I = Amp;
            I.nodes = [1,2];
            I.stamp(Y, J);

            expect(Y.data).toEqual([
                [0,0,0],
                [0,0,0],
                [0,0,0]
            ]);
            expect(J.data).toEqual([
                [0],
                [-Amp],
                [Amp]
            ]);
        });
        
        it('should stamp multiple components in matrixJ in the correct cells', () => {
            I.controlled.I = Amp;
            I.nodes = [1,2];
            I.stamp(Y, J);

            let I2 = new CurrentSource(Amp);
            I2.nodes = [1,2];
            I2.stamp(Y, J);

            expect(Y.data).toEqual([
                [0,0,0],
                [0,0,0],
                [0,0,0]
            ]);
            expect(J.data).toEqual([
                [0],
                [-Amp-Amp],
                [Amp+Amp]
            ]);
        });
            
    });

    describe('update({vals})', () => {
        it('should update its voltage with the given value', () => {
            I.update({pins: [2, 6]});
            
            expect(I.pins[0].V).toBe(2);
            expect(I.pins[1].V).toBe(6);

            expect(I.dependant.V).toBe(4);
        });
    });
});