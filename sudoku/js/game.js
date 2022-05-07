import { Configuration } from './configuration.js';
import { Utilities } from './util.js';
import { MouseController, KeyboardController } from './controller.js';
import { Mouse, Keyboard, Mode } from './enum.js';
import { Sudoku } from './sudoku.js';
export { Game };

class Game {
    constructor() {
        this.G = Configuration.GRAPHICS_INSTANCE;
        this.width = Configuration.GAME_WIDTH;
        this.height = Configuration.GAME_HEIGHT;
        this.tileSize = Configuration.TILE_SIZE;

        this.mouseController = new MouseController(this);
        this.keyboardController = new KeyboardController(this);

        this.startGame();
    }

    // starts game and reset every game state to initial
    startGame() {
        this.accumulatedTime = 0;

        this.finished = false;
        this.paused = false;

        const generatedSudoku = Sudoku.generate(this.difficulty);
        this.complitedSudoku = Sudoku.solve(generatedSudoku);

        Sudoku.print_board(generatedSudoku);
        Sudoku.print_board(this.complitedSudoku);

        this.cells = new Array(this.width*this.height);
        for (let i = 0; i < this.cells.length; ++i) {
            this.cells[i] = new Cell(parseInt(this.complitedSudoku[i]));
            if (generatedSudoku[i] !== '.') {
                const number = parseInt(generatedSudoku[i]);

                this.cells[i].choose(number);
                this.cells[i].setBlocked(true);
            }
        }

        this.selected = null;
        this.mode = Mode.CHOOSE;

        this.score = 0;

        this.won = false;
    }

    // game step
    update(delta) {
        this.accumulatedTime += delta;

        const cells = this.cells;
        const mouseController = this.mouseController;
        const mouseMove = mouseController.step();
        const selectedCell = this.selected;

        if (mouseMove !== null) {

            if (this.selected !== null && mouseMove.x === this.selected.x && mouseMove.y === this.selected.y) {
                this.selected = null;
            }
            else {
                this.selected = mouseMove;
            }

            if (cells[mouseMove.y*this.width+mouseMove.x].isBlocked()) {
                this.selected = null;
            }
        }

        const keyboardController = this.keyboardController;
        const keyboardMove = keyboardController.step();

        if (keyboardMove !== null) {
            if (this.selected !== null) {
                // const number = Configuration.CONTROLS[keyboardMove] + 1;

                // this.cells[selectedCell.y*this.width+selectedCell.x].invert(number);

                const key = Configuration.CONTROLS[keyboardMove];
                const number = key;

                switch (key) {
                    case Keyboard.CHANGE_MODE: {
                        this.mode = +!this.mode;
                    }
                    break;
                    case Keyboard.DIGIT_1:
                    case Keyboard.DIGIT_2:
                    case Keyboard.DIGIT_3:
                    case Keyboard.DIGIT_4:
                    case Keyboard.DIGIT_5:
                    case Keyboard.DIGIT_6:
                    case Keyboard.DIGIT_7:
                    case Keyboard.DIGIT_8:
                    case Keyboard.DIGIT_9: {
                        if (this.mode === Mode.PERMIT) {
                            this.cells[this.selected.y*this.width+this.selected.x].invert(number);
                        }
                        else {
                            this.cells[this.selected.y*this.width+this.selected.x].choose(number);
                        }
                    }
                    break;
                    default:
                }
            }

            if (this.isComplited() && this.isComplitedRight()) {
                this.finished = true;
                this.won = true;
                this.updateCongratsScreen();
            }
        }

        if (this.accumulatedTime >= this.tickTime()) {
            this.step();
        }
    }
    
    step() {
        this.accumulatedTime = 0;

        this.score += 1;
        this.updateScoreElement();
    }

    updatePauseScreen() {
        Configuration.PAUSE_SCREEN.style = `visibility: ${this.isPaused() ? 'visible' : 'hidden'};`;
    }

    // updates `SCORE_ELEMENT`
    updateScoreElement() {
        Configuration.SCORE_ELEMENT.innerHTML = Configuration.SCORE_TEXT + this.score;
    }

    // updates `GAMEOVER_SCREEN`
    updateCongratsScreen() {
        Configuration.CONGRATS_SCREEN.style = `visibility: ${this.isWon() ? 'visible' : 'hidden'};`;
    }

    validate(x, y) {
        const width = this.width;
        const height = this.height;
        const cells = this.cells;

        function validateCol(index) {
            const items = cells.slice(index*width, index*width + width).map(item => item.chosenNumber);
            
            for (let i = 0; i < items.length - 1; ++i) {
                const item = items[i];
                if (item === null) {
                    continue;
                }
    
                for (let j = i + 1; j < items.length; ++j) {
                    if (item === items[j]) {
                        return false;
                    }
                }
            }
    
            return true;
        }
    
        function validateRow(index) {
            const items = Utilities.range(height).map(i => cells[i*width + index].chosenNumber);
    
            for (let i = 0; i < items.length - 1; ++i) {
                const item = items[i];
                if (item === null) {
                    continue;
                }
    
                for (let j = i + 1; j < items.length; ++j) {
                    if (item === items[j]) {
                        return false;
                    }
                }
            }
    
            return true;
        }

        return validateRow(x) && validateCol(y);
    }



    drawCell(x, y) {
        const G = this.G;
        const cell = this.cells[y*this.width+x];

        G.strokeWeight(1);

        const cellColor = this.selected !== null && this.selected.x === x && this.selected.y === y ? 
        Configuration.COLORS.SELECTED : (this.validate(x, y) ? Configuration.COLORS.PRIMARY_1 : Configuration.COLORS.ERROR);

        G.rect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize, cellColor, Configuration.COLORS.PRIMARY_2);

        G.textBaseline('middle');
        G.textAlign('center');

        const margin = this.tileSize / 4;
        const gapX = this.tileSize / 4 / 2;
        const gapY = this.tileSize / 4 / 4;
        const fontSize = Math.ceil(this.tileSize / 5.5);
        
        G.font('Roboto', fontSize);
        const textMeasures = G.measureText('0');
        const width = textMeasures.width;
        const height = textMeasures.fontBoundingBoxAscent + textMeasures.fontBoundingBoxDescent

        G.push();
        
        G.strokeWeight(2);

        if (Object.values(cell.possibleNumbers).some(item => item === true)) {
            G.translate(margin, margin);
            
            const [w, h] = [3, 3];

            for (let j = 0; j < w; ++j) {
                for (let i = 0; i < h; ++i) {
                    const number = j*w+i + 1;
                    if (cell.is(number)) {
                        const text = number;
                        G.font('Roboto', fontSize);
                        G.text(text, x*this.tileSize, y*this.tileSize, Configuration.COLORS.PRIMARY_2);
                    }
                    
                    G.translate(width + gapX, 0);
                }
                G.translate(-w*(width + gapX), height + gapY);
            }
        } 
        else {
            G.translate(this.tileSize / 2, this.tileSize / 2);

            G.font('Roboto', Math.ceil(this.tileSize / 3));
            G.text(cell.chosenNumber === null ? '' : cell.chosenNumber, x*this.tileSize, y*this.tileSize, Configuration.COLORS.PRIMARY_2);
        } 

        G.pop();
    }

    // draws each element on the screen
    draw() {
        const G = this.G;

        // draw backgound
        G.background('#ffffff');

        const cells = this.cells;

        cells.forEach((value, index) => {
            const x = index % this.width;
            const y = Math.trunc(index / this.width);

            this.drawCell(x, y);

            G.strokeWeight(3);

            if (x % 3 === 0 ) {
                G.line(x*this.tileSize, 0, x*this.tileSize, this.width*this.tileSize, Configuration.COLORS.PRIMARY_2);
            }

            if (y % 3 === 0 ) {
                G.line(0, y*this.tileSize, this.height*this.tileSize, y*this.tileSize, Configuration.COLORS.PRIMARY_2);
            }
        });     
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    isComplitedRight() {
        return this.cells.map(cell => cell.chosenNumber !== null ? cell.chosenNumber : '.').join('').valueOf() === this.complitedSudoku.valueOf();
    }

    isComplited() {
        return !this.cells.some(cell => cell.chosenNumber === null);
    }

    isWon() {
        return this.won;
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
        return 1000;
    }
}

class Cell {
    constructor(number) {
        this.number = number;
        this.chosenNumber = null;
        this.possibleNumbers = {
            1 : false,
            2 : false,
            3 : false,
            4 : false,
            5 : false,
            6 : false,
            7 : false,
            8 : false,
            9 : false
        };
        this.blocked = false;
    }

    canBe(number) {
        if (this.chosenNumber !== null) {
            this.chosenNumber = null;
        }

        this.possibleNumbers[number] = true;
    }

    canNotBe(number) {
        if (this.chosenNumber !== null) {
            this.chosenNumber = null;
        }

        this.possibleNumbers[number] = false;
    }

    invert(number) {
        if (this.chosenNumber !== null) {
            this.chosenNumber = null;
        }

        this.possibleNumbers[number] = !this.possibleNumbers[number];
    }
    
    is(number) {
        return this.possibleNumbers[number];
    }

    choose(number) {
        Object.keys(this.possibleNumbers).forEach(key => this.possibleNumbers[key] = false);

        this.chosenNumber = number;
    }

    setBlocked(blocked) {
        this.blocked = blocked;
    }

    isBlocked() {
        return this.blocked;
    }
}