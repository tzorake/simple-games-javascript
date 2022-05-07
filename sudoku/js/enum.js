export { Mouse, Keyboard, Mode };

let iota = 0;
const Mouse = {};
Mouse.LEFT = iota++;
Mouse.MIDDLE = iota++;
Mouse.RIGHT = iota++;

const Keyboard = {};
iota = 0;
Keyboard.CHANGE_MODE = iota++;
Keyboard.DIGIT_1 = iota++;
Keyboard.DIGIT_2 = iota++;
Keyboard.DIGIT_3 = iota++;
Keyboard.DIGIT_4 = iota++;
Keyboard.DIGIT_5 = iota++;
Keyboard.DIGIT_6 = iota++;
Keyboard.DIGIT_7 = iota++;
Keyboard.DIGIT_8 = iota++;
Keyboard.DIGIT_9 = iota++;

const Mode = {};
iota = 0;
Mode.CHOOSE = iota++;
Mode.PERMIT = iota++;