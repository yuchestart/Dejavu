import { $ } from "./utilities.js";
let frameCount = 0;
let livelogtext = '';
let paused = false;
let playEvent;
export function initLiveLog() {
    $("llpause").id.addEventListener("click", function () {
        paused = true;
        console.log("paused");
    });
    $("llplay").id.addEventListener("click", function () {
        paused = false;
        playEvent();
    });
}
export function checkPaused() {
    return paused;
}
export function addPlayEvent(playEvent) {
    playEvent = playEvent;
}
export function liveLog(...values) {
    for (let i = 0; i < values.length; i++) {
        livelogtext += JSON.stringify(values[i]);
        if (i < values.length - 1) {
            livelogtext += " ";
        }
    }
    livelogtext += "\n";
}
export function logSegment(segment, playerPosition) {
    liveLog("========================");
    liveLog(playerPosition);
    for (let i = 0; i < 10; i++) {
        let list = [...segment.data[i]];
        if (Math.floor(playerPosition.y) == i) {
            if (playerPosition.x >= 0 && playerPosition.x < 10) {
                list[Math.floor(playerPosition.x)] = 8;
            }
        }
        liveLog(...list);
    }
    liveLog("========================");
}
export function updateLivelog() {
    frameCount++;
    $("llframecount").id.innerText = frameCount.toString();
    $("lltext").id.value = livelogtext;
    livelogtext = "";
}
