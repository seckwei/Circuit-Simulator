// @flow

class Board {

    grid: Pin[][][];
    pins: BoardPins;

    /**
     * 
     */
    constructor() {
        /**
         * Grids which holds the pins of components
         * @type {Pin[][][]}
         */
        this.grid = [];
        /**
         * A dictionary, position => pins
         * @type {BoardPins}
         */
        this.pins = {};
    }

    /**
     * 
     */
    add(component: Component, pinPositions: number[][]): void {
        for(let index in component.pins) {
            let pos = pinPositions[index];

            if(pos == undefined) {
                throw new Error('Missing pin position');
            }

            component.pins[index].position = pos;
            if(this.grid[pos[0]] === undefined) {
                this.grid[pos[0]] = [];
            }
            this.grid[pos[0]][pos[1]] = (this.grid[pos[0]][pos[1]] || []).concat(component.pins[index]);
            this.pins[pos.toString()] = this.grid[pos[0]][pos[1]];
        }
    }

    /**
     * 
     */
    remove(component: Component): void {
        let pinPositions = component.pins.map(pin => {
            let pos = pin.position.slice();
            pin.position = null;
            return pos;
        });

        pinPositions.forEach(pos => {
            let pinIndex = -1,
                pinArray = this.grid[pos[0]][pos[1]];
            for(let index in pinArray) {
                if(pinArray[index].parent.id === component.id) {
                    pinIndex = index;
                    break;
                }
            }
            pinArray.splice(pinIndex, 1);
        });
    }
}

module.exports = Board;