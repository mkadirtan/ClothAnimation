import {
    AmmoJSPlugin, CubeTexture,
    Engine, HDRCubeTexture,
    Scene, Vector3, Color4
} from "@babylonjs/core";
export const canvas = document.getElementById("renderCanvas");
export let engine;
if (canvas instanceof HTMLCanvasElement) {
    engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
    });
}

export const scene = new Scene(engine);
scene.environmentTexture = new HDRCubeTexture("src/textures/studio_small_01_1k.hdr",scene,128, false, true, false, true);
scene.clearColor = new Color4(0.7, 0.4, 0.3)

scene.enablePhysics(new Vector3(0, -1, 0), new AmmoJSPlugin(true, Ammo));

window.addEventListener("resize", function () {
    engine.resize();
});
