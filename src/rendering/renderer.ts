import { Enemy } from "../gameplay/fighting.js";
import { Player } from "../gameplay/player.js";
import { Level, Segment } from "../gameplay/world.js";
import { $, DX, DY } from "../utilities.js";
import * as THREE from "three";

const RENDER_DISTANCE: number = 3;
let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
let levelMeshes: THREE.Mesh[];

export function initRendering(level: Level){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("container").id.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);
    //const geometry = new THREE.BoxGeometry(1,1,1);
    //const material = new THREE.MeshPhongMaterial({color:0xff0000});
    //const light = new THREE.PointLight();
    //light.position.y = 1;
    //const cube = new THREE.Mesh(geometry,material);
    //cube.castShadow = true;
    //cube.rotation.x+=45;
    //cube.rotation.y+=45;
    //scene.add(cube);
    //scene.add(light);
    //camera.position.z = 5;
    //renderer.render(scene,camera);
    const loader: THREE.TextureLoader = new THREE.TextureLoader();
    loader.load("assets/img/wall.png",function(texture:THREE.Texture){
        texture.colorSpace = THREE.SRGBColorSpace;
        let material: THREE.Material = new THREE.MeshBasicMaterial({map:texture});

        let mesh = generateLevelMesh(level.segments[0]);
        mesh.material = material;
        scene.add(mesh);
        camera.position.z = 5;
        camera.position.y = 0.5;
        camera.position.x = 5;
        //camera.rotation.x = -Math.PI*0.5*0.75;
        camera.rotation.y = -Math.PI*0.5*0.75;
        renderer.render(scene,camera);
        console.log(mesh)
    });
}



function generateLevelMesh(segment: Segment): THREE.Mesh{
    let positionData: number[] = [];
    let uv: number[] = [];
    let data: number[][] = segment.data;
    for(let r=0; r<data.length; r++){
        for(let c=0; c<data[r].length; c++){
            if(data[r][c] == 0) continue;
            let p: number[][] = [
                [c,0,r],
                [c,1,r],
                [c,1,r+1],
                [c,0,r+1],
                [c+1,0,r],
                [c+1,1,r],
                [c+1,0,r+1],
                [c+1,1,r+1]
            ];
            let faces: number[] = [];
            for(let i: number=0; i<4; i++){
                let newr: number = r+DY[i];
                let newc: number = c+DX[i];
                let go: boolean = (newr < 0 || newc < 0 ||newr >= 10 ||newc >= 10) || data[newr][newc] == 0;
                if(!go) continue;
                switch(i){
                    case 0:
                        faces.push(...p[5],...p[4],...p[0],...p[5],...p[0],...p[1]);
                        break;
                    case 1:
                        faces.push(...p[2],...p[3],...p[6],...p[2],...p[6],...p[7]);
                        
                        break;
                    case 2:
                        faces.push(...p[1],...p[0],...p[3],...p[1],...p[3],...p[2]);

                        break;
                    case 3:
                        faces.push(...p[7],...p[6],...p[4],...p[7],...p[4],...p[5]);
                        break;
                }
                uv.push(0,1,0,0,1,0,0,1,1,0,1,1);
            }
            positionData = positionData.concat(faces);
        }
    }

    let geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(positionData),3)
    );
    geometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(uv),2)
    );
    //geometry.setIndex(indices);
    
    
    let mesh: THREE.Mesh = new THREE.Mesh(geometry);
    return mesh;
}

export function prepareLevels(level: Level):void{
    let segments: Segment[] = level.segments;
    for(let i=0; i<segments.length; i++){
        //levelMeshes.push(generateLevelMesh(segments[i]));
    }
}

export function renderScene(){
    
}