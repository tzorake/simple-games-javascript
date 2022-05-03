import { Configuration } from './configuration.js';

export { PlayerController };

class PlayerController {
    constructor(controllable) {
        this.controllable = controllable;
        this.canvas = Configuration.CANVAS;
        this.keyPool = [];
        this.init();
    }

    init() {
        const controllable = this.controllable;
        const keyPool = this.keyPool;
        const canvas = this.canvas;

        (function() {
            canvas.addEventListener('mousedown', event => {
                
                if (!controllable.isPaused()) {
                    const button = event.button;

                    const x = Math.trunc(event.offsetX / Configuration.TILE_SIZE);
                    const y = Math.trunc(event.offsetY / Configuration.TILE_SIZE);

                    if (keyPool.length > 2) {
                        keyPool.shift();
                    }
                    
                    keyPool.push(new Move(x, y, button));
                }
            });

            canvas.addEventListener("contextmenu", event => event.preventDefault());

        })();
    }

    step() {
        const keyPool = this.keyPool;
        return keyPool.length > 0 ? keyPool.shift() : null;
    }
}

class Move {
    constructor(x, y, button) {
        this.x = x;
        this.y = y;
        this.button = button;
    }

    toArray() {
        return [this.x, this.y, this.button];
    }
}