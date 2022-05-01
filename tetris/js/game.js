import { Configuration } from './configuration.js';

import { Utilities } from './util.js';
import { Vector2 } from './vector.js';
import { PlayerController } from './controller.js';
import { Tetrominos, Tiles, Keys } from './enum.js';
import { TetrominoFactory, Tile } from './tetromino.js';
export { Game };

class Game {
    constructor() {
        this.G = Configuration.GRAPHICS_INSTANCE;
        this.width = Configuration.GAME_WIDTH;
        this.height = Configuration.GAME_HEIGHT;
        this.tileSize = Configuration.TILE_SIZE;

        this.controller = new PlayerController(this);

        this.startGame();
    }

    // starts game and reset every game state to initial
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

        this.tetromino = TetrominoFactory.getRandomInstance();
        
        const tetrominosLength = Object.keys(Tetrominos).length;
        this.nextTetrominoIndex = Utilities.getRandomInt(0, tetrominosLength);
        this.nextTetromino();

        this.score = 0;
    }

    // game step
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
            this.tetrominoStep();
        }
    }

    // tetromino step
    tetrominoStep() {
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
            
            // increment score
            if (this.lines.length > 0) {
                this.score += (1 << this.lines.length) * 100;

                this.updateScoreElement();
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
            this.nextTetrominoIndex = Utilities.getRandomInt(0, tetrominosLength);
            this.finished = !this.isTetrominoFit(this.tetromino.position, this.tetromino.vectors);
            this.nextTetromino();
            this.updateGameoverScreen();
        }
    }

    // updates `SCORE_ELEMENT`
    updateScoreElement() {
        Configuration.SCORE_ELEMENT.innerHTML = Configuration.SCORE_TEXT + this.score;
    }

    // updates `GAMEOVER_SCREEN`
    updateGameoverScreen() {
        Configuration.GAMEOVER_SCREEN.style = `visibility: ${this.isFinished() ? 'visible' : 'hidden'};`;
    }

    // draws each element on the screen
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

    // checks if tetromino fit in `position` when it has current `vectors`
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

    // `paused` getter
    isPaused() {
        return this.paused;
    }

    // `finished` getter
    isFinished() {
        return this.finished;
    }

    // game tick
    tickTime() {
        return 1000 / 5;
    }

    // changes tetromino in `NEXT_TETROMINO_ELEMENT`
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
