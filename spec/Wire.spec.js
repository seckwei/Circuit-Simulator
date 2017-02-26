const Wire = require('../src/Wire.js'),
   { Pin } = require('../src/Component.js');

describe('Wire', () => {

    let W;
    beforeEach(() => {
        W = new Wire();
    });

    describe('constructor', () => {

        it('should have an ID with the format of Wx, where x is the n-th component created', () => {
            expect(/^W\d+$/.test(W.id)).toBe(true);
        });

        it('should have an ID which increases in number', () => {
            let intRegex = /\d+$/,
                W2 = new Wire(),
                W3 = new Wire(),
                num = parseInt(W2.id.match(intRegex)[0]),
                num2 = parseInt(W3.id.match(intRegex)[0]);

            expect(num2 - num).toBe(1);
        });

        it('should have voltage in BOTH controlled and dependant object field', () => {
            expect(Object.keys(W.controlled)).toContain("V");
            expect(Object.keys(W.dependant)).toContain("V");
        });

        it('should have 0 as the voltage', () => {
            expect(W.controlled.V).toBe(0);
        });

        it('should have 2 pins by default', () => {
            expect(W.pins).toEqual([new Pin(W,0), new Pin(W,1)]);
        });

        it('should have pins that "knows" its own index', () => {
            expect(W.pins[0].index).toBe(0);
            expect(W.pins[1].index).toBe(1);
        });

    });

    describe('otherPin(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {
            expect(W.otherPin(0)).toEqual([W.pins[1]]);
        });
    });

    describe('stamp(matrixY, matrixJ)', () => {
        it('should stamp on matrixY and matrixJ', () => {
            fail();
        });
    })
});