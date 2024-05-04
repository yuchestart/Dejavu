import { Input } from "./gameplay/input.js";
import { Player } from "./gameplay/player.js";
import { $ } from "./utilities.js";
import { loadLevels } from "./gameplay/world.js";
//import { makeScan, renderScene, scanLevel } from "./rendering/renderer.js";
import { Enemy } from "./gameplay/fighting.js";
import { initRendering } from "./rendering/renderer.js";
let input, ctx, canvas, player;
const entities = [];
let birdseye, birdseyecanvas;
let level;
const dv = 1000 / Math.tan(100 / 2);
export function begin() {
    for (let i = 0; i < Math.floor(Math.random() * 5) + 50; i++) {
        entities.push(new Enemy("./assets/img/bigscarymonster.png", "./assets/audio/unsettlingscream.mp3"));
        entities[i].start();
    }
    player.start();
    $("mainmenu").id.hidden = true;
    mainloop();
}
/*
function mainloop():void{
    try{
        if(player.dead){
            for(let i=0; i<entities.length; i++){
                entities[i].stop()
            }
            player.stop();
            die();
            return;
        }
        $("livelog").id.innerText = "";
        ctx.clearRect(0,0,canvas.width,canvas.height);
        player.update(input,level);
        for(let i=0; i<entities.length; i++){
            entities[i].update(player,level);
        }
        let scan = makeScan(scanLevel(player,level));
        if(player.nocliptimer < 100){
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,500,500);
            requestAnimationFrame(mainloop);
            return;
        }

        for(let i=0; i<=250; i++){
            ctx.strokeStyle = `rgb(${(250-i)*0.856-100},${(250-i)*0.856-100},${(250-i)*0.856-100})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0,i);
            ctx.lineTo(500,i);
            ctx.stroke()
        }
        for(let i=0; i<=250; i++){
            ctx.strokeStyle = `rgb(${i*0.344-100},${i*0.896-100},${i*0.38-100})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0,250+i);
            ctx.lineTo(500,250+i);
            ctx.stroke()
        }
        renderScene(ctx,player,scan,entities)
        ctx.fillStyle = "red";
        ctx.font = "13px sans-serif"
        ctx.fillRect(10,485,player.stamina*10,5)
        ctx.fillText("Stamina",10,480)
        //entity.render(ctx,player);
        //$("livelog").id.innerText += `${entity.getEntityPosition(player)}`;
        
        requestAnimationFrame(mainloop);
    } catch (_e){
        let e: Error = _e;
        console.error(e.stack);
    }
}
*/
function mainloop() {
}
function main() {
    input = new Input( /*"main"*/);
    player = new Player("./assets/audio/footsteps.mp3", "./assets/audio/run.mp3", "./assets/audio/noclip.mp3");
    canvas = $("main").id;
    //ctx = canvas.getContext("2d");
    //ctx.imageSmoothingEnabled = false;
    initRendering();
    loadLevels("./levels/levels.json", function (a, b) {
        level = b[0];
        level.setSpawn();
        level.generate();
        console.log(level);
        player.setSpawn(b[0].spawnlocation.x, b[0].spawnlocation.y);
        $("play").id.addEventListener("click", begin);
    });
}
window.addEventListener("load", main);
