import { Utilities } from './util.js';
import { Vector2 } from './vector.js';
export { Matrix };

class Matrix {
    constructor(mtx) {        
        this.mtx = mtx;

        if (!this.isValid()) {
            console.error('ERROR: Matrix, which you want to create, has invalid shape! Every row should be the same length!');
        }

        this.shape = [mtx.length, mtx[0].length];
    }

    // matrix addition
    add(anotherMatrix) {
        anotherMatrix = anotherMatrix instanceof Matrix ? anotherMatrix : anotherMatrix.toMatrix();

        if (this.shape[0] !== anotherMatrix.shape[0] || this.shape[1] !== anotherMatrix.shape[1]) {
            console.error('ERROR: Matrices should be the same shape when you add them!');
        }

        const matrix = this.mtx.map((row, i) => row.map((item, j) => item + anotherMatrix.mtx[i][j]));

        return new Matrix(matrix);
    }

    // matrix multiplication
    multiply(anotherMatrix) {
        anotherMatrix = anotherMatrix instanceof Matrix ? anotherMatrix : anotherMatrix.toMatrix();

        if (this.shape[1] !== anotherMatrix.shape[0]) {
            console.error('ERROR: Column amount of first matrix should be equal to row amound of second matrix!');
        }

        const newShape = [this.shape[0], anotherMatrix.shape[1]];
        const rowIndeces = Utilities.range(newShape[0]);
        const colIndeces = Utilities.range(newShape[1]);
        const matrix = rowIndeces.map((_, i) => {
            return colIndeces.map((_, j) => {
                const row = this.row(i);
                const col = anotherMatrix.col(j);
                return row.map((item, index) => item*col[index]).reduce((prev, next) => prev + next);
            });
        });

        return new Matrix(matrix);
    }

    // matrix subtraction
    subtract(anotherMatrix) {
        anotherMatrix = anotherMatrix instanceof Matrix ? anotherMatrix : anotherMatrix.toMatrix();

        if (this.shape[0] !== anotherMatrix.shape[0] || this.shape[1] !== anotherMatrix.shape[1]) {
            console.error('ERROR: Matrices should be the same shape when you subtract them!');
        }

        const matrix = this.mtx.map((row, i) => row.map((item, j) => item - anotherMatrix.mtx[i][j]))

        return new Matrix(matrix);
    }

    // get matrix row
    row(index) {

        if (index < 0 && index >= -this.shape[0]) {
            index = Utilities.mod(index, this.shape[0]);
        }

        if (index >= this.shape[0] || index < 0) {
            console.error('ERROR: Index should be less than the row amount of matrix!');
        }

        return this.mtx[index];
    }

    // get matrix column
    col(index, wrap) {
        if (index < 0 && index >= -this.shape[1]) {
            index = Utilities.mod(index, this.shape[1]);
        }

        if (index >= this.shape[1] || index < 0) {
            console.error('ERROR: Index should be less than the column amount of matrix!');
        }

        return this.mtx.map(item => wrap === undefined || false ? item[index] : [item[index]]);
    }

    // print matrix
    print() {
        this.mtx.forEach(row => {
            let string = "";
            row.forEach(item => {
                string += item.toExponential(3).padStart(16);
            });
            console.info(string);
        });
    }

    // reshape matrix to `shape` shape (if current and passed shapes compitable)
    reshape(shape) {
        if (shape[0] * shape[1] != this.shape[0] * this.shape[1]) {
            console.error('ERROR: Use valid shape to rehape the matrix!');
        }
        const rowLength = shape[1];
        const rowIndeces = Utilities.range(shape[0]);
        const mtx = rowIndeces.map(item => this.mtx.slice(item*rowLength, (item + 1)*rowLength));
        return new Matrix(mtx);
    }

    // convert matirx to array
    toArray() {
        return this.mtx.reduce((prev, next) => new Array(...prev, ...next));;
    }

    // convert marix to vector
    toVector() {
        if (this.shape[0] !== 2 || this.shape[1] !== 1) {
            console.error('ERROR: The matrix, which you want to convert to Vector2, can\'t be converted because it has invalid shape!')
        }

        return new Vector2(this.mtx[0][0], this.mtx[1][0]);
    }

    // checks if passed array into constructor is valid
    isValid() {
        // mtx is an array, each subarray is an array and they are the same length
        return Array.isArray(this.mtx) && 
               !this.mtx.some(item => !Array.isArray(item)) &&
               new Set(this.mtx.map(item => item.length)).size === 1;
    }
}
