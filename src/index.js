import {engine, scene} from "./scene";
import {pointLight, directionalLight} from "./helpers/lights";
import {camera} from "./helpers/camera";
import {box1, box2, box3, box4} from "./models/box";
import {cloth} from "./models/cloth";
import PerlinNoise3d from "perlin-noise-3d";
import {Vector3} from "@babylonjs/core";

camera.setTarget(cloth.position);
window.box1 = box1;
window.box2 = box2;
window.box3 = box3;
window.box4 = box4;
//window.box5 = box5;

const offset = 1;

box1.position.y += offset;
box2.position.y += offset;
box3.position.y += 1;
box4.position.y += 1;
box3.position.y -= offset;
box4.position.y -= offset;

box1.position.x -= offset / 3;
box2.position.x += offset / 3;
//box3.position.x += offset / 2;
//box4.position.x -= offset / 2;

box1.position.z += 2;
box2.position.z += 2;

setTimeout(()=>{
    box1.position.z -= 2;
    box2.position.z -= 2;
}, 1000)

let time = 0;
const boxes = [box1, box2, box3, box4];
boxes.forEach(box => box.isVisible = false)
window.boxes = {box1, box2, box3, box4};

const targetPosition1 = box1.position.clone();
const targetPosition2 = box2.position.clone();
const targetPosition3 = box3.position.clone();
const targetPosition4 = box4.position.clone();

window.targetPosition1 = targetPosition1;

const targetPositionCamera = camera.position.clone();

const noise1 = new PerlinNoise3d();
const noise2 = new PerlinNoise3d();
noise1.noiseSeed(504);
noise2.noiseSeed(120);

//let flagBox = true;
//let flagSphere = true;
window.camera = camera;
//camera.rotation.z += Math.PI / 2;

const rotation = JSON.parse("{\"x\":-0.37799809749480523,\"y\":3.1574913154339828,\"z\":1.5707963267948966}");
const position = JSON.parse("{\"x\":0.07271264870386993,\"y\":-4.328710076664636,\"z\":7.187777049860184}");

camera.position = new Vector3(position.x, position.y, position.z);
camera.rotation = new Vector3(rotation.x, rotation.y, rotation.z);


engine.runRenderLoop(function () {
    time += engine.getDeltaTime() / 3400 / 1.5;

    const m = 3;

    const x1 = (0.5 - noise1.get(time * 0.4)) * 0.7;
    const y1 = (0.5 - noise1.get(x1, time * 0.5)) * 0.4 + Math.sin(time) * 0.5;
    const z1 = 0.5 - noise1.get(y1, time * 2);

    const x2 = (0.5 - noise2.get(time * 0.4)) * 0.7;
    const y2 = (0.5 - noise2.get(x2, time * 0.5)) * 0.4 + Math.sin(time + 100) * 0.5;
    const z2 = 0.5 - noise2.get(y2, time * 2);

    box1.position.x = targetPosition1.x// + (x1 * m);
    box1.position.y = targetPosition1.y + (y1 * m);
    box1.position.z = targetPosition1.z + (z1 * m);

    box2.position.x = targetPosition2.x// + (x2 * m);
    box2.position.y = targetPosition2.y + (y2 * m);
    box2.position.z = targetPosition2.z + (z2 * m);

    box3.position.x = targetPosition3.x// + (x2 * m / 1.5 * 0.2);
    box3.position.y = targetPosition3.y + (y2 * m / 1.5);
    box3.position.z = targetPosition3.z + (z2 * m / 1.5);

    box4.position.x = targetPosition4.x// + (x1 * m / 1.5 * 0.2);
    box4.position.y = targetPosition4.y + (y1 * m / 1.5);
    box4.position.z = targetPosition4.z + (z1 * m / 1.5);

    scene.render();
});