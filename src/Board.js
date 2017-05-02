// @flow

/**
 * This class holds the pins of the components.
 */
export default class Board {

    components: {string: Component};
    grid: Pin[][][];
    pins: BoardPins;

    /**
     * Initialises the fields
     */
    constructor() {
        /**
         * A dictionary of components, id => component
         * @type {Object}
         */
        this.components = {};
        /**
         * Grid which holds the pins of components
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
     * Adds a component to the board and adds the position to
     * the respective component pins. Returns component id.
     * @param {Component} component 
     * @param {number[][]} pinPositions 
     * 
     * @returns {string} Newly added component's id
     */
    add(component: Component, pinPositions: number[][]): string {
        this.components[component.id] = component;

        for(let index in component.pins) {
            let pos = pinPositions[parseInt(index)];

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

        return component.id;
    }

    /**
     * Removes the given component from the board and also
     * removes the position from the respective pins
     * @param {string} component's ID
     */
    remove(id: string): void {
        let toRemove: component = this.components[id];

        let pinPositions = toRemove.pins.map(pin => {
            let pos = pin.position.slice();
            pin.position = null;
            return pos;
        });

        pinPositions.forEach(pos => {
            let pinIndex = -1,
                pinArray = this.grid[pos[0]][pos[1]];
            for(let index in pinArray) {
                if(pinArray[index].parent.id === toRemove.id) {
                    pinIndex = index;
                    break;
                }
            }
            pinArray.splice(pinIndex, 1);
        });
        
        delete this.components[id];
    }
}

