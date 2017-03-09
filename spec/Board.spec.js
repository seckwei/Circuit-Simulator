const Board = require('../src/Board.js'),
    { VoltageSource, CurrentSource, Wire, Resistor, Ground } = require('../src/AllComponents.js');

describe('Board', () => {
    let B, V, G;

    beforeEach(() => {
        B = new Board();
        V = new VoltageSource();
        G = new Ground();
    });

    describe('add(component, pinPositions)', () => {
        it('should add the component pins to board.grid in the correct positions', () => {
            B.add(V, [[0,0], [10,0]]);
            expect(B.grid[0][0]).toEqual([V.pins[0]]);
            expect(B.grid[10][0]).toEqual([V.pins[1]]);
        });

        it('should add the component pins to board.pins under the correct key', () => {
            B.add(V, [[0,0], [10,0]]);
            expect(B.pins['0,0']).toEqual([V.pins[0]]);
            expect(B.pins['10,0']).toEqual([V.pins[1]]);
        });

        it('should update the position of the pins', () => {
            B.add(V, [[0,0], [10,0]]);
            expect(V.pins[0].position).toEqual([0,0]);
            expect(V.pins[1].position).toEqual([10,0]);
        });
    });

    describe('remove(component)', () => { 
        it('should remove the component from board.grid and board.pins', () => {
            B.add(V, [[0,0], [10,0]]);
            B.remove(V);

            expect(B.grid[0][0]).toEqual([]);
            expect(B.grid[10][0]).toEqual([]);

            expect(B.pins['0,0']).toEqual([]);
            expect(B.pins["10,0"]).toEqual([]);

            expect(V.pins[0].position).toBe(null);
            expect(V.pins[1].position).toBe(null);
        });
    });
});