import { DX, DY, clamp } from "../utilities/utilities.js";
import { liveLog, logSegment } from "../utilities/livelog.js";
export class Player {
    constructor(walk, run, noclip) {
        this.position = {
            x: 0,
            y: 0,
            heading: 0,
        };
        this.stamina = 10;
        this.staminaregen = 0;
        this.PLAYER_CONSTANTS = {
            run: 0.03,
            walk: 0.01,
            playerRadius: 0
        };
        this.sounds = {};
        this.dead = false;
        this.nocliptimer = 100;
        this.sounds.walk = new Audio(walk);
        this.sounds.run = new Audio(run);
        this.sounds.noclip = new Audio(noclip);
    }
    detectCollision(level) {
        let chunkCoordinates = {
            x: clamp(Math.floor(this.position.x / 10), 0, level.width, true, true),
            y: clamp(Math.floor(this.position.y / 10), 0, level.height, true, true)
        };
        let segmentCoordinates = {
            x: this.position.x % 10,
            y: this.position.y % 10
        };
        liveLog("BEGIN COLLISION CHECK", chunkCoordinates);
        logSegment(level.segments[level.level[chunkCoordinates.y][chunkCoordinates.x]], segmentCoordinates);
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (segmentCoordinates.x - this.PLAYER_CONSTANTS.playerRadius < c + 1 &&
                    segmentCoordinates.x + this.PLAYER_CONSTANTS.playerRadius > c &&
                    segmentCoordinates.y - this.PLAYER_CONSTANTS.playerRadius < r + 1 &&
                    segmentCoordinates.y + this.PLAYER_CONSTANTS.playerRadius > r &&
                    level.segments[level.level[chunkCoordinates.y][chunkCoordinates.x]].data[r][c]) {
                    liveLog("I AM COLLIDING1", segmentCoordinates.x, segmentCoordinates.y, r, c, level.segments[level.level[chunkCoordinates.y][chunkCoordinates.x]].data[r][c]);
                    return true;
                }
            }
        }
        liveLog("SIDES");
        for (let i = 0; i < 4; i++) {
            let offsetx = DX[i];
            let offsety = DY[i];
            let chunkCoordinates = {
                x: Math.floor(clamp(this.position.x / 10 - offsetx, 0, level.width, true, true)),
                y: Math.floor(clamp(this.position.y / 10 - offsety, 0, level.height, true, true))
            };
            liveLog("SIDE:", offsetx, offsety);
            logSegment(level.segments[level.level[chunkCoordinates.y][chunkCoordinates.x]], { x: segmentCoordinates.x - offsetx * 10, y: segmentCoordinates.y - offsety * 10 });
            for (let r = 0; r < 10; r++) {
                for (let c = 0; c < 10; c++) {
                    let x = clamp(segmentCoordinates.x - offsetx * 10, 0, level.width * 10, true);
                    let y = clamp(segmentCoordinates.y - offsety * 10, 0, level.height * 10, true);
                    if (x - this.PLAYER_CONSTANTS.playerRadius < c + 1 &&
                        x + this.PLAYER_CONSTANTS.playerRadius > c &&
                        y - this.PLAYER_CONSTANTS.playerRadius < r + 1 &&
                        y + this.PLAYER_CONSTANTS.playerRadius > r &&
                        level.segments[level.level[chunkCoordinates.y][chunkCoordinates.x]].data[r][c]) {
                        liveLog("I AM COLLIDING2");
                        return true;
                    }
                }
            }
        }
        return false;
    }
    setSpawn(x, y) {
        this.position.x = x + 5.7;
        this.position.y = y + 5.7;
        this.position.heading = 90;
    }
    start() {
        this.sounds.walk.loop = true;
        this.sounds.run.loop = true;
        this.sounds.walk.volume = 0;
        this.sounds.run.volume = 0;
        this.sounds.walk.play();
        this.sounds.run.play();
    }
    stop() {
        this.sounds.walk.pause();
        this.sounds.run.pause();
        this.sounds.noclip.pause();
    }
    setRotation(rotation) {
        this.position.heading = rotation;
    }
    update(input, level) {
        if (this.dead)
            return;
        if (this.nocliptimer < 100) {
            this.sounds.walk.volume = 0;
            this.sounds.run.volume = 0;
            this.nocliptimer++;
            return;
        }
        if (input.KeyDown.ArrowRight) {
            this.setRotation(this.position.heading + 2);
        }
        else if (input.KeyDown.ArrowLeft) {
            this.setRotation(this.position.heading - 2);
        }
        let radians = (this.position.heading / 180) * Math.PI;
        let radiansSidestep = ((this.position.heading + 90) / 180) * Math.PI;
        let rotfactorx = Math.sin(radians);
        let rotfactory = -Math.cos(radians);
        let rotfactorsidestepx = Math.sin(radiansSidestep);
        let rotfactorsidestepy = -Math.cos(radiansSidestep);
        if (input.KeyDown.ShiftLeft) {
            this.stamina -= 0.01;
            if (this.stamina < 0) {
                this.stamina = 0;
                this.staminaregen = 100;
            }
        }
        const SPEED = input.KeyDown.ShiftLeft && this.stamina > 0 ? this.PLAYER_CONSTANTS.run : this.PLAYER_CONSTANTS.walk;
        if (this.stamina < 10 && !input.KeyDown.ShiftLeft) {
            if (this.staminaregen > 0) {
                this.staminaregen--;
            }
            this.stamina += 0.005;
        }
        let prevp = this.position.y;
        let walking = false;
        if (input.KeyDown.KeyW) {
            this.position.y += SPEED * rotfactory;
            walking = true;
        }
        else if (input.KeyDown.KeyS) {
            this.position.y -= SPEED * rotfactory;
            walking = true;
        }
        if (input.KeyDown.KeyA) {
            this.position.y -= SPEED * rotfactorsidestepy;
            walking = true;
        }
        else if (input.KeyDown.KeyD) {
            this.position.y += SPEED * rotfactorsidestepy;
            walking = true;
        }
        if (walking && (!input.KeyDown.ShiftLeft || this.stamina == 0)) {
            this.sounds.walk.volume = 1;
            this.sounds.run.volume = 0;
        }
        else if (walking && input.KeyDown.ShiftLeft && this.stamina > 0) {
            this.sounds.walk.volume = 0;
            this.sounds.run.volume = 1;
        }
        else {
            this.sounds.walk.volume = 0;
            this.sounds.run.volume = 0;
        }
        liveLog("CHECK Y");
        if (this.detectCollision(level)) {
            if (input.KeyDown.Space && Math.floor(Math.random() * 100) < 4) {
                this.nocliptimer = 0;
                this.sounds.noclip.currentTime = 0;
                this.sounds.noclip.play();
                this.position.x = Math.floor(Math.random() * level.width) * 10 + 4.5;
                this.position.y = Math.floor(Math.random() * level.height) * 10 + 4.5;
                return;
            }
            this.position.y = prevp;
        }
        prevp = this.position.x;
        if (input.KeyDown.KeyW) {
            this.position.x += SPEED * rotfactorx;
        }
        else if (input.KeyDown.KeyS) {
            this.position.x -= SPEED * rotfactorx;
        }
        if (input.KeyDown.KeyA) {
            this.position.x -= SPEED * rotfactorsidestepx;
        }
        else if (input.KeyDown.KeyD) {
            this.position.x += SPEED * rotfactorsidestepx;
        }
        liveLog("CHECK X");
        if (this.detectCollision(level)) {
            if (input.KeyDown.Space && Math.floor(Math.random() * 100) < 4) {
                this.nocliptimer = 0;
                this.sounds.noclip.currentTime = 0;
                this.sounds.noclip.play();
                this.position.x = Math.floor(Math.random() * level.width) * 10 + 4.5;
                this.position.y = Math.floor(Math.random() * level.height) * 10 + 4.5;
                return;
            }
            this.position.x = prevp;
        }
        if (this.position.x > level.width * 10)
            this.position.x -= level.width * 10;
        if (this.position.x < 0)
            this.position.x += level.width * 10;
        if (this.position.y > level.height * 10)
            this.position.y -= level.height * 10;
        if (this.position.y < 0)
            this.position.y += level.height * 10;
    }
    draw(ctx, scale = 1) {
        const radians = (this.position.heading / 180) * Math.PI;
        const rotfactorx = Math.sin(radians);
        const rotfactory = -Math.cos(radians);
        ctx.fillStyle = "lime";
        ctx.fillRect(-0.25 * scale + this.position.x * scale, -0.25 * scale + this.position.y * scale, 0.5 * scale, 0.5 * scale);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.position.x * scale, this.position.y * scale);
        ctx.lineTo(this.position.x * scale + rotfactorx * scale, this.position.y * scale + rotfactory * scale);
        ctx.stroke();
    }
    die() {
        this.dead = true;
    }
}
