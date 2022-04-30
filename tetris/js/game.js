import { Configuration } from './configuration.js';

import { Utilities } from './util.js';
import { Vector2 } from './vector.js';
import { PlayerController } from './controller.js';
import { Tetrominos, Tiles, Keys } from './enum.js';
import { Tetromino, TetrominoFactory, Tile } from './tetromino.js';
import { Observer } from './observer.js';

export { Game };

class Game {
    constructor() {
        this.G = Configuration.GRAPHICS_INSTANCE;
        this.width = Configuration.GAME_WIDTH;
        this.height = Configuration.GAME_HEIGHT;
        this.tileSize = Configuration.TILE_SIZE;

        this.observer = new Observer(this);
        this.controller = new PlayerController(this);

        this.states();
        this.startGame();
    }

    startGame() {
        this.accumulatedTime = 0;

        this.finished = false;
        this.paused = false;

        this.cells = new Array(this.width*this.height);

        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                this.cells[y*this.width + x] = (x == 0 || x == this.width - 1 || y == this.height - 1) ? Tiles.GRAY : Configuration.NO_TILE;
            }
        }

        this.lines = [];

        const randomTetrominoIndex = Utilities.getRandomInt(0, Object.keys(Tetrominos).length);
        this.tetromino = TetrominoFactory.getInstance(randomTetrominoIndex);

        const nextTetrominoIndex = Utilities.getRandomInt(0, Object.keys(Tetrominos).length);
        this.observer.useState({ key : 'nextTetrominoIndex', value : nextTetrominoIndex }, (observable) => { observable.nextTetromino() });

        this.score = 0;
    }

    step(delta) {
        this.accumulatedTime += delta;

        const tetromino = this.tetromino;
        const controller = this.controller;
        const key = controller.step();

        switch (Configuration.CONTROLS[key]) {
            case Keys.LEFT:
                if (this.isTetrominoFit(tetromino.position.add(Vector2.LEFT), tetromino.vectors)) {
                    tetromino.position = tetromino.position.add(Vector2.LEFT);
                }
            break;
            case Keys.RIGHT:
                if (this.isTetrominoFit(tetromino.position.add(Vector2.RIGHT), tetromino.vectors)) {
                    tetromino.position = tetromino.position.add(Vector2.RIGHT);
                }
            break;
            case Keys.UP:
                if (this.isTetrominoFit(tetromino.position, tetromino.rotate())) {
                    tetromino.vectors = tetromino.rotate();
                }
            break;
            case Keys.DOWN:
                if (this.isTetrominoFit(tetromino.position.add(Vector2.DOWN), tetromino.vectors)) {
                    tetromino.position = tetromino.position.add(Vector2.DOWN);
                }
            break;
            default:
        }

        if (this.accumulatedTime >= this.tickTime()) {
            this._step();
        }
    }

    _step() {
        this.accumulatedTime = 0;

        const cells = this.cells;
        const tetromino = this.tetromino;

        if (this.isTetrominoFit(tetromino.position.add(Vector2.DOWN), tetromino.vectors)) {
            tetromino.position = tetromino.position.add(Vector2.DOWN);
        }
        else {
            const vectorPositions = tetromino.vectors.map(vec => tetromino.position.add(vec));

            // lock the tetromino
            vectorPositions.forEach(vec => {
                const x = vec.x;
                const y = vec.y;

                cells[y*this.width + x] = tetromino.color;
            });
  
            // check lines
            vectorPositions.forEach(vec => {
                const y = vec.y;

                if (y < this.height - 1) {
                    let line = true;
                    for (let x = 1; line && x < this.width - 1 ; ++x) {
                        if (cells[y*this.width + x] === Configuration.NO_TILE) {
                            line = false;
                        }
                    }

                    if (line) {
                        for (let x = 1; x < this.width - 1; ++x) {
                            cells[y*this.width + x] = Configuration.NO_TILE;
                        }
                        this.lines.push(y);
                    }
                }
            });
            
            if (this.lines.length > 0) {
                this.score += (1 << this.lines.length) * 100;

                this.observer.useState({ key : 'score', value : this.score }, (observable) => {
                    Configuration.SCORE_ELEMENT.innerHTML = `Score: ${observable.score}`;
                });
            }

            // clear lines
            this.lines.forEach(index => {
                for (let x = 1; x < this.width - 1; ++x) {
                    for (let y = index; y > 0; --y) {
                        cells[y*this.width + x] = cells[(y - 1)*this.width + x];
                    }
                    cells[x] = Configuration.NO_TILE;
                }
                this.lines = [];
            });

            // new tetromino
            const tetrominosLength = Object.keys(Tetrominos).length;
            this.tetromino = TetrominoFactory.getInstance(this.nextTetrominoIndex);
            const nextTetrominoIndex = Utilities.getRandomInt(0, tetrominosLength);
            const finished = !this.isTetrominoFit(this.tetromino.position, this.tetromino.vectors);
            this.observer.useState({ key : 'nextTetrominoIndex', value : nextTetrominoIndex }, (observable) => { observable.nextTetromino() });
            this.observer.updateState({ key : 'finished', value : finished });
        }
    }

    draw() {
        const G = this.G;

        // draw backgound
        G.background('#1e1e28');

        const cells = this.cells;
        const tetromino = this.tetromino;
        const color = tetromino.color;
        const vectors = tetromino.vectors;
        const position = tetromino.position;
        const vectorPositions = vectors.map(vec => position.add(vec));

        // draw each tile
        cells.forEach((color, index) => {
            const x = index % this.width;
            const y = Math.trunc(index / this.width);
            if (color !== Configuration.NO_TILE) {
                G.image(Tile.getInstance(color), x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize);
            }
        });

        // draw a tetromino
        vectorPositions.forEach(vec => {
            G.image(Tile.getInstance(color), vec.x*this.tileSize, vec.y*this.tileSize, this.tileSize, this.tileSize);
        });
    }

    isTetrominoFit(position, vectors) {
        const cells = this.cells;
        const vectorPositions = vectors.map(vec => position.add(vec));

        if (vectorPositions.every(vec => vec.x >= 0 && vec.x < this.width) && 
            vectorPositions.every(vec => vec.y >= 0 && vec.y < this.height) &&
            vectorPositions.some(vec => cells[vec.y*this.width + vec.x] !== Configuration.NO_TILE)) 
        {
            return false;
        }

        return true;
    }

    isPaused() {
        return this.paused;
    }

    isFinished() {
        return this.finished;
    }

    tickTime() {
        return 1000 / 5;
    }


    states() {
        this.observer.addState({ key : 'finished', value : true}, () => console.info('Game is over!'));
    }


    nextTetromino() {
        const eachClass = Configuration.TILE_PATHS.map(path => /\/(\w+-\w+)/g.exec(path)[1]);
        const tetromino = TetrominoFactory.getInstance(this.nextTetrominoIndex);
        const vectors = tetromino.vectors;
        const width = vectors.reduce((prev, next) => prev >= next.x ? prev : next.x, vectors[0].x) + 1;
        const height = vectors.reduce((prev, next) => prev >= next.y ? prev : next.y, vectors[0].y) + 1;

        [...Configuration.NEXT_TETROMINO_ELEMENT.children].forEach(element => {
            Configuration.NEXT_TETROMINO_ELEMENT.removeChild(element);
        });

        const tileTable = []

        for (let y = 0; y < height; ++y) {
            const tileRow = document.createElement('div');
            tileRow.className = 'tile-row';

            for (let x = 0; x < width; ++x) {
                const tile = document.createElement('div');
                tile.className = vectors.some(vec => vec.x === x && vec.y == y) ? 'tile ' + eachClass[tetromino.color] : 'tile';
                tileRow.appendChild(tile);
            }

            Configuration.NEXT_TETROMINO_ELEMENT.appendChild(tileRow);

        }
    }
}
