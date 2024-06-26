export class Player {
    constructor(walk, run, noclip) {
        this.position = {
            x: 0,
            y: 0,
            heading: 0,
        };
        this.stamina = 10;
        this.staminaregen = 0;
        this.PLAYER_SPEEDS = {
            run: 0.03,
            walk: 0.01,
        };
        this.sounds = {};
        this.dead = false;
        this.nocliptimer = 100;
        this.sounds.walk = new Audio(walk);
        this.sounds.run = new Audio(run);
        this.sounds.noclip = new Audio(noclip);
    }
    detectCollision(level) {
        for (let row = -1; row <= 1; row++) {
            for (let column = -1; column <= 1; column++) {
                let truex = Math.floor(this.position.x + column);
                let truey = Math.floor(this.position.y + row);
                let segmentx = Math.floor((this.position.x + column) / 10);
                let segmenty = Math.floor((this.position.y + row) / 10);
                let tilex = Math.floor(this.position.x % 10);
                let tiley = Math.floor(this.position.y % 10);
                if (segmentx < 0)
                    segmentx += level.width;
                if (segmenty < 0)
                    segmenty += level.height;
                if (segmentx >= level.width)
                    segmentx -= level.width;
                if (segmenty >= level.height)
                    segmenty -= level.height;
                segmentx %= level.width;
                segmenty %= level.height;
                if (tilex < 0)
                    tilex += 10;
                if (tiley < 0)
                    tiley += 10;
                tilex %= 10;
                tiley %= 10;
                if (level.level[segmenty][segmentx] === -1)
                    continue;
                if (level.segments[level.level[segmenty][segmentx]].data[tiley][tilex]) {
                    let box1 = [
                        this.position.x - 0.25,
                        this.position.x + 0.25,
                        this.position.y - 0.25,
                        this.position.y + 0.25
                    ];
                    let box2 = [
                        truex,
                        truex + 1,
                        truey,
                        truey + 1
                    ];
                    if (box1[0] < box2[1] && box1[1] > box2[0] &&
                        box1[2] < box2[3] && box1[3] > box2[2]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    setSpawn(x, y) {
        this.position.x = x + 5;
        this.position.y = y + 5;
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
        //DO a bunch of math
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
        //Check if the player is running or walking
        const SPEED = input.KeyDown.ShiftLeft && this.stamina > 0 ? this.PLAYER_SPEEDS.run : this.PLAYER_SPEEDS.walk;
        if (this.stamina < 10 && !input.KeyDown.ShiftLeft) {
            if (this.staminaregen > 0) {
                this.staminaregen--;
            }
            this.stamina += 0.005;
        }
        let prevp = this.position.y;
        let walking = false;
        //Handle controls
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
        //Handle collisions
        if (this.detectCollision(level)) {
            if (input.KeyDown.Space && Math.floor(Math.random() * 100) < 4) {
                this.nocliptimer = 0;
                this.sounds.noclip.currentTime = 0;
                this.sounds.noclip.play();
                this.position.x = Math.floor(Math.random() * 50) * 10 + 4.5;
                this.position.y = Math.floor(Math.random() * 50) * 10 + 4.5;
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
        if (this.detectCollision(level)) {
            if (input.KeyDown.Space && Math.floor(Math.random() * 100) < 4) {
                this.nocliptimer = 0;
                this.sounds.noclip.currentTime = 0;
                this.sounds.noclip.play();
                this.position.x = Math.floor(Math.random() * 50) * 10 + 4.5;
                this.position.y = Math.floor(Math.random() * 50) * 10 + 4.5;
                return;
            }
            this.position.x = prevp;
        }
        //Handle going off the map
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
