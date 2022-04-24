const canvas = document.querySelector('#canvas');

Graphics.setCanvas(canvas);
Graphics.setContext(canvas.getContext('2d'));
Graphics.getContext().imageSmoothingEnabled = false;

const cellSIze = 20;
const game = new Game(canvas.width, canvas.height, cellSIze);
const gameObserver = new Observer(game);
const gameoverElement = document.querySelector('#gameover-screen');

function gameover(observable) {
    const game = observable;
    gameoverElement.style.visibility = game.isFinished() ? 'visible' : 'hidden';

    if (game.isFinished() && !game.isSnakeAlive()) {
        game.init();
    }
}

let lastFrameTime = Date.now();
window.requestAnimationFrame(function frameHandler() {
    const now = Date.now();
    if (!game.isFinished() && now - lastFrameTime >= game.tickTime()) {
        game.update();

        lastFrameTime = now;
    }

    if (!game.isFinished() && !game.isSnakeAlive()) {
        gameObserver.setState({key : 'finished', value : true}, gameover);
    }
    window.requestAnimationFrame(frameHandler);
});

const startButton = document.querySelector('#start-button');
const pauseButton = document.querySelector('#pause-button');

startButton.addEventListener('click', (event) => {
    gameObserver.setState({key : 'finished', value : false}, gameover);
});

pauseButton.addEventListener('click', (event) => {
    gameObserver.setState({key : 'paused', value : game.isFinished() ? game.isPaused() : !game.isPaused()}, (observable) => {
        const game = observable;
        const pauseButton = document.querySelector('#pause-button');

        if (!game.isFinished()) {
            pauseButton.innerHTML = game.isPaused()? 'Resume' : 'Pause';
        }
    });

})

// ∟

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

})

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
})
