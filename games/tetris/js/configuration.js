import { Graphics } from './graphics.js';
import { Keys } from './enum.js';
export { Configuration };

class Configuration {
    static SCORE_ELEMENT = document.querySelector('.game-score');
    static START_BUTTON = document.querySelector('#start-button');
    static PAUSE_BUTTON = document.querySelector('#pause-button');
    static NEXT_TETROMINO_ELEMENT = document.querySelector('#next-tetromino .tetromino');
    static CANVAS = document.querySelector('#canvas');
    static GAMEOVER_SCREEN = document.querySelector('#gameover-screen');
    static SCORE_TEXT = 'Score: ';
    static GRAPHICS_INSTANCE = new Graphics(Configuration.CANVAS, Configuration.CANVAS.getContext('2d')); 
    static GAME_WIDTH = 12;
    static GAME_HEIGHT = 21;
    static TILE_SIZE = 35;
    static {
        Configuration.CANVAS.width = Configuration.GAME_WIDTH * Configuration.TILE_SIZE;
        Configuration.CANVAS.height = Configuration.GAME_HEIGHT * Configuration.TILE_SIZE;
    }
    static TILE_PATHS = [
        './img/cyan-tile.png',
        './img/blue-tile.png',
        './img/orange-tile.png',
        './img/yellow-tile.png',
        './img/green-tile.png',
        './img/magenta-tile.png',
        './img/red-tile.png',
        './img/gray-tile.png'
    ];
    static NO_TILE = null;
    static CONTROLS = {
        KeyA        : Keys.LEFT,
        KeyD        : Keys.RIGHT,
        KeyW        : Keys.UP,
        KeyS        : Keys.DOWN,

        ArrowLeft   : Keys.LEFT,
        ArrowRight  : Keys.RIGHT,
        ArrowUp     : Keys.UP,
        ArrowDown   : Keys.DOWN
    };
}