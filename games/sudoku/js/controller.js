import { Configuration } from "./configuration.js";
export { MouseController, KeyboardController };

class MouseController {
    constructor(controllable) {
        this.controllable = controllable;
        this.keyPool = [];
        this.init();
    }

    init() {
        const keyPool = this.keyPool;
        const controllable = this.controllable;
        const keyCount = 5;

        (function() {
            canvas.addEventListener('mousedown', event => {
                
                if (!controllable.isPaused()) {
                    const button = event.button;

                    const x = Math.trunc(event.offsetX / Configuration.TILE_SIZE);
                    const y = Math.trunc(event.offsetY / Configuration.TILE_SIZE);

                    if (keyPool.length > keyCount) {
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


class KeyboardController {
    constructor(controllable) {
        this.controllable = controllable;
        this.keyPool = [];
        this.init();
    }

    init() {
        const keyPool = this.keyPool;
        const controllable = this.controllable;
        const keyCount = 5;
        
        (function() {
            window.addEventListener('keydown', (event) => {
                if (!controllable.isPaused()) {
                    const code = event.code;
                
                    // console.info(code + ' is pressed.')

                    if (keyPool.length > keyCount) {
                        keyPool.shift();
                    }
                    
                    keyPool.push(code);
                }
            });
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