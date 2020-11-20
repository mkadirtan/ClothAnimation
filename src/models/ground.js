import {PhysicsImpostor, MeshBuilder} from "@babylonjs/core";
import {scene} from "../scene";

export const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10, subdivisionsX: 2}, scene);
ground.rotation.x = Math.PI / 2;
