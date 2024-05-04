import { $ } from "../utilities.js";
import * as THREE from "three";
let renderer, scene, camera;
export function initRendering() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("container").id.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const light = new THREE.PointLight();
    light.position.y = 1;
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.rotation.x += 45;
    cube.rotation.y += 45;
    scene.add(cube);
    scene.add(light);
    camera.position.z = 5;
    renderer.render(scene, camera);
}
export function renderScene() {
}
