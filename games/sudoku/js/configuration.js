import { Graphics } from './graphics.js';
import { Keyboard } from './enum.js';
export { Configuration };

class Configuration {
    static SCORE_ELEMENT = document.querySelector('.game-score');
    static START_BUTTON = document.querySelector('#start-button');
    static PAUSE_BUTTON = document.querySelector('#pause-button');
    static DIFFICULTY_BUTTON = document.querySelector('#difficulty-button');
    static CANVAS = document.querySelector('#canvas');
    static PAUSE_SCREEN = document.querySelector('#pause-screen');
    static CONGRATS_SCREEN = document.querySelector('#congrats-screen');
    static SCORE_TEXT = 'Timer: ';
    static GRAPHICS_INSTANCE = new Graphics(Configuration.CANVAS, Configuration.CANVAS.getContext('2d')); 
    static GAME_WIDTH = 9;
    static GAME_HEIGHT = 9;
    static TILE_SIZE = 70;
    static {
        Configuration.CANVAS.width = Configuration.GAME_WIDTH * Configuration.TILE_SIZE;
        Configuration.CANVAS.height = Configuration.GAME_HEIGHT * Configuration.TILE_SIZE;
    };
    static CONTROLS = {
        Digit1          : Keyboard.DIGIT_1,
        Digit2          : Keyboard.DIGIT_2,
        Digit3          : Keyboard.DIGIT_3,
        Digit4          : Keyboard.DIGIT_4,
        Digit5          : Keyboard.DIGIT_5,
        Digit6          : Keyboard.DIGIT_6,
        Digit7          : Keyboard.DIGIT_7,
        Digit8          : Keyboard.DIGIT_8,
        Digit9          : Keyboard.DIGIT_9,

        KeyA            : Keyboard.CHANGE_MODE

    };
    static COLORS = {
        PRIMARY_1       : '#ffffff',
        PRIMARY_2       : '#344861',
        ERROR           : '#f7cfd6',
        ERROR_TEXT      : '#e55c6c',
        SELECTED        : '#bbdefb',
    }

    static DIFFICULTIES_COLORS = {
        'easy'          : '#28c869',
        'medium'        : '#00ffff',
        'hard'          : '#0095ff', 
        'very-hard'     : '#ffff00',
        'insane'        : '#ff8c00',
        'inhuman'       : '#ff1e00'
    };
}