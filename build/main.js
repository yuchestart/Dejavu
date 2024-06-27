var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Input } from "./gameplay/input.js";
import { Player } from "./gameplay/player.js";
import { $ } from "./utilities/utilities.js";
import { loadLevels } from "./gameplay/world.js";
import { addEntity, drawScene, initRendering, prepareLevels, updateCamera, updateChunks } from "./rendering/renderer.js";
import { addPlayEvent, checkPaused, initLiveLog, updateLivelog } from "./utilities/livelog.js";
import { PlaceholderEntity } from "./gameplay/entities.js";
let input, ctx, canvas, player;
let level = 0;
let levels;
let entity;
function setup(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        initLiveLog();
        initRendering();
        $("loadingscreen").id.hidden = true;
        $("mainmenu").id.hidden = false;
        for (let i = 0; i < levels.length; i++) {
            yield prepareLevels(levels[i]);
            levels[i].generate();
        }
        entity = new PlaceholderEntity();
        yield entity.init();
        addEntity(entity);
        addPlayEvent(mainloop);
        callback();
    });
}
function begin() {
    $("mainmenu").id.hidden = true;
    mainloop();
}
function mainloop() {
    try {
        updateChunks(levels[level], player);
        player.update(input, levels[level]);
        updateCamera(player);
        drawScene();
        updateLivelog();
        if (!checkPaused())
            requestAnimationFrame(mainloop);
    }
    catch (e) {
        updateLivelog();
        console.error(e.stack);
    }
}
function main() {
    ;
    input = new Input();
    player = new Player("./assets/audio/footsteps.mp3", "./assets/audio/run.mp3", "./assets/audio/noclip.mp3");
    canvas = $("main").id;
    loadLevels("./levels/levels.json", function (b) {
        levels = b;
        player.setSpawn(b[0].spawnlocation.x, b[0].spawnlocation.y);
        setup(function () {
            $("play").id.addEventListener("click", begin);
        });
    });
}
window.addEventListener("load", main);
