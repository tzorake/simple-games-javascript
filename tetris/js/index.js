import { Configuration } from './configuration.js';
import { Game } from './game.js';
import { Observer } from './observer.js'; 

const game = new Game();


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


const observer = game.observer;

Configuration.START_BUTTON.addEventListener('click', event => {
    observer.useState({key : 'finished', value : false }, observable => {
        game.startGame();
    });
    observer.useState({ key : 'score', value : game.score }, (observable) => {
        Configuration.SCORE_ELEMENT.innerHTML = `Score: ${observable.score}`;
    });
});

Configuration.PAUSE_BUTTON.addEventListener('click', event => {
    observer.useState({key : 'paused', value : game.isFinished() ? game.isPaused() : !game.isPaused()}, observable => {

        if (!game.isFinished()) {
            Configuration.PAUSE_BUTTON.innerHTML = game.isPaused() ? 'Resume' : 'Pause';
        }
    });

})