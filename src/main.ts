import { Input } from "./gameplay/input.js"
import { Player } from "./gameplay/player.js";
import { $ } from "./utilities.js";
import { Level, loadLevels } from "./gameplay/world.js";
//import { makeScan, renderScene, scanLevel } from "./rendering/renderer.js";

import { die } from "./gui.js";
import { drawScene, initRendering, prepareLevels, updateCamera, updateChunks } from "./rendering/renderer.js";
import { NUMBER_OF_LEVELS } from "./init.js";


let input:Input,
    ctx:CanvasRenderingContext2D,
    canvas:HTMLCanvasElement,
    player:Player;
let level:number = 0;
let levels:Level[];

async function setup(callback: Function): Promise<void>{

    initRendering();

    $("loadingscreen").id.hidden = true;
    $("mainmenu").id.hidden = false;

    for(let i=0; i<levels.length; i++){
        await prepareLevels(levels[i]);
        levels[i].generate();
    }

    callback();
}

function begin(){
    $("mainmenu").id.hidden = true;
    
    mainloop();
}

function mainloop():void{
    try{
        updateChunks(levels[level],player);
        player.update(input,levels[level]);
        updateCamera(player);
        drawScene();
        requestAnimationFrame(mainloop);
    }catch(e){
        console.error(e.stack);
    }
}
function main():void{
    input = new Input();
    player = new Player("./assets/audio/footsteps.mp3","./assets/audio/run.mp3","./assets/audio/noclip.mp3");
    canvas = $("main").id as HTMLCanvasElement;
    //ctx = canvas.getContext("2d");
    //ctx.imageSmoothingEnabled = false;

    loadLevels("./levels/levels.json",function(b: Level[]){
        levels = b;
        player.setSpawn(b[0].spawnlocation.x,b[0].spawnlocation.y);
        setup(function(){
            $("play").id.addEventListener("click",begin);
        });
    });
    
    
    
}

window.addEventListener("load",main)