/**
 * DELETE BEFORE RELEASING; LIVELOG IS NOT NEEDED :)
 * Unless you want to rickroll them for some reason
 */


import { Segment } from "../gameplay/world.js";
import { Point } from "../init.js";
import { $ } from "./utilities.js";


let frameCount: number = 0;
let livelogtext: string = '';
let paused: boolean = false;
let playEvent: Function | null;

export function initLiveLog(): void{
    $("llpause").id.addEventListener("click",function(){
        paused = true;
        console.log("paused")
    });
    $("llplay").id.addEventListener("click",function(){
        paused = false;
        playEvent();
    });
}

export function checkPaused(): boolean{
    return paused;
}

export function addPlayEvent(pe: Function): void{
    playEvent = pe;
}

export function liveLog(...values: any[]){
    livelogtext += `[${frameCount}] - `
    for(let i=0; i<values.length; i++){
        livelogtext += JSON.stringify(values[i]);
        if(i < values.length - 1){
            livelogtext+=" "
        }
    }
    livelogtext += "\n";
}

export function logSegment(segment: Segment,playerPosition: Point){
    liveLog("========================");
    liveLog(playerPosition)
    for(let i=0; i<10; i++){
        let list = [...segment.data[i]];
        if(Math.floor(playerPosition.y) == i){
            if(playerPosition.x >= 0 && playerPosition.x < 10){
                list[Math.floor(playerPosition.x)] = 8;
            }
        }
        liveLog(...list)
    }
    liveLog("========================");
}

export function updateLivelog(): void{
    

    //console.log(($("framecount",$("livelog").id).class[0] as HTMLSpanElement));
    ($("llframecount").id as HTMLSpanElement).innerText = frameCount.toString();
    ($("lltext").id as HTMLInputElement).value = livelogtext;
    livelogtext = "";
    frameCount++;
}