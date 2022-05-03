import { Configuration } from './configuration.js';
import { Utilities } from './util.js';
import { Mouse, Tiles } from './enum.js';
import { Tile } from './tile.js';
import { PlayerController } from './controller.js';
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

    startGame() {
        this.paused = false;
        this.finished = false;
        this.firstClicked = false;
        this.won = false;
        this.firstClickTime = null;

        this.cells = new Array(this.width*this.height);
        this.view = new Array(this.width*this.height);

        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                this.cells[y*this.width + x] = new Cell();
            }
        }

        const mines = Configuration.MINES;
        const size = this.width*this.height;
        const mineStep = Math.trunc(size / mines);
        for (let i = mineStep; i <= size; i += mineStep) {
            const randomMineStep = Utilities.getRandomInt(0, mineStep);
            
            try {
                this.cells[i - randomMineStep].mine();
            } catch (error) {
                this.startGame();
            }

        }

        this.score = 0;

        this.updateScoreElement();
        this.updateMinesElement();
        this.updateCongratsScreen();
    }

    step() {
        const move = this.controller.step();
        const preset = [this.reveal, this.question, this.flag];

        if (move !== null) {
            const [x, y, button] = move.toArray();
            const selectedFunction = preset[button].bind(this);

            selectedFunction(x, y);

            if (this.firstClickTime === null) {
                this.firstClickTime = Date.now() / 1000;
                this.firstClicked = true;
            }

            const minedAndFlaged = this.cells.reduce((prev, curr) => prev + (!curr.isRevealed() && curr.isMined() && curr.isFlagged() && !curr.isQuestionable() ? 1 : 0), 0);
            const unexposed = this.cells.reduce((prev, curr) => prev + (!curr.isRevealed() ? 1 : 0), 0);

            if (unexposed - minedAndFlaged === 0 && !this.isWon()) {
                this.win();
            }

            if (this.cells[y*this.width+x].isMined() && this.cells[y*this.width+x].isRevealed()) {
                this.gameover();
            }

            this.updateMinesElement();
        }
        
        if (this.isFirstClickDone()) {
            const newScore = Date.now() / 1000;
            this.score = Math.trunc(newScore - this.firstClickTime);
        }

        this.updateScoreElement();
        
    }

    win() {
        this.won = true;
        this.finished = true;
        this.updateCongratsScreen();
    }

    gameover() {
        this.finished = true;
        this.updateGameoverScreen();
    }

    countMines() {
        return this.cells.reduce((prev, curr) => {
            return prev + (curr.isFlagged() ? 1 : 0 )
        }, 0);
    }

    updateScoreElement() {
        Configuration.SCORE_ELEMENT.innerHTML = Configuration.SCORE_TEXT + this.score;
    }

    updateMinesElement() {
        const mines = Configuration.MINES - this.countMines()
        Configuration.MINES_ELEMENT.innerHTML = Configuration.MINES_TEXT + (mines > 0 ? mines : 0);
    }

    updatePauseScreen() {
        Configuration.PAUSE_SCREEN.style = `visibility: ${this.isPaused() ? 'visible' : 'hidden'};`;
    }

    updateGameoverScreen() {
        Configuration.GAMEOVER_SCREEN.style = `visibility: ${this.isFinished() && !this.isWon() ? 'visible' : 'hidden'};`;
    }

    updateCongratsScreen() {
        Configuration.CONGRATS_SCREEN.style = `visibility: ${this.isWon() ? 'visible' : 'hidden'};`;
    }

    reveal(x, y) {
        const cell = this.cells[y*this.width+x];

        cell.reveal();
        
        const minesAround = this.countMinesAround(x, y);
        if (minesAround === 0) {
            this.flood(x, y);
        }
    }

    flood(x, y) {
        for (let yi = -1; yi < 2; ++yi) {
            for (let xi = -1; xi < 2; ++xi) {
                if (x + xi >= 0 && x + xi < this.width && y + yi >= 0 && y + yi < this.height &&
                    !this.cells[(y + yi)*this.width+(x + xi)].isMined() && 
                    !this.cells[(y + yi)*this.width+(x + xi)].isRevealed()) {
                    this.reveal(x + xi, y + yi);
                }
            }
        }
    }

    countMinesAround(x, y) {
        let counter = 0;
        for (let yi = -1; yi < 2; ++yi) {
            for (let xi = -1; xi < 2; ++xi) {
                if (x + xi >= 0 && x + xi < this.width && y + yi >= 0 && y + yi < this.height) {
                    counter += this.cells[(y + yi)*this.width+(x + xi)].isMined() ? 1 : 0;
                }
            }
        }
        return counter;
    }

    question(x, y) {
        this.cells[y*this.width+x].question();
    }

    flag(x, y) {
        this.cells[y*this.width+x].flag();
    }

    draw() {
        const G = this.G;
        
        this.cells.forEach((cell, index) => {
            const x = index % this.width;
            const y = Math.trunc(index / this.width);

            G.image(this.getTile(x, y), x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize);
        });
    }

    getTile(x, y) {
        const cells = this.cells;
        const cell = cells[y*this.width+x];
        const minesAround = this.countMinesAround(x, y);

        // const possibleTiles = {
        //     '1100' : Tiles.RED_MINE,
        //     '1000' : Tiles.EMPTY_CELL + minesAround,
        //     '0001' : Tiles.LIKELY_MINE,
        //     '0010' : Tiles.FLAGGED_MINE,
        //     '0000' : Tiles.UNEXPOSED_CELL,
        //     '0101' : Tiles.LIKELY_MINE,
        //     '0110' : Tiles.FLAGGED_MINE,
        //     '0100' : Tiles.UNEXPOSED_CELL
        // }

        // const key = ((cell.isQuestionable() << 0) | (cell.isFlagged() << 1) | (cell.isMined() << 2) | (cell.isRevealed() << 3)).toString(2).padStart(4, '0');
        // const tile = possibleTiles[key];

        const tile =  cell.isRevealed() ?
            (cell.isMined() ? 
                Tiles.RED_MINE : 
                Tiles.EMPTY_CELL + minesAround) : 
            (cell.isFlagged() ? 
                Tiles.FLAGGED_MINE : 
                cell.isQuestionable() ? 
                    Tiles.LIKELY_MINE : 
                    Tiles.UNEXPOSED_CELL);

        return Tile.getInstance(tile);
    }

    isFirstClickDone() {
        return this.firstClicked;
    }

    isPaused() {
        return this.paused;
    }

    isFinished() {
        return this.finished;
    }

    isWon() {
        return this.won;
    }
}

class Cell {
    constructor() {
        this.revealed = false;
        this.mined = false;
        this.flagged = false;
        this.questionable = false;
    }

    reveal() {
        if (!this.isFlagged() && !this.isQuestionable()) {
            this.revealed = true;
        }
    }

    mine() {
        this.mined = true;
    }

    flag() {
        if (!this.isRevealed()) {
            this.questionable = false;
            this.flagged = !this.flagged;
        }    
    }

    question() {
        if (!this.isRevealed()) {
            this.flagged = false;
            this.questionable = !this.questionable;
        }
    }

    isRevealed() {
        return this.revealed;
    }

    isMined() {
        return this.mined;
    }

    isFlagged() {
        return this.flagged;
    }

    isQuestionable() {
        return this.questionable;
    }
}