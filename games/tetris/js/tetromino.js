import { Configuration } from './configuration.js';
import { Utilities } from "./util.js";
import { Matrix } from './matrix.js';
import { Vector2 } from './vector.js';
import { Tetrominos, Tiles } from './enum.js';
export { Tetromino, TetrominoFactory, Tile };

/*

GRIDS

o —  —  —  —        
| *  *  *  * |      o —  —  —  
| *  *  *  * |      | *  *  * |
| *  *  *  * |  OR  | *  *  * |
| *  *  *  * |      | *  *  * |
  —  —  —  —          —  —  — 

TETROMINOES

o —  —  —  —                                                                                                        
| *  *  *  * |      o —  —  —        o —  —  —        o —  —  —        o —  —  —        o —  —  —        o —  —  —  
| O  O  O  O |      | O  *  * |      | *  *  O |      | O  O  * |      | *  O  O |      | *  O  * |      | O  O  * |
| *  *  *  * |      | O  O  O |      | O  O  O |      | O  O  * |      | O  O  * |      | O  O  O |      | *  O  O |
| *  *  *  * |      | *  *  * |      | *  *  * |      | *  *  * |      | *  *  * |      | *  *  * |      | *  *  * |
  —  —  —  —          —  —  —          —  —  —          —  —  —          —  —  —          —  —  —          —  —  —  
      I                  J                L                O                S                T                Z

*/

const ROTATION_MATRIX = new Matrix([[0, -1], [1, 0]]);

class Tetromino {
    constructor(vectors, center, color) {
        this.vectors = vectors;
        this.center = center;
        this.color = color;

        this.position = new Vector2(5, 0);
    }

    rotate() {
        return this.vectors.map(vec => {
            const vector = vec;
            const center = this.center;
            const result = ROTATION_MATRIX.multiply(vector.subtract(center)).add(center);

            return result.toVector();
        });
    }
}


class TetrominoFactory {
    
    static TETROMINOS = [
        () => new Tetromino([new Vector2(0, 1), new Vector2(1, 1), new Vector2(2, 1), new Vector2(3, 1)], new Vector2(1.5, 1.5), Tiles.CYAN),
        () => new Tetromino([new Vector2(0, 0), new Vector2(0, 1), new Vector2(1, 1), new Vector2(2, 1)], new Vector2(1.0, 1.0), Tiles.BLUE),
        () => new Tetromino([new Vector2(2, 0), new Vector2(0, 1), new Vector2(1, 1), new Vector2(2, 1)], new Vector2(1.0, 1.0), Tiles.ORANGE),
        () => new Tetromino([new Vector2(0, 0), new Vector2(0, 1), new Vector2(1, 0), new Vector2(1, 1)], new Vector2(0.5, 0.5), Tiles.YELLOW),
        () => new Tetromino([new Vector2(1, 0), new Vector2(2, 0), new Vector2(0, 1), new Vector2(1, 1)], new Vector2(1.0, 1.0), Tiles.GREEN),
        () => new Tetromino([new Vector2(1, 0), new Vector2(0, 1), new Vector2(1, 1), new Vector2(2, 1)], new Vector2(1.0, 1.0), Tiles.MAGENTA),
        () => new Tetromino([new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(2, 1)], new Vector2(1.0, 1.0), Tiles.RED)
    ];

    static getInstance(type) {
        return this.TETROMINOS[type]();
    }

    static getRandomInstance() {
        const tetrominoesCount = Object.keys(Tetrominos).length;
        const type = Utilities.getRandomInt(0, tetrominoesCount);
        
        return this.TETROMINOS[type]();
    }
}


class Tile {
    static load() {
        const tilePaths = Configuration.TILE_PATHS;
        this.tiles = tilePaths.map(path => {
            const width = Configuration.GAME_WIDTH;
            const height = Configuration.GAME_HEIGHT;
            const img = new Image(width, height);
            img.src = path;
            return img;
        });
    }

    static getInstance(type) {
        if (this.tiles === undefined) {
            this.load();
        }
        return this.tiles[type];
    }
}