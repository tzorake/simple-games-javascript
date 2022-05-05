export { Utilities };

class Utilities {
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
    }

    static mod(a, n) {
        return ((a % n ) + n ) % n;
    }

    static lerp(a, b, t) {
        return (b - a)*t + a;
    }

    static clamp(num, min, max) {
        return Math.min(Math.max(num, min), max)
    }

    static rectToSides(x, y, w, h) {
        const ls = x;
        const rs = x + w;
        const ts = y;
        const bs = y + h;
        
        return [ls, ts, rs, bs];
    }

    static sidesToRect(ls, ts, rs, bs) {
        const x = ls;
        const y = ts;
        const w = rs - ls;
        const h = bs - ts;
      
        return [x, y, w, h];
    }
}