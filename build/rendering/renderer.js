import { $, DX, DY } from "../utilities.js";
import * as THREE from "three";
const RENDER_DISTANCE = 3;
let renderer, scene, camera;
let levelMeshes;
export function initRendering(level) {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("container").id.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
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
    let mesh = generateLevelMesh(level.segments[0]);
    scene.add(mesh);
    camera.position.z = 5;
    camera.position.y = 3;
    camera.position.x = 5;
    camera.rotation.x = -Math.PI / 2 + Math.PI / 8;
    renderer.render(scene, camera);
    console.log(mesh);
}
function generateLevelMesh(segment) {
    let positionData = [];
    let indices = [];
    let data = segment.data;
    let chunk = 0;
    for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
            let positions = [
                c, 0, r,
                c, 1, r,
                c, 1, r + 1,
                c, 0, r + 1,
                c + 1, 0, r,
                c + 1, 1, r,
                c + 1, 0, r + 1,
                c + 1, 1, r + 1
            ];
            let indexes = [];
            positionData = positionData.concat(positions);
            for (let i = 0; i < 4; i++) {
                //X, Z
                let newx = c + DX[i];
                let newy = r + DY[i];
                if (!(newx < 0 || newy < 0 || newx >= 10 || newy >= 10))
                    if (data[newy][newx] == 1)
                        continue;
                switch (i) {
                    case 0:
                        indexes.push(5, 4, 1, 1, 4, 0);
                        break;
                    case 1:
                        indexes.push(2, 6, 7, 2, 3, 6);
                        break;
                    case 2:
                        indexes.push(1, 0, 3, 1, 3, 2);
                        break;
                    case 3:
                        indexes.push(7, 6, 4, 7, 4, 5);
                        break;
                }
            }
            for (const i in indexes) {
                indexes[i] += chunk;
            }
            indices = indices.concat(indexes);
            chunk += 8;
        }
    }
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positionData), 3));
    geometry.setIndex(indices);
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}
export function prepareLevels(level) {
    let segments = level.segments;
    for (let i = 0; i < segments.length; i++) {
        levelMeshes.push(generateLevelMesh(segments[i]));
    }
}
export function renderScene() {
}
