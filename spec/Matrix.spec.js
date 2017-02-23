const Matrix = require('../src/Matrix.js');

describe('Matrix module', () => {
    
    describe('constructor()', () => {
        
        it('should create []', () => {
            let mat = new Matrix();
            
            expect(mat.length).toBe(0);
        });

    });
        
    describe('constructor(number)', () => {
        it('should create a number*number matrix', () => {
            let actual = new Matrix(5);

            expect(actual.length).toBe(5);
            expect(actual.every(row => row.length === 5)).toBe(true);    
        });
        
        it('should create a 0 filled matrix', () => {
            let actual = new Matrix(4);

            expect(actual.every(row => row.every(cell => cell === 0))).toBe(true);
        });
    });

    describe('constructor(row, col)', () => {
       it('should create a row*col matrix', () => {
           let actual = new Matrix(7,2);

           expect(actual.length).toBe(7);
           expect(actual.every(row => row.length == 2)).toBe(true);
       });
    });
    
    describe('addRow(number)', () => {

        let mat;
        beforeEach(() => {
            mat = new Matrix(5);
        });
        
        it('should append 1 new empty row if the matrix is empty', () => {
            let mat2 = new Matrix();
            mat2.addRow();

            expect(mat2.length).toBe(1);
            expect(mat2[0]).toEqual([]);
        }); 

        it('should append 1 new row by default - no argument passed', () => {
            mat.addRow();

            expect(mat.length).toBe(6);
        });
        
        it('should append new number of rows as specified by the argument', () => {
            mat.addRow(2);

            expect(mat.length).toBe(7);
        });

        it('should 0-fill the new rows', () => {
            mat.addRow(2);

            expect(mat[5]).toEqual(Array(5).fill(0));
            expect(mat[6]).toEqual(Array(5).fill(0));
        });

    });

    describe('addCol(number)', () => {

        let mat;
        beforeEach(() => {
            mat = new Matrix(5);
        });

        it('should append 1 new empty row if the matrix is empty', () => {
            let mat2 = new Matrix();
            mat2.addCol();

            expect(mat2.length).toBe(1);
            expect(mat2[0]).toEqual([]);
        });

        it('should append 1 new col by default - no argument passed', () => {
            mat.addCol();

            expect(mat.every(row => row.length === 6)).toBe(true);
        });
        
        it('should append new number of cols as specified by the argument', () => {
            mat.addCol(2);

            expect(mat.every(row => row.length === 7)).toBe(true);
        });

        it('should 0-fill the new cols', () => {
            mat.addCol(2);

            expect(mat.every(row => row.slice(-2).toString() === '0,0')).toBe(true);
        });
        
    });
    
    describe('Matrix.rowToCol(row)', () => {
        
        it('should convert a row matrix to a column matrix', () => {
            let row = [1,2,3],
                col = [[1],[2],[3]];

            expect(Matrix.rowToCol(row)).toEqual(col);
        });

    });
});