import { Configuration } from './configuration.js';
import { Utilities } from './util.js';
import { Vector2 } from './vector.js';
import { Keys, Tiles } from './enum.js';
import { PlayerController } from './controller.js';
import { Snake } from './snake.js';
import { Tile } from './tile.js';

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
        this.finished = false;
        this.paused = false;

        this.snake = new Snake(Math.trunc(this.width / 2), Math.trunc(this.height / 2));
        this.food = this.newFood();
        this.score = 0;

        this.updateScoreElement();

        this.accumulatedTime = 0;
    }

    update(delta) {
        const snake = this.snake;

        this.accumulatedTime += delta;
        
        if (this.accumulatedTime >= this.tickTime()) {
            const key = this.controller.step();

            if (key !== null && key in Configuration.CONTROLS) {
                switch (Configuration.CONTROLS[key]) {
                    case Keys.LEFT:
                        if (snake.vel !== Vector2.RIGHT) {
                            snake.vel = Vector2.LEFT;
                        }
                    break;
                    case Keys.RIGHT:
                        if (snake.vel !== Vector2.LEFT) {
                            snake.vel = Vector2.RIGHT;
                        }
                    break;
                    case Keys.UP:
                        if (snake.vel !== Vector2.DOWN) {
                            snake.vel = Vector2.UP;
                        }
                    break;
                    case Keys.DOWN:
                        if (snake.vel !== Vector2.UP) {
                            snake.vel = Vector2.DOWN;
                        }
                    break;
                    default:
                }
            }

            this.snakeStep();
        }

        if (!this.isSnakeAlive()) {
            this.finished = true;
            this.updateGameoverScreen();
        }
    }

    snakeStep() {
        const snake = this.snake;
        const food = this.food;

        snake.step();

        snake.head = new Vector2(Utilities.mod(snake.head.x, this.width), Utilities.mod(snake.head.y, this.height));

        if (snake.intersects(snake.head)) {
            snake.alive = false;
        }

        if (snake.head.x == food.x && snake.head.y == food.y) {
            this.food = this.newFood();
            
            const newBlock = new Vector2(snake.head.x, snake.head.y);
            snake.tail.push(newBlock);
            
            this.score += 1;

            this.updateScoreElement();
        }

        this.accumulatedTime = 0;
    }

    newFood() {
        let randomX = Utilities.getRandomInt(0, this.width);
        let randomY = Utilities.getRandomInt(0, this.height);
        let food = new Vector2(randomX, randomY);

        while (this.snake.intersects(food)) {
            randomX = Utilities.getRandomInt(0, this.width);
            randomY = Utilities.getRandomInt(0, this.height);
            food = new Vector2(randomX, randomY);
        }

        return food;
    }


    draw() {
        this.clearBackground();
        this.drawFood();
        this.drawSnake();
    }

    clearBackground() {
        this.G.background('#1e1e28');
    }

    drawFood() {
        const G = this.G;

        const food = this.food;
        
        G.image(Tile.getInstance(Tiles.APPLE), food.x*this.tileSize, food.y*this.tileSize, this.tileSize, this.tileSize);
    }

    drawSnake() {
        const G = this.G;

        const snake = this.snake;
        const snakeHead = snake.head;
        const snakeTail = snake.tail;

        let [x, y, w, h] = [snakeHead.x*this.tileSize, snakeHead.y*this.tileSize, this.tileSize, this.tileSize];

        const vel = snake.vel;
        const sides = Utilities.rectToSides(x, y, w, h);
  
        const direction = Vector2.DIRECTION.indexOf(snake.vel);
        const a = this.accumulatedTime / this.tickTime();
        const oppositeDirection = (direction + 2) % 4;
        
        const d = sides[direction] - sides[oppositeDirection];
        sides[direction] += Utilities.lerp(0, d, a);
        sides[oppositeDirection] += Utilities.lerp(0, d, a);
        
        [x, y, w, h] = Utilities.sidesToRect(...sides);
        [x, y] = [x - vel.x*this.tileSize, y - vel.y*this.tileSize];

        G.rect(x, y, w, h, '#23c864');

        snakeTail.forEach((block, index, blocks) => {
            if (index !== snakeTail.length - 1) {
                G.rect(block.x*this.tileSize, block.y*this.tileSize, this.tileSize, this.tileSize, '#23c864')
            } else {
                let [x, y, w, h] = [block.x*this.tileSize, block.y*this.tileSize, this.tileSize, this.tileSize];

                const vel = new Vector2(blocks[index - 1].x - block.x, 
                    blocks[index - 1].y - block.y);
                const sides = Utilities.rectToSides(x, y, w, h);
          
                const direction = Vector2.DIRECTION.findIndex(vec => vec.x === vel.x && vec.y === vel.y);
                const oppositeDirection = (direction + 2) % 4;

                
                const d = sides[direction] - sides[oppositeDirection];
                sides[direction] += Utilities.lerp(0, d, a);
                sides[oppositeDirection] += Utilities.lerp(0, d, a);
                
                [x, y, w, h] = Utilities.sidesToRect(...sides);
        
                G.rect(x, y, w, h, '#23c864');
            }
        });
    }

    updatePauseScreen() {
        Configuration.PAUSE_SCREEN.style = `visibility: ${this.isPaused() ? 'visible' : 'hidden'};`;
    }

    updateGameoverScreen() {
        Configuration.GAMEOVER_SCREEN.style = `visibility: ${this.isFinished() ? 'visible' : 'hidden'};`;
    }

    updateScoreElement() {
        Configuration.SCORE_ELEMENT.innerHTML = Configuration.SCORE_TEXT + this.score;
    }

    isSnakeAlive() {
        return this.snake.isAlive();
    }

    isPaused() {
        return this.paused;
    }

    isFinished() {
        return this.finished;
    }

    tickTime() {
        const snake = this.snake;
        const snakeTail = snake.tail;
        const start = 125;
        const end = 75;
        return start + snakeTail.length * (end - start) / Math.max(this.width, this.height);
    }

}