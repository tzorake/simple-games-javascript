import { Matrix } from './matrix.js';
export { Vector2 };

class Vector2 {
    static LEFT = new Vector2(-1, 0);
    static RIGHT = new Vector2(1, 0);
    static UP = new Vector2(0, -1);
    static DOWN = new Vector2(0, 1);

    constructor(x, y) {
        this.vec = [x, y];

        if (!this.isValid()) {
            console.error('ERROR: Vector, which you want to create, has invalid shape!');
        }

        this.x = x;
        this.y = y;
    }

    add(anotherVector) {
        const first = this.toMatrix();
        const second = anotherVector instanceof Matrix ? anotherVector : anotherVector.toMatrix();

        const result = first.add(second);

        return result.toVector();
    }

    subtract(anotherVector) {
        const first = this.toMatrix();
        const second = anotherVector instanceof Matrix ? anotherVector : anotherVector.toMatrix();

        const result = first.subtract(second);

        return result.toVector();
    }

    multiply(anotherVector) {
        const first = this.toMatrix();
        const second = anotherVector instanceof Matrix ? anotherVector : anotherVector.toMatrix();

        const result = first.multiply(second);

        return result.toVector();
    }

    toMatrix() {
        return new Matrix([[this.x],[this.y]]);
    }

    isValid() {
        return Array.isArray(this.vec) &&
               this.vec.length === 2;
    }
}

