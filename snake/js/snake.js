class Snake {
    constructor(x, y) {
        this.brain = new PlayerControllerBrain(this);
        this.head = new Vector2(x, y);
        this.tail = [];
        this.startLength = 4;
        this.score = 0;
        this.vel = new Vector2(0, -1);
        this.keyPool = [];
        this.alive = true;

        this.init();
    }

    init() {
        const head =  this.head;
        const tail = this.tail;
        
        for (let i = 1; i < this.startLength; ++i) {
            tail.push(new Vector2(head.x, head.y + 1));
        }
    }

    update() {
        const keyPool = this.keyPool;
        const key = keyPool.length > 0 ? keyPool.shift() : null;
        const vel = this.vel;

        switch (key) {
            case 'KeyW':
            case 'ArrowUp':
                if (!(vel.x == 0 && vel.y == 1)) 
                    this.up();
                break;
            case 'KeyS':
            case 'ArrowDown':
                if (!(vel.x == 0 && vel.y == -1)) {
                    this.down();
                }
                break;
            case 'KeyA':
            case'ArrowLeft':
                if (!(vel.x == 1 && vel.y == 0)) {
                    this.left();
                }
                break;
            case 'KeyD':
            case 'ArrowRight':
                if (!(vel.x == -1 && vel.y == 0)) {
                    this.right();
                }
                break;
        }

        this.move();
    }

    move() {
        const head =  this.head;
        const tail = this.tail;
        const velocity = this.vel;

        for (let i = tail.length - 1; i > 0; --i) {
            tail[i].x = tail[i - 1].x;
            tail[i].y = tail[i - 1].y;
        }

        tail[0].x = head.x;
        tail[0].y = head.y;

        head.x += velocity.x;
        head.y += velocity.y;
    }

    intersects(pos) {
        const tail = this.tail;

        return tail.some(block => block.x == pos.x && block.y == pos.y);
    }

    up() { this.vel = new Vector2(0, -1); }
    
    down() { this.vel = new Vector2(0, 1); }
    
    left() { this.vel = new Vector2(-1, 0); }
    
    right() { this.vel = new Vector2(1, 0); }

    isAlive() { return this.alive; }
}