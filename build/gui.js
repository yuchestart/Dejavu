import { $ } from "./utilities.js";
export function die() {
    $("youdied").id.hidden = false;
    $("youdiedtext").id.hidden = true;
    $("playagain").id.hidden = true;
    $("jumpscare").id.hidden = false;
    $("youdied").id.style.animationPlayState = "running";
    let audio = new Audio("./assets/audio/jumpscare.mp3");
    audio.play();
    setTimeout(function () {
        let audio = new Audio("./assets/audio/youdied.mp3");
        audio.play();
        $("jumpscare").id.hidden = true;
        $("youdied").id.style.animationPlayState = "paused";
        $("youdied").id.style.backgroundColor = "black";
        $("youdiedtext").id.hidden = false;
        $("youdiedtext").id.style.animationPlayState = "running";
        $("playagain").id.hidden = false;
    }, 2500);
}
