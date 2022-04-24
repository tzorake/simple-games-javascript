const Utilities =  {};

Utilities.getRandomInt = getRandomInt;
Utilities.reminder = reminder

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function reminder(a, n) {
    return ((a % n ) + n ) % n;
}