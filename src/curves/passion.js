import {curves} from "./passion.json"
import {Curve3, Vector3, Mesh, Path3D} from "@babylonjs/core";
import {scene} from "../scene";

const _points = curves[0].points.map(data => {
    const { coord: xyz }= data;
    return new Vector3.FromArray(xyz)
})

const _curve3 = Curve3.CreateCatmullRomSpline(_points, 30, true)

export const passionLinesMesh = Mesh.CreateLines("curve", _curve3.getPoints(), scene, true);
passionLinesMesh.scaling = new Vector3(8,8,8);
passionLinesMesh.position.y += 4;
passionLinesMesh.bakeCurrentTransformIntoVertices();
passionLinesMesh.color.g = 0;
passionLinesMesh.isVisible = true;

const pointData = passionLinesMesh.getVerticesData("position");
let points = [];

for(let i = 0; i < pointData.length; i += 3){
    points.push(
        new Vector3.FromArray(pointData, i)
    )
}

export const passion = new Path3D(points,null,true, true);
