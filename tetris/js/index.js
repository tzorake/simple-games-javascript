import { Configuration } from './configuration.js';
import { Game } from './game.js';
import { Observer } from './observer.js'; 

const game = new Game();
const observer = game.observer;

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

Configuration.START_BUTTON.addEventListener('click', event => {
    observer.useState({ key : 'finished', value : game.isFinished() }, observable => {
        Configuration.GAMEOVER_SCREEN.style = `visibility: hidden;`;
        observable.startGame();
    });

    observer.useState({ key : 'score', value : game.score }, observable => {
        Configuration.SCORE_ELEMENT.innerHTML = `Score: ${observable.score}`;
    });
});

Configuration.PAUSE_BUTTON.addEventListener('click', event => {
    observer.useState({key : 'paused', value : game.isFinished() ? game.isPaused() : !game.isPaused()}, observable => {
        if (!game.isFinished()) {
            Configuration.PAUSE_BUTTON.innerHTML = game.isPaused() ? 'Resume' : 'Pause';
        }
    });
});

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