import { Graphics } from './graphics.js';
import { Mouse } from './enum.js';
export { Configuration };

class Configuration {
    static CANVAS = document.querySelector('#canvas');
    static PAUSE_SCREEN = document.querySelector('#pause-screen');
    static GAMEOVER_SCREEN = document.querySelector('#gameover-screen');
    static CONGRATS_SCREEN = document.querySelector('#congrats-screen');
    static SCORE_ELEMENT = document.querySelector('.game-score');
    static MINES_ELEMENT = document.querySelector('.mines-score');
    static START_BUTTON = document.querySelector('#start-button');
    static PAUSE_BUTTON = document.querySelector('#pause-button');
    static SCORE_TEXT = 'Timer: ';
    static MINES_TEXT = 'Mines: ';
    static GRAPHICS_INSTANCE = new Graphics(Configuration.CANVAS, Configuration.CANVAS.getContext('2d')); 
    static GAME_WIDTH = 21;
    static GAME_HEIGHT = 14;
    static TILE_SIZE = 35;
    static MINES = 20;
    static {
        Configuration.CANVAS.width = Configuration.GAME_WIDTH * Configuration.TILE_SIZE;
        Configuration.CANVAS.height = Configuration.GAME_HEIGHT * Configuration.TILE_SIZE;
    }
    static TILE_PATHS = [
        './img/cell-unexposed.png',
        './img/cell-empty.png',
        './img/cell-1.png',
        './img/cell-2.png',
        './img/cell-3.png',
        './img/cell-4.png',
        './img/cell-5.png',
        './img/cell-6.png',
        './img/cell-7.png',
        './img/cell-8.png',
        './img/mine-flagged.png',
        './img/mine-question.png',
        './img/mine-death.png',
        './img/mine-revealed.png',
        './img/cell-blast.png',
        './img/mine-misflagged.png'
    ];
}