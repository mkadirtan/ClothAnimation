import {scene} from "../scene";
import {box1, box2, box3, box4} from "./box";
import * as config from "../config.json";
import {
    PBRMaterial,
    PhysicsImpostor,
    Texture,
    Color3,
    MeshBuilder
} from "@babylonjs/core";

export const cloth = MeshBuilder.CreateGround("cloth", {
    width: config.cloth.width,
    height: config.cloth.height,
    subdivisions: 32
}, scene)

cloth.rotation.x = Math.PI / 2;

const mat = new PBRMaterial("pbr", scene);

mat.alpha = 0.15;
mat.alphaMode = 3;
mat.albedoColor = new Color3.Yellow();
mat.environmentIntensity = 0.35
mat.sheen.isEnabled = false;
mat.metallic = 0;
mat.albedoTexture = new Texture("src/textures/Fabric001_2K_Color.jpg", scene);
mat.backFaceCulling = false;

cloth.material = mat;

cloth.physicsImpostor = new PhysicsImpostor(cloth, PhysicsImpostor.ClothImpostor, {
    mass: 0,
    damping: 0.03,
    stiffness: 0.9,
    pressure: 100000
}, scene);

cloth.physicsImpostor.addAnchor(box1.physicsImpostor, 0, 0, 0.2, true);
cloth.physicsImpostor.addAnchor(box2.physicsImpostor, 1, 0, 0.2, true);
cloth.physicsImpostor.addAnchor(box3.physicsImpostor, 1, 1, 0.01, true);
cloth.physicsImpostor.addAnchor(box4.physicsImpostor, 0, 1, 0.01, true);