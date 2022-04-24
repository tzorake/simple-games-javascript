class PlayerControllerBrain {
    constructor(controllable) {
        this.controllable = controllable;
        (function() {
            document.addEventListener('keydown', (event) => {
                const keyPool = controllable.keyPool;
                const code = event.code;
                
                console.info(code + ' is pressed.')

                if (keyPool.length < 2) keyPool.push(code);
            })
        })();
    }
}