var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2.5, 100, BABYLON.Vector3.Zero(), scene);

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, -1, 0), scene);

    var cover = new BABYLON.StandardMaterial("cover", scene);
    cover.diffuseTexture = new BABYLON.Texture("colors.png");
    cover.backFaceCulling = false;
    //cover.wireframe = true;

    var pbr = new BABYLON.PBRSpecularGlossinessMaterial("pbr", scene);
    pbr.diffuseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
    pbr.specularColor = new BABYLON.Color3(1.0, 0.766, 0.336);
    pbr.backFaceCulling = false
    pbr.glossiness = 1.0; // Let the texture controls the value
    pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
    pbr.specularGlossinessTexture = new BABYLON.Texture("/textures/sg.png", scene);

    var wood= new BABYLON.StandardMaterial("wood", scene);
    wood.diffuseTexture = new BABYLON.Texture("textures/crate.png");

    scene.enablePhysics(new BABYLON.Vector3(0, -1, 0), new BABYLON.AmmoJSPlugin(true));

    var ground = BABYLON.MeshBuilder.CreateBox("ground", {width: 80, depth: 80, height:1}, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 0}, scene);

    var arm = BABYLON.MeshBuilder.CreateBox("arm", {width: 40, depth: 1, height: 1}, scene);
    arm.position = new BABYLON.Vector3(-30, 27.5, -9);
    arm.material = wood;
    arm.physicsImpostor = new BABYLON.PhysicsImpostor(arm, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, friction: 0, restitution: 0}, scene);

    var cloth = BABYLON.MeshBuilder.CreateGround("cloth", {width: 16, height: 18, subdivisions: 20}, scene);
    cloth.position.x = -38;
    cloth.position.y = 17;
    cloth.position.z = -9;
    cloth.rotation.x = Math.PI / 2
    cloth.material = pbr;

    var positions = cloth.getVerticesData(BABYLON.VertexBuffer.PositionKind);

    cloth.physicsImpostor =  new BABYLON.PhysicsImpostor(cloth, BABYLON.PhysicsImpostor.ClothImpostor, { mass: 0, friction: 0, restitution: 0,  margin: 0.15}, scene);
    cloth.physicsImpostor.velocityIterations = 10;
    cloth.physicsImpostor.positionIterations = 10;
    cloth.physicsImpostor.stiffness = 0.6;

    cloth.physicsImpostor.addAnchor(arm.physicsImpostor, 0, 0, 1);

    let i = 0;
    let f = (imp)=>{
        if(i > 100){
            arm.position.y = 1;
            imp.forceUpdate();
            imp.setLinearVelocity(new BABYLON.Vector3(0,0,0));
        } else {
            arm.position.y += 2*Math.sin(i*0.04);
            imp.setLinearVelocity(new BABYLON.Vector3(0,1,0));
            imp.forceUpdate();
            i++;
        }
    }
    let r = arm.physicsImpostor.registerBeforePhysicsStep(f)

    return scene;