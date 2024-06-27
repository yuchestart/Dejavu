var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { $, DX, DY } from "../utilities/utilities.js";
import * as THREE from "three";
import { Entity } from "../gameplay/entities.js";
const RENDER_DISTANCE = 5;
let renderer, scene, camera;
let levelMeshes = [];
let walls, prevPlayerChunkPos = { x: -1, y: -1 }, levelMaterial;
export function initRendering() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("container").id.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 0.7;
}
export function drawScene() {
    renderer.render(scene, camera);
}
function generateSegmentMesh(segment) {
    let positionData = [];
    let uv = [];
    let data = segment.data;
    for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
            if (data[r][c] == 0)
                continue;
            let p = [
                [c, 0, r],
                [c, 1, r],
                [c, 1, r + 1],
                [c, 0, r + 1],
                [c + 1, 0, r],
                [c + 1, 1, r],
                [c + 1, 0, r + 1],
                [c + 1, 1, r + 1]
            ];
            let faces = [];
            for (let i = 0; i < 4; i++) {
                let newr = r + DY[i];
                let newc = c + DX[i];
                let go = (newr < 0 || newc < 0 || newr >= 10 || newc >= 10) || data[newr][newc] == 0;
                if (!go)
                    continue;
                switch (i) {
                    case 0:
                        faces.push(...p[5], ...p[4], ...p[0], ...p[5], ...p[0], ...p[1]);
                        break;
                    case 1:
                        faces.push(...p[2], ...p[3], ...p[6], ...p[2], ...p[6], ...p[7]);
                        break;
                    case 2:
                        faces.push(...p[1], ...p[0], ...p[3], ...p[1], ...p[3], ...p[2]);
                        break;
                    case 3:
                        faces.push(...p[7], ...p[6], ...p[4], ...p[7], ...p[4], ...p[5]);
                        break;
                }
                uv.push(0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1);
            }
            positionData = positionData.concat(faces);
        }
    }
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positionData), 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
    let mesh = new THREE.Mesh(geometry);
    return mesh;
}
export function prepareLevels(level) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(level);
        let segments = level.segments;
        for (let i = 0; i < segments.length; i++) {
            levelMeshes.push(generateSegmentMesh(segments[i]));
        }
        const loader = new THREE.TextureLoader();
        const texture = yield loader.loadAsync(level.wallTexturePath);
        texture.colorSpace = THREE.SRGBColorSpace;
        levelMaterial = new THREE.MeshBasicMaterial({
            map: texture
        });
    });
}
export function updateCamera(player) {
    camera.position.x = player.position.x;
    camera.position.z = player.position.y;
    camera.rotation.y = -player.position.heading / 180 * Math.PI;
}
export function updateChunks(level, player) {
    let playerChunkPos = { x: Math.floor(player.position.x / 10), y: Math.floor(player.position.y / 10) };
    if (playerChunkPos.x === prevPlayerChunkPos.x && playerChunkPos.y === prevPlayerChunkPos.y)
        return;
    if (walls) {
        scene.remove(walls);
    }
    console.log("I loaded for once");
    console.log(player);
    walls = new THREE.Group();
    walls.name = "wall";
    walls.position.x = playerChunkPos.x * 10;
    walls.position.z = playerChunkPos.y * 10;
    prevPlayerChunkPos = playerChunkPos;
    for (let r = -Math.floor(RENDER_DISTANCE / 2); r <= Math.floor(RENDER_DISTANCE / 2); r++) {
        let row = playerChunkPos.y + r;
        if (row < 0)
            row += level.height;
        if (row >= level.height)
            row -= level.height;
        for (let c = -Math.floor(RENDER_DISTANCE / 2); c <= Math.floor(RENDER_DISTANCE / 2); c++) {
            let column = playerChunkPos.x + c;
            if (column < 0)
                column += level.width;
            if (column >= level.width)
                column -= level.width;
            let mesh = generateSegmentMesh(level.segments[level.level[row][column]]);
            mesh.position.x = c * 10;
            mesh.position.z = r * 10;
            mesh.material = levelMaterial;
            walls.add(mesh);
        }
    }
    scene.add(walls);
    console.log(walls);
}
export function addEntity(entity) {
    if (entity instanceof Array) {
        for (let x in entity) {
            scene.add(entity[x].object);
        }
    }
    else if (entity instanceof Entity) {
        scene.add(entity.object);
    }
}
