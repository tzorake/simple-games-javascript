export { PlayerController };

class PlayerController {
    constructor() {
        this.keyPool = [];
        this.init();
    }

    init() {
        const keyPool = this.keyPool;
        
        (function() {
            window.addEventListener('keydown', (event) => {
                const code = event.code;
                
                console.info(code + ' is pressed.')

                if (keyPool.length > 2) {
                    keyPool.shift();
                }
                
                keyPool.push(code);
            });
        })();
    }

    step() {
        const keyPool = this.keyPool;
        return keyPool.length > 0 ? keyPool.shift() : null;
    }
}