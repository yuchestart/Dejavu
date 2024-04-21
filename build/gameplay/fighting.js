import { dv } from "../rendering/renderer.js";
export class Enemy {
    constructor(image, audio) {
        this.position = {
            x: 17,
            y: 4.5,
            heading: 0,
        };
        this.curspeed = Enemy.CHASE.initial;
        this.image = document.createElement("img");
        this.image.src = image;
        this.scream = new Audio(audio);
        this.position.x = Math.floor(Math.random() * 50) * 10 + 4.5;
        this.position.y = Math.floor(Math.random() * 50) * 10 + 4.5;
    }
    start() {
        this.scream.play();
        this.scream.loop = true;
        this.scream.volume = 0;
    }
    stop() {
        this.scream.pause();
    }
    update(player, level) {
        let distance = Math.sqrt(Math.pow((player.position.x - this.position.x), 2) + Math.pow((player.position.y - this.position.y), 2));
        let volume = 0.25 * ((30 - distance) / 30);
        volume = volume < 0 ? 0 : volume > 1 ? 1 : volume;
        this.scream.volume = volume;
        if (distance > 50) {
            this.curspeed = Enemy.CHASE.initial;
            if (Math.floor(Math.random() * 1000) < 10) {
                this.position.x = Math.floor(Math.random() * 50) * 10 + 4.5;
                this.position.y = Math.floor(Math.random() * 50) * 10 + 4.5;
            }
            return;
        }
        this.curspeed += Enemy.CHASE.accel;
        if (this.curspeed > Enemy.CHASE.max)
            this.curspeed = Enemy.CHASE.max;
        let moveVector = [(player.position.x - this.position.x), (player.position.y - this.position.y)];
        moveVector[0] /= distance;
        moveVector[1] /= distance;
        moveVector[0] *= this.curspeed;
        moveVector[1] *= this.curspeed;
        this.position.x += moveVector[0];
        if (this.position.x < 0)
            this.position.x += level.width;
        if (this.position.x >= level.width)
            this.position.x -= level.width;
        if (this.detectCollision(level))
            this.position.x -= moveVector[0];
        this.position.y += moveVector[1];
        if (this.position.y < 0)
            this.position.y += level.height;
        if (this.position.y >= level.width)
            this.position.y -= level.height;
        if (this.detectCollision(level))
            this.position.y -= moveVector[1];
        if (distance < 1.5) {
            player.die();
        }
    }
    spawn() {
    }
    getEntityPosition(player) {
        let angle, xoffset;
        let vx, vy;
        const radian = ((-player.position.heading) / 180) * Math.PI;
        let origvx = this.position.x - player.position.x;
        let origvy = this.position.y - player.position.y;
        //$("livelog").id.innerText += `${vx},${vy} HDG:${player.position.heading} FromRad: ${radian * 180 / Math.PI}\n`;
        vx = (origvx * Math.cos(radian)) - (origvy * Math.sin(radian));
        vy = (origvx * Math.sin(radian)) + (origvy * Math.cos(radian));
        //angle = Math.atan2(vy,vx)*180/Math.PI-45;
        //$("livelog").id.innerText +=`${vx},${vy}\n`;
        return [vx, -vy];
    }
    render(ctx, player) {
        let p = this.getEntityPosition(player);
        ctx.fillStyle = "red";
        if (p[1] < 0)
            return;
        let depth = (dv / p[1]);
        //$("livelog").id.innerText += `DisplayX : ${p[0]*(dv/p[1])+250} DV: ${dv}\n`
        //ctx.fillRect(p[0]*(dv/p[1])+250-(dv/(p[1]*2)),250,(dv/p[1]),(dv/p[1]));
        ctx.drawImage(this.image, p[0] * depth + 250 - depth / 2, 250 - depth / 2, depth, depth);
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
}
Enemy.CHASE = {
    initial: 0.06,
    accel: 0.0001,
    max: 0.1
};
export function shoot(entities) {
}
