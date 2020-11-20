import {engine, scene} from "./scene";
import {pointLight, directionalLight, directionalLight2} from "./helpers/lights";
import {camera} from "./helpers/camera";
import {box1,box2,box3,box4, box5, sphere} from "./models/box";
import {cloth} from "./models/cloth";
import PerlinNoise3d from "perlin-noise-3d";
import {MeshBuilder, PhysicsImpostor, Quaternion, SceneLoader} from "@babylonjs/core";
import {GLTF2} from "@babylonjs/loaders";

let company = null;
SceneLoader.AppendAsync("src/models/", "company-text.glb", scene).then(
    _scene => {
        company = scene.getMeshByName("__root__");
        company.position.x = 2.5;
        company.position.z = 5.5;

        company.addRotation(-Math.PI / 2, 0,0);

        //const companyBox = MeshBuilder.CreateBox("companyBox", )
        company.physicsImpostor = new PhysicsImpostor(company, PhysicsImpostor.BoxImpostor, {mass:0}, scene)
        company.position.z -= 3;
        window.company = company;
    }
)

/*

passionLinesMesh.isVisible = true;
box.isVisible = false;

tl.to(time, { current: 100, duration: 15, ease: "linear", onUpdate: ()=>{
    box.position = passion.getPointAt(time.current / 100);
    //const r = passion.getBinormalAt(time.current / 100);
    box.rotationQuaternion = Quaternion.FromEulerVector(new Vector3(0, Math.PI * time.current / 100, 0));
}});

window.tl = tl;
//tl.play();
window.box = box;
window.scene = scene;
window.Quaternion = Quaternion;
*/

camera.setTarget(cloth.position);
window.box1 = box1;
window.box2 = box2;
window.box3 = box3;
window.box4 = box4;
window.box5 = box5;

box1.position.y -= 0.5;
box2.position.y -= 0.5;
box3.position.y += 0.5;
box4.position.y += 0.5;

box1.position.z += 2;
box2.position.z += 2;

setTimeout(()=>{
    box1.position.z -= 2;
    box2.position.z -= 2;
}, 1000)

let time = 0;
const boxes = [box1, box2, box3, box4];
boxes.forEach(box => box.isVisible = false)

const initialPosition1 = box1.position.clone();
const initialPosition2 = box2.position.clone();
const initialPositionCamera = camera.position.clone();

const noise1 = new PerlinNoise3d();
const noise2 = new PerlinNoise3d();
noise1.noiseSeed(504);
noise2.noiseSeed(120);

let flagBox = true;
let flagSphere = true;
window.camera = camera;

engine.runRenderLoop(function () {
    time += engine.getDeltaTime() / 3400;

    const m = 2;

    const x1 = 0.5 - noise1.get(time * 1.5);
    const y1 = 0.5 - noise1.get(x1, time * 1.2);
    const z1 = 0.5 - noise1.get(y1, time * 2);

    box1.position.x = initialPosition1.x + x1 * m;
    box1.position.y = initialPosition1.y + y1 * m + Math.sin(1.6*time) / 2;
    box1.position.z = initialPosition1.z + z1 * m;

    const x2 = 0.5 - noise2.get(time * 1.2);
    const y2 = 0.5 - noise2.get(x2, time * 1.4);
    const z2 = 0.5 - noise2.get(y2, time * 2.5);

    box2.position.x = initialPosition2.x + x2 * m;
    box2.position.y = initialPosition2.y + y2 * m + Math.sin(2 * time + 100) / 2;
    box2.position.z = initialPosition2.z + z2 * m;

    if(box5.position.z > 3){
        flagBox = false;
    } else if(box5.position.z < -3) {
        flagBox = true;
    }

    box5.position.z = flagBox ? box5.position.z + 0.018 : box5.position.z - 0.018;
    box5.position.x = 3 + 3*(0.5 - noise1.get(time/2 + 100));
    box5.position.y = 4*(0.5 - noise2.get(time/2 + 100));

    if(sphere.position.z > 2){
        flagSphere = false;
    } else if(sphere.position.z < -2.5) {
        flagSphere = true;
    }

    sphere.position.z = flagBox ? sphere.position.z + 0.010 : sphere.position.z - 0.018;
    sphere.position.x = -3 + 7*(0.5 - noise1.get(time/2 + 100));
    sphere.position.y = 2 + 4*(0.5 - noise2.get(time + 100));


    const xC = 0.5 - noise1.get(time * 0.2);
    const yC = 0.5 - noise1.get(xC, time * 0.1);
    const mC = 1.5;

    camera.position.x = initialPositionCamera.x + xC * mC;
    camera.position.y = initialPositionCamera.y + yC * mC;

    scene.render();
});