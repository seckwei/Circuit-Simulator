// @flow

/**
 * Instead of inheriting from Array type, I wrapped an
 * array in Matrix class. Array inheritance is still not
 * supported properly in transpilation. The problem I had 
 * is that the inherited Array will always be returned,
 * rather than the derived's instance.
 * See: https://babeljs.io/docs/usage/caveats/
 * 
 */
export default class Matrix {

    data: number[][];

    /**
     * Creates an instance of Matrix.
     * @param {number} [row=undefined] 
     * @param {number} [col=undefined] 
     */
    constructor(row: ?number = undefined, col: ?number = undefined) {

        /**
         * Representation of the matrix
         * @type {number[][]}
         */
        this.data = [];

        if(Number.isInteger(row)) {

            this.data.length = row;

            if(Number.isInteger(col) || col === undefined || col === null) {

                let colArr = new Array(col || row).fill(0);

                this.data.fill().forEach((r, i, a) => {
                    a[i] = (colArr.slice());
                });

            }
        }
    }

    /**
     * Adds a 0-filled row to the matrix
     * @public
     * @param {number} [amount]
     */
    addRow(amount: ?number): void {
        // If this matrix has at least one row
        if(this.data.length > 0) {
            // Then we will base the length of the first row
            // to create the new ones
            let len = this.data[0].length,
                arr = [];

            arr.length = len;
            arr.fill(0);

            // If amount not set, then run once
            for(let i = 0; i < (Number.isInteger(amount)? amount : 1); ++i) {
                this.data.push(arr.slice()); // slice called to copy array
            }
        }
        else {
            for(let i = 0; i < (Number.isInteger(amount)? amount : 1); ++i) {
                this.data.push([]);
            }
        }
    }

    /**
     * Adds a 0-filled column to the matrix
     * @public
     * @param {number} [amount]
     */
    addCol(amount: ?number): void {
        // If this matrix has at least one row
        if(this.data.length > 0) {
            let newCols = [0];
            if(Number.isInteger(amount) && amount > 0) {
                newCols.length = amount;
                newCols.fill(0);
            }
            this.data.map(function(row) {
                row.push(...newCols);
            });
        }
        else {
            this.data.push([]);
        }
    }

    /**
     * Converts row matrix to column matrix and returns it
     * @static
     * @param {number[]} row
     * 
     * @returns {number[][]}
     */
    static rowToCol(row: number[]): number[][] {
        return row.map(num => [num]);
    }
}

