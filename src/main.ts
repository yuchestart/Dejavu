import { Input } from "./gameplay/input.js"
import { Player } from "./gameplay/player.js";
import { $ } from "./utilities.js";
import { Level, loadLevels } from "./gameplay/world.js";
//import { makeScan, renderScene, scanLevel } from "./rendering/renderer.js";

import { die } from "./gui.js";
import { initRendering } from "./rendering/renderer.js";


let input:Input,
    ctx:CanvasRenderingContext2D,
    canvas:HTMLCanvasElement,
    player:Player;
let level:Level;

function mainloop():void{
    if(input.KeyDown.W){
                
    }
}
function main():void{
    input = new Input(/*"main"*/);
    player = new Player("./assets/audio/footsteps.mp3","./assets/audio/run.mp3","./assets/audio/noclip.mp3");
    canvas = $("main").id as HTMLCanvasElement;
    //ctx = canvas.getContext("2d");
    //ctx.imageSmoothingEnabled = false;

    loadLevels("./levels/levels.json",function(a,b){
        level = b[0];
        level.setSpawn();
        level.generate();
        console.log(level);
        player.setSpawn(b[0].spawnlocation.x,b[0].spawnlocation.y);
        initRendering();
        $("play").id.addEventListener("click",)
    });
    
    
    
}

window.addEventListener("load",main)