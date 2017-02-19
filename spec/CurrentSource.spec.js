const CurrentSource = require('../src/CurrentSource.js'),
    Pin = require('../src/Pin.js');

describe('Current Source', () => {

    describe('constructor', () => {

        let I;
        beforeEach(() => {
            I = new CurrentSource();
        });

        it('should have current in controlled object field', () => {
            expect(Object.keys(I.controlled)).toContain("I");
            expect(Object.keys(I.dependat)).not.toContain("I");
        });

        it('should have 5 as the default current', () => {
            expect(I.controlled.I).toBe(5);
        });

        it('should be able to take in and set inital current value', () => {
            let I_initial = new CurrentSource(7);
            expect(I.controlled.I).toBe(7);
        });

        it('should have voltage in dependant object field', () => {
            expect(Object.keys(I.dependant)).toContain("V");
            expect(Object.keys(I.controlled)).not.toContain("V");
        });

        it('should have 2 pins by default', () => {
            expect(I.pins).toEqual([new Pin(), new Pin()]);
        });

    });

    describe('otherPin(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {});
    });

    describe('stamp(matrixY, matrixJ)', () => {
        it('should stamp only on matrixJ', () => {});
    })
});