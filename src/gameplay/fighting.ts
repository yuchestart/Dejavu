import { dv } from "../rendering/renderer.js";
import { $ } from "../utilities.js";
import { Player } from "./player.js";
import { Level } from "./world.js";

export class Enemy{
    public position = {
        x:17,
        y:4.5,
        heading:0,
    };
    private static readonly CHASE = {
        initial: 0.06,
        accel: 0.0001,
        max: 0.1
    };
    private curspeed: number = Enemy.CHASE.initial;
    private image: HTMLImageElement;
    private scream: HTMLAudioElement;
    constructor(image: string,audio: string){
        this.image = document.createElement("img");
        this.image.src = image;
        this.scream = new Audio(audio);
        this.position.x = Math.floor(Math.random()*50) + 4.5;
        this.position.y = Math.floor(Math.random()*50) + 4.5;
    }

    public start(){
        this.scream.play();
        this.scream.loop = true;
        this.scream.volume = 0;
    }
    public stop(){
        this.scream.pause();
    }

    public update(player: Player, level: Level):void{
        
        let distance: number = Math.sqrt((player.position.x - this.position.x) ** 2 + (player.position.y - this.position.y) ** 2);
        let volume: number=0.25*((30-distance)/30);
        volume = volume < 0 ? 0 : volume > 1 ? 1 : volume;
        this.scream.volume = volume;
        if(distance > 30){
            this.curspeed = Enemy.CHASE.initial;
            if(Math.floor(Math.random()*5000) < 10){
                this.position.x = Math.floor(Math.random()*50) + 4.5;
                this.position.y = Math.floor(Math.random()*50) + 4.5;
            }
            return;
        }
        this.curspeed += Enemy.CHASE.accel;
        if(this.curspeed > Enemy.CHASE.max) this.curspeed = Enemy.CHASE.max;
        
        
        let moveVector: number[] = [(player.position.x - this.position.x),(player.position.y - this.position.y)];
        moveVector[0] /= distance;
        moveVector[1] /= distance;
        moveVector[0] *= this.curspeed;
        moveVector[1] *= this.curspeed;

        this.position.x += moveVector[0];
        if(this.position.x < 0) this.position.x += level.width;
        if(this.position.x >= level.width) this.position.x -= level.width;
        if(this.detectCollision(level)) this.position.x -= moveVector[0];
        this.position.y += moveVector[1];
        if(this.position.y < 0) this.position.y += level.height;
        if(this.position.y >= level.width) this.position.y -= level.height;
        if(this.detectCollision(level)) this.position.y -= moveVector[1];
        if(distance < 1.5){
            player.die();
        }
    }

    public spawn():void{

    }

    public getEntityPosition(player: Player): number[]{
        let angle: number, xoffset: number
        let vx: number, vy: number;
        const radian = ((-player.position.heading) / 180) * Math.PI;
        let origvx: number = this.position.x - player.position.x;
        let origvy: number = this.position.y - player.position.y;
        //$("livelog").id.innerText += `${vx},${vy} HDG:${player.position.heading} FromRad: ${radian * 180 / Math.PI}\n`;
        vx = (origvx * Math.cos(radian)) - (origvy * Math.sin(radian));
        vy = (origvx * Math.sin(radian)) + (origvy * Math.cos(radian));
        //angle = Math.atan2(vy,vx)*180/Math.PI-45;
        //$("livelog").id.innerText +=`${vx},${vy}\n`;
        return [vx,-vy]
    }

    public render(ctx: CanvasRenderingContext2D,player: Player): void{
        let p = this.getEntityPosition(player);
        ctx.fillStyle = "red";
        if(p[1] < 0) return
        let depth: number = (dv/p[1]);
        //$("livelog").id.innerText += `DisplayX : ${p[0]*(dv/p[1])+250} DV: ${dv}\n`
        //ctx.fillRect(p[0]*(dv/p[1])+250-(dv/(p[1]*2)),250,(dv/p[1]),(dv/p[1]));
        ctx.drawImage(this.image,p[0]*depth+250-depth/2,250-depth/2,depth,depth);
        
    }
    public draw(ctx:CanvasRenderingContext2D,scale = 1):void{
        const radians: number = (this.position.heading / 180) * Math.PI;
        const rotfactorx: number = Math.sin(radians);
        const rotfactory: number = -Math.cos(radians);
        ctx.fillStyle = "lime";
        ctx.fillRect(-0.25*scale+this.position.x*scale,-0.25*scale+this.position.y*scale,0.5*scale,0.5*scale);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.position.x*scale,this.position.y*scale);
        ctx.lineTo(this.position.x*scale + rotfactorx*scale,this.position.y*scale + rotfactory*scale);
        ctx.stroke();
    }

    private detectCollision(level:Level): boolean{
        for(let row = -1; row <= 1; row++){
            for(let column = -1; column <= 1; column++){
                let truex: number = Math.floor(this.position.x+column);
                let truey: number = Math.floor(this.position.y+row);
                let segmentx: number = Math.floor((this.position.x+column) / 10);
                let segmenty: number = Math.floor((this.position.y+row) / 10);
                let tilex: number = Math.floor(this.position.x % 10);
                let tiley: number = Math.floor(this.position.y % 10);
                if(segmentx < 0) segmentx += level.width 
                if(segmenty < 0) segmenty += level.height
                if(segmentx >= level.width) segmentx -= level.width;
                if(segmenty >= level.height) segmenty -= level.height;
                segmentx %= level.width;
                segmenty %= level.height;
                if(tilex < 0) tilex += 10;
                if(tiley < 0) tiley += 10;
                tilex %= 10;
                tiley %= 10;
                if(level.level[segmenty][segmentx] === -1) continue;
                
                if(level.segments[level.level[segmenty][segmentx]].data[tiley][tilex]){
                    let box1: number[] = [
                        this.position.x - 0.25,
                        this.position.x + 0.25,
                        this.position.y - 0.25,
                        this.position.y + 0.25 
                    ];
                    let box2: number[] = [
                        truex,
                        truex+1,
                        truey,
                        truey+1
                    ]
                    if(
                        box1[0] < box2[1] && box1[1] > box2[0] &&
                        box1[2] < box2[3] && box1[3] > box2[2]
                    ){return true; }
                }
            }
        }
        return false;
    }
}

export function shoot(entities: Enemy[]){

}