export { Vector2 };

class Vector2 {
    static LEFT = new Vector2(-1, 0);
    static RIGHT = new Vector2(1, 0);
    static UP = new Vector2(0, -1);
    static DOWN = new Vector2(0, 1);

    static DIRECTION = [Vector2.LEFT, Vector2.UP, Vector2.RIGHT, Vector2.DOWN];

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(anotherVector) {
        const result = new Vector2(this.x + anotherVector.x, this.y + anotherVector.y);

        return result;
    }

    subtract(anotherVector) {
        const result = new Vector2(this.x - anotherVector.x, this.y - anotherVector.y);

        return result;
    }
}