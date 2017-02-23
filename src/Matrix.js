// @flow

/**
 * @class Matrix
 * @extends Array
 * 
 * The prototypical method is employed rather than ES6 class because
 * inheriting primitive type such as Array will present problems when
 * transpiled. The problem I had is that the super class array intance
 * will always be returned, rather than the derived's instance.
 * See: https://babeljs.io/docs/usage/caveats/
 */

/**
 * Creates an instance of Matrix.
 * @param {(number|void)} [row=undefined] 
 * @param {(number|void)} [col=undefined] 
 * 
 * @memberOf Matrix
 */
function Matrix(row: number|void = undefined, col: number|void = undefined) {

    if(Number.isInteger(row)) {
        this.length = row;

        if(Number.isInteger(col) || col === undefined || col === null) {
            let colArr = new Array(col || row).fill(0);
            this.fill().forEach((r, i, a) => {
                a[i] = colArr.slice();
            });
        }
    }
}

Matrix.prototype = Object.create(Array.prototype);

Matrix.prototype.addRow = function (amount: ?number) {
    // If this matrix has at least one row
    if(this.length > 0) {
        // Then we will base the length of the first row
        // to create the new ones
        let len = this[0].length,
            arr = [];

        arr.length = len;
        arr.fill(0);

        // If amount not set, then run once
        for(let i = 0; i < (Number.isInteger(amount)? amount : 1); ++i) {
            this.push(arr.slice()); // slice called to copy array
        }
    }
    else {
        for(let i = 0; i < (Number.isInteger(amount)? amount : 1); ++i) {
            this.push([]);
        }
    }
};

Matrix.prototype.addCol = function (amount: ?number) {
    // If this matrix has at least one row
    if(this.length > 0) {
        let newCols = [0];
        if(Number.isInteger(amount) && amount > 0) {
            newCols.length = amount;
            newCols.fill(0);
        }
        this.map(function(row) {
            row.push(...newCols);
        });
    }
    else {
        this.push([]);
    }
}

module.exports = Matrix;