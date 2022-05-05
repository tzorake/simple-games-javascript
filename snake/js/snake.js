import { Configuration } from './configuration.js';
import { Vector2 } from './vector.js';

export { Snake };

class Snake {
    constructor(x, y) {
        this.head = new Vector2(x, y);
        this.tail = [];
        this.vel = Vector2.UP;
        this.alive = true;

        for (let i = 1; i < Configuration.SNAKE_INIT_LENGTH; ++i) {
            this.tail.push(new Vector2(this.head.x, this.head.y + 1));
        }
    }

    step() {
        const head =  this.head;
        const tail = this.tail;
        const velocity = this.vel;

        for (let i = tail.length - 1; i > 0; --i) {
            // tail[i].x = tail[i - 1].x;
            // tail[i].y = tail[i - 1].y;
            tail[i] = new Vector2(tail[i - 1].x, tail[i - 1].y);
        }

        // tail[0].x = head.x;
        // tail[0].y = head.y;

        tail[0] = new Vector2(head.x, head.y);

        // head.x += velocity.x;
        // head.y += velocity.y;

        this.head = head.add(velocity);
    }

    intersects(pos) {
        const tail = this.tail;

        return tail.some(block => block.x === pos.x && block.y === pos.y);
    }

    isAlive() {
        return this.alive;
    }
}

