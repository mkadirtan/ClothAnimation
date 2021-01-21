import {engine, scene} from "./scene";
import {pointLight, directionalLight} from "./helpers/lights";
import {camera} from "./helpers/camera";
import {box1, box2, box3, box4} from "./models/box";
import {cloth} from "./models/cloth";
import PerlinNoise3d from "perlin-noise-3d";
import {Color3, Color4, Vector3} from "@babylonjs/core";
import {TweenLite} from "gsap/dist/gsap";

// Cloth tension
const offset = 1;

box1.position.y += offset;
box2.position.y += offset;
box1.position.x -= offset / 3;
box2.position.x += offset / 3;

// Randomness
/*box1.position.z += 2;
box2.position.z += 2;

setTimeout(() => {
    box1.position.z -= 2;
    box2.position.z -= 2;
}, 1000)*/

// Hide boxes
const boxes = [box1, box2, box3, box4];
boxes.forEach(box => {
    box.isVisible = false;
})

// Save initial position of boxes
const initialPosition1 = box1.position.clone();
const initialPosition2 = box2.position.clone();
const initialPosition3 = box3.position.clone();
const initialPosition4 = box4.position.clone();
const initialPositions = [
    initialPosition1,
    initialPosition2,
    initialPosition3,
    initialPosition4
]

// Initial target position of boxes
const targetPosition1 = box1.position.clone();
const targetPosition2 = box2.position.clone();
const targetPosition3 = box3.position.clone();
const targetPosition4 = box4.position.clone();
const targetPositions = [
    targetPosition1,
    targetPosition2,
    targetPosition3,
    targetPosition4
]

// Camera settings
const rotation = JSON.parse("{\"x\":-0.37799809749480523,\"y\":3.1574913154339828,\"z\":1.5707963267948966}");
const position = JSON.parse("{\"x\":0.07271264870386993,\"y\":-4.328710076664636,\"z\":7.187777049860184}");

camera.position = new Vector3(position.x, position.y, position.z - 0.7);
camera.rotation = new Vector3(rotation.x, rotation.y, rotation.z);

//camera.setTarget(cloth.position);
//camera.rotation.z += Math.PI / 2;

// Noise generators
const noise1 = new PerlinNoise3d();
const noise2 = new PerlinNoise3d();
noise1.noiseSeed(504);
noise2.noiseSeed(120);

// Global time initialization
let time = 0;

const button = document.getElementById("animationButton");

const controller = {progress: 0, enabled: true, m: 2.5};

let progress1 = 0;
let progress2 = 0;
let index = 0;
let colors = [
    new Color3(0.216, 0.31, 0.647),
    new Color3(0.537, 0.824, 0.365),
    new Color3(0.69, 0.024, 0.137),
    new Color3(0.82, 0.69, 0.412),
    new Color3(0.831, 0.635, 0.678)

]

let sceneColors = colors.map(color => { return new Color3(1 -  0.3/color.r, 1-0.3/color.g, 1-0.3/color.b)});
const initialColor = new Color3(1-colors[0].r, 1-colors[0].g,1-colors[0].b)
cloth.material.albedoColor = colors[0];
scene.clearColor = new Color4(1-colors[0].r*0.5,1-colors[0].g*0.5,1-colors[0].b*0.5)
//scene.clearColor = new Color4(0.7, 0.4, 0.3)


function animate() {
    const {progress} = controller;

    const currentR = Math.abs(colors[index].r - (colors[index-1].r) * progress / 100);
    const currentG = Math.abs(colors[index].g - (colors[index-1].g) * progress / 100);
    const currentB = Math.abs(colors[index].b - (colors[index-1].b) * progress / 100);

    scene.clearColor = new Color4(1-currentR*0.5, 1-currentG*0.5, 1-currentB*0.5);
    cloth.material.albedoColor = new Color3(currentR, currentG, currentB);

    if(progress > 0 && progress < 20){
        progress1 = progress * 2.5;
    }

    if(progress > 30 && progress < 50){
        progress2 = (progress - 30) * 2.5;
    }

    if(progress > 50 && progress < 70){
        progress1 = (progress - 50) * 2.5;
    }

    if(progress > 80 && progress < 100){
        progress2 = (progress - 80) * 2.5;
    }
    boxes.forEach((box, index) => {
        let _progress = 0;
        if(index === 0 || index === 1){
            _progress = progress1;
        } else {
            _progress = progress2;
        }
        const quat = box.rotationQuaternion;
        const currentRotation = quat.toEulerAngles().y;

        const targetRotation = _progress < 50 ? _progress / 50 * Math.PI : (100 - _progress) / 50  * -Math.PI;
        if(targetRotation < 0){
            if(currentRotation > 0){
                box.rotateAround(new Vector3(0, box.position.y, box.position.z), Vector3.Up(), 0.1);
            } else {
                box.rotateAround(new Vector3(0, box.position.y, box.position.z), Vector3.Up(),targetRotation - currentRotation);
            }
        } else {
            box.rotateAround(Vector3.Zero(), Vector3.Up(), targetRotation - currentRotation);
        }
    })
}

button.onclick = function () {
    if(controller.enabled) {
        index += 1;
        controller.enabled = false;
        controller.m = 0;
        if (controller.progress < 1) {
            TweenLite.to(controller, 3.5, {
                progress: 50, onUpdate: animate, onComplete: () => {
                    controller.progress = 50;

                    TweenLite.to(controller, 10, { m: 2.5 });
                    boxes.forEach((box, index) => {
                        targetPositions[index] = box.position.clone();

                    })

                    controller.enabled = true;
                }
            });
        } else {
            TweenLite.to(controller, 3.5, {
                progress: 100, onUpdate: animate, onComplete: () => {
                    controller.progress = 0;

                    TweenLite.to(controller, 10, { m: 2.5 });
                    boxes.forEach((box, index) => {
                        targetPositions[index] = box.position.clone();
                    })
                    controller.enabled = true;
                }
            });
        }
    }
}


engine.runRenderLoop(function () {
    if(controller.enabled) {
        // Prevent crash on long runs.
        if (time > 1000) {
            time = 0;
        }

        // Multiplier for box movements
        const m = controller.m;

        // Simulation speed multiplier
        const s = 1.2;

        // Global time for boxes
        time += engine.getDeltaTime() / 3400 * s;


        // Step calculators
        const x1 = (0.5 - noise1.get(time * 0.4)) * 0.7;
        const y1 = (0.5 - noise1.get(x1, time * 0.5)) * 0.4 + Math.sin(time) * 0.5;
        const z1 = 0.5 - noise1.get(y1, time * 2);

        const x2 = (0.5 - noise2.get(time * 0.4)) * 0.7;
        const y2 = (0.5 - noise2.get(x2, time * 0.5)) * 0.4 + Math.sin(time + 100) * 0.5;
        const z2 = 0.5 - noise2.get(y2, time * 2);

        // Update box positions
        box1.position.x = targetPositions[0].x;
        box1.position.y = targetPositions[0].y + (y1 * m);
        box1.position.z = targetPositions[0].z + (z1 * m);

        box2.position.x = targetPositions[1].x;
        box2.position.y = targetPositions[1].y + (y2 * m);
        box2.position.z = targetPositions[1].z + (z2 * m);

        box3.position.x = targetPositions[2].x;
        box3.position.y = targetPositions[2].y + (y2 / 1.5 * m);
        box3.position.z = targetPositions[2].z + (z2 / 1.5 * m);

        box4.position.x = targetPositions[3].x;
        box4.position.y = targetPositions[3].y + (y1 / 1.5 * m);
        box4.position.z = targetPositions[3].z + (z1 / 1.5 * m);
    }
    // Render
    scene.render();
});