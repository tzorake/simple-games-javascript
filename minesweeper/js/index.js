import { Configuration } from './configuration.js';
import { Game } from './game.js';
import { Graphics } from './graphics.js';

const game = new Game();

// main loop
let lastFrameTime = Date.now();
window.requestAnimationFrame(function frameHandler() {
    const now = Date.now();

    if (!game.isFinished() && !game.isPaused()) {
        game.step(now - lastFrameTime);
        game.draw();

        lastFrameTime = now;
    }

    window.requestAnimationFrame(frameHandler);
});

// listener for `START_BUTTON`
Configuration.START_BUTTON.addEventListener('click', event => {
    game.startGame();

    game.updateGameoverScreen();
    game.updateScoreElement();
});

// listener for `PAUSE_BUTTON`
Configuration.PAUSE_BUTTON.addEventListener('click', event => {
    game.paused = game.isFinished() ? game.isPaused() : !game.isPaused();
    if (!game.isFinished()) {
        Configuration.PAUSE_BUTTON.innerHTML = game.isPaused() ? 'Resume' : 'Pause';
        game.updatePauseScreen();
    }

});



(

    function drawMouse() {
        const mouseCanvas = document.querySelector('#mouse-buttons')
        const G = new Graphics(mouseCanvas, mouseCanvas.getContext('2d'));
  
        const width = 50;
        const height = 50;
        
        const whereX = 25;
        const whereY = 5;

        const marginX = 5;


        // left
        G.arc(whereX, whereY, width, height, -Math.PI, -Math.PI/2, null, 'white');
    
        // // middle
        G.rect(whereX + width/2, whereY + marginX, whereX + width/2 + marginX, whereY + width/2 - marginX, null, 'white') 
    
        // // right
        G.arc(whereX + marginX, whereY, width, height, -Math.PI/2, 0, null, 'white');
    
        // // bottom
        G.arc(whereX, whereY - marginX, width + marginX, height* Math.sqrt(2), 0, Math.PI, null, 'white');
    }

)();


