export { PlayerController };

class PlayerController {
    constructor(controllable) {
        this.controllable = controllable;
        this.keyPool = [];
        this.init();
    }

    init() {
        const keyPool = this.keyPool;
        const controllable = this.controllable;

        (function() {
            window.addEventListener('keydown', (event) => {
                if (!controllable.isPaused()) {
                    const code = event.code;
                
                    if (keyPool.length > 2) {
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