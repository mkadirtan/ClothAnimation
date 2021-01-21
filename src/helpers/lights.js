import {DirectionalLight, Color3, PointLight, Vector3} from "@babylonjs/core";
import {scene} from "../scene";

const diffuseColor = new Color3(1, 0.98, 0.97);
const specularColor = new Color3(1, 0.98, 0.99);

export const pointLight = new PointLight("pointLight", new Vector3(4, 4, 4), scene);
pointLight.diffuse = diffuseColor
pointLight.specular = specularColor
pointLight.intensity = 0.3;

export const directionalLight = new DirectionalLight("dir01", new Vector3(0.2, -1, -0.3), scene);
directionalLight.diffuse = diffuseColor;
directionalLight.specular = new Color3.Black();
directionalLight.intensity = 0.4;