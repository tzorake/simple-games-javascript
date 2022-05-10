import { Configuration } from './configuration.js';
import { Graphics } from './graphics.js';
import { Game } from './game.js';

const game = new Game();

// main loop
let lastFrameTime = Date.now();
window.requestAnimationFrame(function frameHandler() {
    const now = Date.now();

    if (!game.isFinished() && !game.isPaused()) {
        game.update(now - lastFrameTime);
        game.draw();

        lastFrameTime = now;
    }

    window.requestAnimationFrame(frameHandler);
});

// listener for `START_BUTTON`
Configuration.START_BUTTON.addEventListener('click', event => {
    game.startGame();

    game.updateCongratsScreen();
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

Configuration.DIFFICULTY_BUTTON.addEventListener('click', event => {
    const difficulty = Configuration.DIFFICULTY_BUTTON.innerHTML;

    const difficulties = Object.keys(Configuration.DIFFICULTIES_COLORS);
    const colors = Object.values(Configuration.DIFFICULTIES_COLORS);
    const difficultiesCoint = difficulties.length;
    const newDifficultyIndex = (difficulties.indexOf(difficulty) + 1) % difficultiesCoint;
    const newDifficulty = difficulties[newDifficultyIndex];

    Configuration.DIFFICULTY_BUTTON.style = `background: ${colors[newDifficultyIndex]};`;
    Configuration.DIFFICULTY_BUTTON.innerHTML = newDifficulty;

    game.setDifficulty(newDifficulty);
    game.startGame();
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

        G.arc(whereX, whereY, width, height, -Math.PI, -Math.PI/2, '#28c869');
        G.arc(whereX + marginX, whereY, width, height, -Math.PI/2, 0, '#28c869');
        G.arc(whereX, whereY - marginX, width + marginX, height* Math.sqrt(2), 0, Math.PI, '#28c869');
    }

)();