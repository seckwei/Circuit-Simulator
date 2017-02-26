const CurrentSource = require('../src/CurrentSource.js'),
   { Pin } = require('../src/Component.js'),
   ComponentType = require('../src/ComponentType.js');

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

    describe('otherPin(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {
            expect(I.otherPin(0)).toEqual([I.pins[1]]);
        });
    });

    describe('stamp(matrixY, matrixJ)', () => {
        it('should stamp only on matrixJ', () => {
            fail();
        });
    })
});