export { Tetrominos, Tiles, Keys };

let iota = 0;
const Tetrominos = {};
Tetrominos.I = iota++;
Tetrominos.J = iota++;
Tetrominos.L = iota++;
Tetrominos.O = iota++;
Tetrominos.S = iota++;
Tetrominos.T = iota++;
Tetrominos.Z = iota++;

iota = 0;
const Tiles = {};
Tiles.CYAN = iota++;
Tiles.BLUE = iota++;
Tiles.ORANGE = iota++;
Tiles.YELLOW = iota++;
Tiles.GREEN = iota++;
Tiles.MAGENTA = iota++;
Tiles.RED = iota++;
Tiles.GRAY = iota++;

iota = 0;
const Keys = {};
Keys.LEFT = iota++;
Keys.RIGHT = iota++;
Keys.UP = iota++;
Keys.DOWN = iota++;