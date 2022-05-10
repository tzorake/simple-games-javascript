import { Configuration } from './configuration.js';
import { Game } from './game.js';

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
    }
});

// listener for `CONTROL_BUTTONS` (switch wasd to arrows and visa versa)
window.addEventListener('keydown', (event) => {
    const code = event.code;
    const up = document.querySelector('.control-button.up p');
    const down = document.querySelector('.control-button.down p');
    const left = document.querySelector('.control-button.left p');
    const right = document.querySelector('.control-button.right p');

    if (code === 'ControlLeft') {
        up.innerHTML = '∟';
        up.style.transform = 'rotate(0.375turn)';
        down.innerHTML = '∟';
        down.style.transform = 'rotate(-0.125turn)';
        left.innerHTML = '∟';
        left.style.transform = 'rotate(0.125turn)';
        right.innerHTML = '∟';
        right.style.transform = 'rotate(-0.375turn)';
    }
});

document.addEventListener('keyup', (event) => {
    const code = event.code;
    const up = document.querySelector('.control-button.up p');
    const down = document.querySelector('.control-button.down p');
    const left = document.querySelector('.control-button.left p');
    const right = document.querySelector('.control-button.right p');

    if (code === 'ControlLeft') {
        up.innerHTML = 'w';
        up.style.transform = 'rotate(0.0turn)';
        down.innerHTML = 's';
        down.style.transform = 'rotate(0.0turn)';
        left.innerHTML = 'a';
        left.style.transform = 'rotate(0.0turn)';
        right.innerHTML = 'd';
        right.style.transform = 'rotate(0.0turn)';
    }
});