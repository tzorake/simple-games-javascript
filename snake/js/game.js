class Game {
    constructor(canvasWidth, canvasHeight, cellSize) {
        this.width = Math.trunc(canvasWidth / cellSize);
        this.height = Math.trunc(canvasHeight / cellSize);
        this.cellSize = cellSize;
        this.finished = false;
        this.paused = false;

        this.init();
    }

    init() {
        this.snake = new Snake(Math.trunc(this.width / 2), Math.trunc(this.height / 2));
        this.snakeObserver = new Observer(this.snake);

        const randomX = Utilities.getRandomInt(0, this.width);
        const randomY = Utilities.getRandomInt(0, this.height);
        this.food = new Vector2(randomX, randomY);
    }

    update() {
        const snake = this.snake;
        const snakeHead = snake.head;
        const snakeTail = snake.tail;
        const food = this.food;

        const snakeObserver =  this.snakeObserver;

        if (!this.isPaused() && !this.isFinished()) {
            snake.update();

            snakeHead.x = Utilities.reminder(snakeHead.x, this.width);
            snakeHead.y = Utilities.reminder(snakeHead.y, this.height);
    
            if (snake.intersects(snakeHead)) {
                snakeObserver.setState({key : 'alive', value : false}, (observable) => {});
            }
    
            if (snakeHead.x == food.x && snakeHead.y == food.y) {
                do {
                    const randomX = Utilities.getRandomInt(0, this.width);
                    const randomY = Utilities.getRandomInt(0, this.height);
                    food.x = randomX;
                    food.y = randomY;
                    let newBlock = new Vector2(snakeHead.x, snakeHead.y);
                    snakeTail.push(newBlock);
                } while (snake.intersects(food));
    
                snakeObserver.setState({key : 'score', value : snake.score + 1}, (observable) => {
                    const snake = observable;
                    const score = snake.score;
        
                    const scoreElement = document.querySelector('.game-score');
                    scoreElement.innerHTML = "Score: " + score;
                });
            }

            this.draw();
        }

    }

    draw() {
        this.clearBackground();
        this.drawFood();
        this.drawSnake();
    }

    clearBackground() {
        Graphics.background('#1e1e28');
    }

    drawFood() {
        const food = this.food;

        Graphics.circle(food.x*this.cellSize + Math.trunc(this.cellSize/2), food.y*this.cellSize + Math.trunc(this.cellSize/2), Math.trunc(this.cellSize/2), '#f04b55')
    }

    drawSnake() {
        const snake = this.snake;
        const snakeHead = snake.head;
        const snakeTail = snake.tail;

        Graphics.rect(snakeHead.x*this.cellSize, snakeHead.y*this.cellSize, (snakeHead.x + 1)*this.cellSize, (snakeHead.y + 1)*this.cellSize, '#23c864');
        snakeTail.forEach(block => Graphics.rect(block.x*this.cellSize, block.y*this.cellSize, (block.x + 1)*this.cellSize, (block.y + 1)*this.cellSize, '#23c864'));
    }

    isPaused() {
        return this.paused;
    }

    isSnakeAlive() {
        const snakeObserver =  this.snakeObserver;
        return snakeObserver.getState({key : 'alive'});
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