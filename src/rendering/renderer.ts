
import { Player } from "../gameplay/player.js";
import { Level, Segment } from "../gameplay/world.js";
import { $, DX, DY } from "../utilities.js";
import * as THREE from "three";

const RENDER_DISTANCE: number = 3;
let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera;
let levelMeshes: THREE.Mesh[];
let walls: THREE.Group, prevPlayerChunkPos: {x:number,y:number}, levelMaterial: THREE.Material;

export function initRendering(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("container").id.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);

}

function generateSegmentMesh(segment: Segment): THREE.Mesh{
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
        levelMeshes.push(generateSegmentMesh(segments[i]));
    }
}

export function updateChunks(level: Level, player: Player):void{

    

    let playerChunkPos:{x:number,y:number} = {x:Math.floor(player.position.x/10),y:Math.floor(player.position.y/10)};
    if(playerChunkPos.x === prevPlayerChunkPos.x && playerChunkPos.y === prevPlayerChunkPos.y)return;
    walls.position.x = Math.floor(player.position.x/10)*10;
    walls.position.z = Math.floor(player.position.y/10)*10;
    prevPlayerChunkPos = playerChunkPos;

    walls = new THREE.Group();
    walls.name = "wall";
    
    
    for(let r: number = -Math.floor(RENDER_DISTANCE/2)+playerChunkPos.y; r<=Math.floor(RENDER_DISTANCE/2)+playerChunkPos.y; r++){
        let row = r < 0 ? r+level.height : r >= level.height ? r-level.height : r;
        for(let c: number = -Math.floor(RENDER_DISTANCE/2)+playerChunkPos.x; c<=Math.floor(RENDER_DISTANCE/2)+playerChunkPos.x; c++){
            let column = c < 0 ? c + level.width : c >= level.width ? c - level.width : c;
            let mesh = generateSegmentMesh(level.segments[level.level[row][column]]);
            mesh.material = 
        }
    }
}