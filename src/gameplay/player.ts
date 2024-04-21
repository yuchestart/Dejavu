import { Level } from "./world.js";
import { Input } from "./input.js";
import { $ } from "../utilities.js";

export class Player{
    public position = {
        x:0,
        y:0,
        heading:0,
    };
    public stamina: number = 10;
    public readonly PLAYER_SPEEDS:{[id: string]:number} = {
        run:0.03,
        walk:0.01,
    }
    private sounds: {[id: string]: HTMLAudioElement} = {}
    public dead: boolean = false;
    public nocliptimer: number = 100;

    constructor(walk: string, run: string, noclip: string){
        this.sounds.walk = new Audio(walk);
        this.sounds.run = new Audio(run);
        this.sounds.noclip = new Audio(noclip);
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

    public setSpawn(x: number, y: number):void{
        this.position.x = x+5;
        this.position.y = y+5;
        this.position.heading = 90;
    }

    public start():void{
        this.sounds.walk.loop = true;
        this.sounds.run.loop = true;
        this.sounds.walk.volume = 0;
        this.sounds.run.volume = 0;
        this.sounds.walk.play();
        this.sounds.run.play();
    }

    public stop():void{
        this.sounds.walk.pause();
        this.sounds.run.pause();
        this.sounds.noclip.pause();
    }

    public setRotation(rotation:number):void{
        this.position.heading = rotation;
    }

    public update(input: Input, level:Level):void{
        if(this.dead) return;
        if(this.nocliptimer < 100){
            this.sounds.walk.volume = 0;
            this.sounds.run.volume = 0;
            this.nocliptimer++;
            return;
        }
        if(input.KeyDown.ArrowRight){
            this.setRotation(this.position.heading + 2);
        } else if(input.KeyDown.ArrowLeft){
            this.setRotation(this.position.heading - 2);
        }

        //DO a bunch of math
        let radians: number = (this.position.heading / 180) * Math.PI;
        let radiansSidestep: number = ((this.position.heading + 90) / 180) * Math.PI;
        let rotfactorx: number = Math.sin(radians);
        let rotfactory: number = -Math.cos(radians);
        let rotfactorsidestepx: number = Math.sin(radiansSidestep);
        let rotfactorsidestepy: number = -Math.cos(radiansSidestep);
        if(input.KeyDown.ShiftLeft){
            this.stamina -= 0.01;
            if(this.stamina < 0){
                this.stamina = 0;
            }
        }
        //Check if the player is running or walking
        const SPEED: number = input.KeyDown.ShiftLeft && this.stamina > 0 ? this.PLAYER_SPEEDS.run : this.PLAYER_SPEEDS.walk;
        if(this.stamina < 10 && !input.KeyDown.ShiftLeft){
            this.stamina += 0.001
        }
        let prevp:number = this.position.y;
        let walking: boolean = false;
        //Handle controls
        if(input.KeyDown.KeyW){
            this.position.y += SPEED * rotfactory;
            walking = true;
        }else if(input.KeyDown.KeyS){
            this.position.y -= SPEED * rotfactory;
            walking = true;
        }
        if(input.KeyDown.KeyA){
            this.position.y -= SPEED * rotfactorsidestepy;
            walking = true;
        }else if(input.KeyDown.KeyD){
            this.position.y += SPEED * rotfactorsidestepy;
            walking = true;
        }
        if(walking && (!input.KeyDown.ShiftLeft || this.stamina == 0)){
            this.sounds.walk.volume = 1;
            this.sounds.run.volume = 0;
        } else if(walking && input.KeyDown.ShiftLeft && this.stamina > 0){
            this.sounds.walk.volume = 0;
            this.sounds.run.volume = 1;
        } else {
            this.sounds.walk.volume = 0;
            this.sounds.run.volume = 0;
        }

        //Handle collisions
        if(this.detectCollision(level)){
            if(input.KeyDown.Space && Math.floor(Math.random()*100)<4){
                this.nocliptimer = 0;
                this.sounds.noclip.currentTime = 0;
                this.sounds.noclip.play();
                this.position.x = Math.floor(Math.random()*50)*10+4.5;
                this.position.y = Math.floor(Math.random()*50)*10+4.5;
                return
            }
            this.position.y = prevp;
        }

        prevp = this.position.x;
        if(input.KeyDown.KeyW){
            this.position.x += SPEED * rotfactorx;
        }else if(input.KeyDown.KeyS){
            this.position.x -= SPEED * rotfactorx;
        }
        if(input.KeyDown.KeyA){
            this.position.x -= SPEED * rotfactorsidestepx;
        }else if(input.KeyDown.KeyD){
            this.position.x += SPEED * rotfactorsidestepx;
        }
        if(this.detectCollision(level)){
            if(input.KeyDown.Space && Math.floor(Math.random()*100)<4){
                this.nocliptimer = 0;
                this.sounds.noclip.currentTime = 0;
                this.sounds.noclip.play();
                this.position.x = Math.floor(Math.random()*50)*10+4.5;
                this.position.y = Math.floor(Math.random()*50)*10+4.5;
                return
            }
            this.position.x = prevp;
        }

        //Handle going off the map

        if(this.position.x > level.width*10) this.position.x -= level.width*10
        if(this.position.x < 0) this.position.x += level.width*10
        if(this.position.y > level.height*10) this.position.y -= level.height*10
        if(this.position.y < 0) this.position.y += level.height*10
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

    public die():void{
        this.dead = true;
    }

    
}
