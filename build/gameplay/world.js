import { RNG } from "../utilities/random.js";
export class Segment {
    constructor(data) {
        this.data = data;
    }
    draw(ctx, scale = 1, offsetX = 0, offsetY = 0) {
        ctx.fillStyle = "black";
        for (let row = 0; row < 10; row++) {
            for (let column = 0; column < 10; column++) {
                if (!this.data[row][column])
                    continue;
                ctx.fillRect(column * scale + offsetX, row * scale + offsetY, scale, scale);
            }
        }
    }
}
export class Level {
    constructor(segments, seed, width = 50, height = 50, wallTexturePath) {
        this.easterEggTexturePath = "./assets/img/她画了所有个怪物.png";
        this.level = [];
        this.spawnlocation = { x: 0, y: 0 };
        this.segments = segments;
        this.segments[-1] = new Segment([
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]);
        this.width = width;
        this.height = height;
        this.seed(seed);
        this.wallTexturePath = wallTexturePath;
    }
    seed(seed) {
        if (seed)
            this.random = new RNG(seed);
        else
            this.random = new RNG(Math.floor(Math.random() * 2000000000));
    }
    generate() {
        for (let row = 0; row < this.height; row++) {
            this.level.push([]);
            for (let column = 0; column < this.width; column++) {
                if (column === this.spawnlocation.x && row === this.spawnlocation.y) {
                    this.level[row].push(-1);
                    continue;
                }
                this.level[row].push(Math.floor(this.random.random() * this.segments.length));
            }
        }
    }
    draw(ctx, scale = 1) {
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                if (this.level[row][column] === -1)
                    continue;
                this.segments[this.level[row][column]].draw(ctx, scale, column * scale * 10, row * scale * 10);
            }
        }
    }
    setSpawn() {
        this.level[0][0] = -1;
    }
}
export function loadLevels(filepath, callback) {
    fetch(filepath)
        .then(response => response.json())
        .then((json) => {
        const segments = [];
        const levels = [];
        console.log(json);
        for (let i = 0; i < json.segments.length; i++) {
            segments.push(new Segment(json.segments[i]));
        }
        for (let i = 0; i < json.levels.length; i++) {
            levels.push(new Level(segments, void 0, json.levels[i].width, json.levels[i].height, json.levels[i].wallMaterial));
        }
        callback(levels);
    });
}
