import {FreeCamera, Vector3} from "@babylonjs/core";
import {scene, canvas} from "../scene";

export const camera = new FreeCamera("camera", new Vector3(0,0,8), scene);
camera.attachControl(canvas, true);
