import { Configuration } from './configuration.js';

export { Tile };

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