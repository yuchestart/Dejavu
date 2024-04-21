import { Enemy } from "../gameplay/fighting.js";
import { Player } from "../gameplay/player.js";
import { Level } from "../gameplay/world.js";
export const dv = 500/Math.tan(Math.PI*(50/180))
/**
 * Raycasts. Returns the distance, or undefined if it hits nothing.
 * @param x Starting X
 * @param y Starting Y
 * @param heading Which way it is facing, 0 - North, 90 - East, 180 - South, 270 - West
 * @param level The level
 * @param range How far to raycast
 */
function raycast(x: number, y: number, heading: number, level: Level, range:number = 50): number | null{
    let curx: number = x, cury: number = y;
    const radian: number = (heading / 180) * Math.PI;
    let slopex: number = Math.sin(radian) * 0.25;
    let slopey: number = -Math.cos(radian) * 0.25;
    for(let step: number=0; step < range; step+=0.25){
        curx += slopex;
        cury += slopey;
        for(let row = -1; row <= 1; row++){
            for(let column = -1; column <= 1; column++){
                let truex: number = Math.floor(curx+column);
                let truey: number = Math.floor(cury+row);
                let segmentx: number = Math.floor((curx+column) / 10);
                let segmenty: number = Math.floor((cury+row) / 10);
                let tilex: number = Math.floor(curx % 10);
                let tiley: number = Math.floor(cury % 10);
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
                        curx - 0.25,
                        curx + 0.25,
                        cury - 0.25,
                        cury + 0.25 
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
                    ){  return step; }
                }
            }
        }
    }
    return null;
}

/**
 * Scan the level like a lidar
 * @param player The player to raycast from
 * @param level The level the player is in
 * @returns An array containing either the distance to a wall, or null
 */
export function scanLevel(player: Player, level:Level, fov:number = 100, density: number = 4): Array<number|null>{
    let distances: Array<number|null> = [];
   
    for(
        let x:number=-125; x<=125; x+=density
    ){
        let dir = Math.atan(x/dv)*(180/Math.PI);
        let raw: number | null = raycast(
            player.position.x,
            player.position.y,
            player.position.heading+dir,
            level
        );
        if(raw === null){distances.push(null); continue;}
        distances.push(Math.cos((dir / 180) * Math.PI) * raw)
        //distances.push(raw);
    }
    
    return distances;
}

export function makeScan( scan: Array<number|null>, factor: number = 300, width: number = 500): {
    move: number,
    scans: {
        type: string,
        height: number,
        strokeStyle: string,
        x: number,
        distance: number
    }[]
}{
    const move = width/(scan.length-1);
    const scans = [];
    for(let i: number=0; i<scan.length; i++){
        if(scan[i] === null) continue;
        const height = scan[i] <= 0 ? 250: factor/scan[i];
        let strokeStyle: string;
        if(i%2 == 0){
            strokeStyle = `rgb(${(50-scan[i])*4.66},${(50-scan[i])*4.66},${(50-scan[i])*2.38})`;
        } else {
            strokeStyle = `rgb(${(50-scan[i])*4.5},${(50-scan[i])*4.5},${(50-scan[i])*2.2})`;
        }
        scans.push({
            type:"raycast",
            height:height,
            strokeStyle:strokeStyle,
            x: move*i - move/2,
            distance: scan[i]
        })
        /*
       
        ctx.lineWidth = Math.ceil(move);
        ctx.beginPath();
        ctx.moveTo(move*i - move/2, 250-height);
        ctx.lineTo(move*i - move/2, 250+height);
        ctx.stroke();*/

    }
    scans.sort((a:{height:number,strokeStyle:string,x:number,distance:number},b:{height:number,strokeStyle:string,x:number,distance:number}) =>
        a.distance < b.distance? 1 : a.distance > b.distance ? -1 : 0
    );
    return {
        move: move,
        scans:scans
    };
}

export function renderScene(
    ctx: CanvasRenderingContext2D,
    player: Player,
    scan:{move: number,scans: {height: number,strokeStyle: string,x: number,distance: number}[]},
    entities: Enemy[]
): void{
    let scans: any = scan.scans;
    for(const i in entities){
        let entitydepth: number = entities[i].getEntityPosition(player)[1];
        scans.push({type:"entity",distance: entitydepth,entity:entities[i]});
    }
    scans.sort((a:any,b:any) =>
        a.distance < b.distance? 1 : a.distance > b.distance ? -1 : 0
    );
    //console.log(scans);
    for(let i: number = 0; i<scans.length; i++){
        if(scans[i].type == "raycast"){
            ctx.strokeStyle = scans[i].strokeStyle
            ctx.lineWidth = Math.ceil(scan.move);
            ctx.beginPath();
            ctx.moveTo(scans[i].x, 250-scans[i].height);
            ctx.lineTo(scans[i].x, 250+scans[i].height);
            ctx.stroke();
        } else if(scans[i].type == "entity"){
            scans[i].entity.render(ctx,player);
        }
    }
}