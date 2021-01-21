import { scene } from "../scene";
import * as config from "../config.json";
import {Color3, MeshBuilder, PBRMaterial, PhysicsImpostor, Quaternion, StandardMaterial} from "@babylonjs/core";

export const box1 = MeshBuilder.CreateBox("box1", {width: 0.5, depth: 0.5, height:0.5}, scene);
export const box2 = MeshBuilder.CreateBox("box2", {width: 0.5, depth: 0.5, height:0.5}, scene);
export const box3 = MeshBuilder.CreateBox("box3", {width: 0.5, depth: 0.5, height:0.5}, scene);
export const box4 = MeshBuilder.CreateBox("box4", {width: 0.5, depth: 0.5, height:0.5}, scene);
//export const box5 = MeshBuilder.CreateBox("box4", {width: 2, depth: 2, height:2}, scene);
//export const sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene)

//sphere.position.z += 1.5;
//box5.position.z -= 1.5;
//box5.isVisible = false;
//sphere.isVisible = false;

box1.position.y += config.cloth.height / 2;
box1.position.x -= config.cloth.width / 2;

box2.position.y += config.cloth.height / 2;
box2.position.x += config.cloth.width / 2;

box3.position.y -= config.cloth.height / 2;
box3.position.x += config.cloth.width / 2;

box4.position.y -= config.cloth.height / 2;
box4.position.x -= config.cloth.width / 2;

box1.physicsImpostor = new PhysicsImpostor(box1, PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
box3.physicsImpostor = new PhysicsImpostor(box3, PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
box4.physicsImpostor = new PhysicsImpostor(box4, PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
//box5.physicsImpostor = new PhysicsImpostor(box5, PhysicsImpostor.BoxImpostor, {mass: 0}, scene);
//sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, {mass: 0}, scene);