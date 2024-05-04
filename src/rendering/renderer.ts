import { Enemy } from "../gameplay/fighting.js";
import { Player } from "../gameplay/player.js";
import { Level, Segment } from "../gameplay/world.js";
import { $, DX, DY } from "../utilities.js";
import * as THREE from "three";

const RENDER_DISTANCE: number = 3;
let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
let levelMeshes: THREE.Mesh[];



export function initRendering(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("container").id.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshPhongMaterial({color:0xff0000});
    const light = new THREE.PointLight();
    light.position.y = 1;
    const cube = new THREE.Mesh(geometry,material);
    cube.castShadow = true;
    cube.rotation.x+=45;
    cube.rotation.y+=45;
    scene.add(cube);
    scene.add(light);
    camera.position.z = 5;
    renderer.render(scene,camera);
}

function generateLevelMesh(segment: Segment): THREE.Mesh{
    let positionData: number[] = [];
    let indices: number[] = [];
    let data: number[][] = segment.data;
    for(let r=0; r<data.length; r++){
        for(let c=0; c<data[r].length; c++){
            let positions: number[] = [
                c,0,r,
                c,1,r,
                c,1,r+1,
                c,0,r+1,
                c+1,0,r,
                c+1,1,r,
                c+1,0,r+1,
                c+1,1,r+1
            ];
            for(let i=0; i<4; i++){
                 //X, Z
                
            }
        }
    }
    
}

export function prepareLevels(level: Level):void{
    let segments: Segment[] = level.segments;
    for(let i=0; i<segments.length; i++){
        
    }
}

export function renderScene(){

}