import { Player } from "./player.js";
import {RNG} from "../utilities/random.js"
/**
 * A 10x10 segment of a level
 */
export class Segment
{  
    public data:Array<Array<number>>;
    
    constructor(data:Array<Array<number>>)
    {
        this.data = data;
    }

    public draw(ctx:CanvasRenderingContext2D,scale:number = 1,offsetX:number = 0, offsetY: number = 0):void
    {
        ctx.fillStyle = "black"; //TEMPORARY: ONLY USED FOR DISPLAY PURPOSES
        for(let row: number=0; row<10; row++)
        {
            for(let column: number=0; column < 10; column++)
            {
                if(!this.data[row][column]) continue
                ctx.fillRect(column*scale+offsetX,row*scale+offsetY,scale,scale);
            }
        }
    }
}

export class Level
{
    private random: RNG;
    public segments: Array<Segment>;
    public level: Array<Array<number>> = [];
    public width: number;
    public height: number;
    public spawnlocation:{x:number,y:number} = {x:-1,y:-1};
    public wallTexturePath: string;

    constructor(segments: Array<Segment>,seed?:number,width:number = 50,height:number = 50,wallTexturePath?:string)
    {
        this.segments = segments;
        this.segments[-1] = new Segment([
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ]);
        this.width = width;
        this.height = height;
        this.seed(seed);
        this.wallTexturePath = wallTexturePath;
    }

    public seed(seed?:number):void
    {
        if(seed)
            this.random = new RNG(seed);
        else
            this.random = new RNG(Math.floor(Math.random()*2_000_000_000));
    }

    public generate():void
    {
        
        for(let row:number=0; row<this.height; row++)
        {
            this.level.push([]);
            for(let column:number=0; column<this.width; column++)
            {
                if(column === this.spawnlocation.x && row === this.spawnlocation.y)
                {
                    this.level[row].push(-1);
                    continue;
                }
                
                this.level[row].push(Math.floor(this.random.random()*this.segments.length));
            }
        }
        
    }

    public draw(ctx:CanvasRenderingContext2D, player: Player,scale:number = 1):void
    {
        for(let row:number=0; row < this.height; row++)
        {
            for(let column:number=0; column < this.width; column++)
            {
                if(this.level[row][column] === -1) continue;
                
                this.segments[this.level[row][column]].draw(ctx,scale,column*scale*10,row*scale*10);
                //break;
            }
            //break;
        }
    }

    public setSpawn():void
    {
        
        this.spawnlocation = {
            x:Math.floor(this.random.random()*this.width),
            y:Math.floor(this.random.random()*this.width)
        }
    }
}

export function loadLevels(filepath:string,callback:(levels:Array<Level>)=>void):void{
    fetch(filepath)
    .then(response => response.json())
    .then((json:{segments:Array<Array<Array<number>>>,levels:{width:number,height:number,wallMaterial:string}[]}) => {
        const segments:Array<Segment> = [];
        const levels:Array<Level> = [];
        console.log(json)
        for(let i=0; i<json.segments.length; i++){
            segments.push(new Segment(json.segments[i]));
        }
        for(let i=0; i<json.levels.length; i++){
            levels.push(new Level(segments,void 0,json.levels[i].width,json.levels[i].height,json.levels[i].wallMaterial));
        }
        callback(levels);
    });
}

