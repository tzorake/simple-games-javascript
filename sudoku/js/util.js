export { Utilities };

class Utilities {
    static range(count) {
        return Object.keys(new Array(count).fill(0)).map((value) => parseInt(value));
    }
    
    static mod(a, n) {
        return ((a % n ) + n ) % n;
    }
    
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    static clamp(num, min, max) {
        return Math.min(Math.max(num, min), max)
    }
    
}






