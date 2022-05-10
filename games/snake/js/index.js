import { Configuration } from "./configuration.js";
import { Game } from "./game.js";

const game = new Game();


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