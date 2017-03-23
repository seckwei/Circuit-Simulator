import Ground from '../src/Components/Ground.js';
import Pin from '../src/Components/Pin.js';
import ComponentType from '../src/ComponentType.js';

describe('Ground', () => {

    let G;
    beforeEach(() => {
        G = new Ground();
    });

    describe('constructor', () => {

        it('should have an ID with the format of Gx, where x is the n-th component created', () => {
            expect(/^G\d+$/.test(G.id)).toBe(true);
        });

        it('should have an ID which increases in number', () => {
            let intRegex = /\d+$/,
                G2 = new Ground(),
                G3 = new Ground(),
                num = parseInt(G2.id.match(intRegex)[0]),
                num2 = parseInt(G3.id.match(intRegex)[0]);

            expect(num2 - num).toBe(1);
        });
        
        it('should have type of Ground', () => {
            expect(G.type).toBe(ComponentType.TYPE_GROUND);
        });

        it('should have voltage in controlled object field', () => {
            expect(Object.keys(G.controlled)).toContain("V");
            expect(Object.keys(G.dependant)).not.toContain("V");
        });

        it('should have 0 as the voltage', () => {
            expect(G.controlled.V).toBe(0);
        });

        it('should have nothing in dependant object field', () => {
            expect(Object.keys(G.dependant)).not.toContain("V");
            expect(Object.keys(G.dependant)).not.toContain("I");
        });

        it('should have 2 pins by default', () => {
            expect(G.pins).toEqual([new Pin(G,0), new Pin(G,1)]);
        });

        it('should have pins that "knows" its own index', () => {
            expect(G.pins[0].index).toBe(0);
            expect(G.pins[1].index).toBe(1);
        });

    });

    describe('otherPins(pinIndex)', () => {
        it('should return an array with all pins except the one at the given pin index', () => {
            expect(G.otherPins(0)).toEqual([G.pins[1]]);
        });
    });
});