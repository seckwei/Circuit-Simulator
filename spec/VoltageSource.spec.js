const VoltageSource = require('../src/VoltageSource.js'),
   { Pin } = require('../src/Component.js');

describe('Voltage Source', () => {

    let V;
    beforeEach(() => {
        V = new VoltageSource();
    });

    describe('constructor', () => {

        it('should have an ID with the format of Vx, where x is the n-th component created', () => {
            expect(/^V\d+$/.test(V.id)).toBe(true);
        });

        it('should have an ID which increases in number', () => {
            let intRegex = /\d+$/,
                V2 = new VoltageSource(),
                V3 = new VoltageSource(),
                num = parseInt(V2.id.match(intRegex)[0]),
                num2 = parseInt(V3.id.match(intRegex)[0]);

            expect(num2 - num).toBe(1);
        });

        it('should have voltage in controlled object field', () => {
            expect(Object.keys(V.controlled)).toContain("V");
            expect(Object.keys(V.dependant)).not.toContain("V");
        });

        it('should have 5 as the default current', () => {
            expect(V.controlled.V).toBe(5);
        });

        it('should be able to take in and set voltage current value', () => {
            let V_initial = new VoltageSource(7);
            expect(V_initial.controlled.V).toBe(7);
        });

        it('should have current in dependant object field', () => {
            expect(Object.keys(V.dependant)).toContain("I");
            expect(Object.keys(V.controlled)).not.toContain("I");
        });

        it('should have 2 pins by default', () => {
            expect(V.pins).toEqual([new Pin(V,0), new Pin(V,1)]);
        });

        it('should have pins that "knows" its own index', () => {
            expect(V.pins[0].index).toBe(0);
            expect(V.pins[1].index).toBe(1);
        });

    });

    describe('otherPin(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {
            expect(V.otherPin(0)).toEqual([V.pins[1]]);
        });
    });

    describe('stamp(matrixY, matrixJ)', () => {
        it('should stamp only on matrixY and matrixJ', () => {
            fail();
        });
    })
});