export { Tiles, Mouse };

let iota = 0;
const Tiles = {};
Tiles.UNEXPOSED_CELL = iota++;
Tiles.EMPTY_CELL = iota++;
Tiles.CELL_1 = iota++;
Tiles.CELL_2 = iota++;
Tiles.CELL_3 = iota++;
Tiles.CELL_4 = iota++;
Tiles.CELL_5 = iota++;
Tiles.CELL_6 = iota++;
Tiles.CELL_7 = iota++;
Tiles.CELL_8 = iota++;
Tiles.FLAGGED_MINE = iota++;
Tiles.LIKELY_MINE = iota++;
Tiles.RED_MINE = iota++;
Tiles.MINE = iota++;
Tiles.BLAST_CELL = iota++;
Tiles.MISFLAGGED_MINE = iota++;

// './img/cell-unexposed.png',
// './img/cell-empty.png',
// './img/cell-1.png',
// './img/cell-2.png',
// './img/cell-3.png',
// './img/cell-4.png',
// './img/cell-5.png',
// './img/cell-6.png',
// './img/cell-7.png',
// './img/cell-8.png',
// './img/MINE-flagged.png',
// './img/MINE-question.png',

// './img/MINE-death.png',
// './img/MINE-revealed.png',

// './img/cell-blast.png',
// './img/MINE-misflagged.png'


iota = 0;
const Mouse = {};
Mouse.LEFT = iota++;
Mouse.MIDDLE = iota++;
Mouse.RIGHT = iota++;