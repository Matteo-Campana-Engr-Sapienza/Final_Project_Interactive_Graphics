  var moveSphereInterval = 0;

  var createScene = function() {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    //scene.enablePhysics();
    scene.checkCollisions = true;
    scene.collisionsEnabled = true;

    //Gravity and Collisions Enabled
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    scene.collisionsEnabled = true;

    /*
      var light = new BABYLON.DirectionalLight(
        "Omni",
        new BABYLON.Vector3(-2, -5, 2),
        scene
      );
      light.intensity = 0.0;
    */

    //Add the camera, to be shown as a cone and surrounding collision volume
    var camera = new BABYLON.UniversalCamera(
      "MyCamera",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    camera.minZ = 0.005;
    camera.maxZ = 50.0;
    camera.attachControl(canvas, true);
    camera.speed = 0.007;
    camera.angularSpeed = 0.005;
    camera.angle = Math.PI / 2;
    camera.direction = new BABYLON.Vector3(
      Math.cos(camera.angle),
      0,
      Math.sin(camera.angle)
    );


    //Light direction is directly down from a position one unit up, slow decay
    var flashlight = new BABYLON.SpotLight("flashlight", new BABYLON.Vector3(0.0, 0.0, 0.0), new BABYLON.Vector3(0, 0, 0.5), Math.PI / 5.5, 10, scene);
    flashlight.setEnabled(true);
    flashlight.diffuse = new BABYLON.Color3(238 / 256, 177 / 256, 66 / 256);
    flashlight.specular = new BABYLON.Color3(238 / 256, 177 / 256, 66 / 256);
    flashlight.range = 20;
    flashlight.intensity = 0.7;
    flashlight.parent = camera;

    //Add viewCamera that gives first person shooter view
    var viewCamera = new BABYLON.UniversalCamera(
      "viewCamera",
      new BABYLON.Vector3(0, 3, -3),
      scene
    );
    viewCamera.parent = camera;
    viewCamera.setTarget(new BABYLON.Vector3(0, -0.0001, 1));

    //1th person
    scene.activeCameras.push(camera);

    //3rd person and double screent
    var test_flag = false;
    if (test_flag) {
      camera.viewport = new BABYLON.Viewport(0, 0.5, 1.0, 0.5);
      scene.activeCameras.push(viewCamera);
      viewCamera.viewport = new BABYLON.Viewport(0, 0, 1.0, 0.5);
    }

    //Dummy camera as cone
    var cone = BABYLON.MeshBuilder.CreateCylinder(
      "dummyCamera", { diameterTop: 0.01, diameterBottom: 0.2, height: 0.2 },
      scene
    );
    cone.parent = camera;
    cone.rotation.x = Math.PI / 2;

    /* Set Up Scenery */

    var ground_width = 400.0;
    var groung_heigth = ground_width;

    var border_limit = ground_width - 50.0;

    //Ground
    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground", { width: ground_width, height: groung_heigth },
      scene
    );
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material.backFaceCulling = false;

    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.png", scene);
    groundMaterial.diffuseTexture.uScale = 400;
    groundMaterial.diffuseTexture.vScale = 400;
    groundMaterial.specularColor = new BABYLON.Color3(22 / 256, 66 / 256, 7 / 256);
    //groundMaterial.emissiveColor = new BABYLON.Color3(22 / 256, 66 / 256, 7 / 256);

    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.checkCollisions = true;


    // Invisible borders
    var border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
    border0.scaling = new BABYLON.Vector3(1, border_limit, border_limit);
    border0.position.x = -border_limit / 2;
    border0.checkCollisions = true;
    border0.isVisible = false;

    var border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
    border1.scaling = new BABYLON.Vector3(1, border_limit, border_limit);
    border1.position.x = border_limit / 2;
    border1.checkCollisions = true;
    border1.isVisible = false;

    var border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
    border2.scaling = new BABYLON.Vector3(border_limit, border_limit, 1);
    border2.position.z = border_limit / 2;
    border2.checkCollisions = true;
    border2.isVisible = false;

    var border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
    border3.scaling = new BABYLON.Vector3(border_limit, border_limit, 1);
    border3.position.z = -border_limit / 2;
    border3.checkCollisions = true;
    border3.isVisible = false;

    var lowerGround = ground.clone("lowerGround");
    lowerGround.scaling.x = 4;
    lowerGround.scaling.z = 4;
    lowerGround.position.y = -16;
    lowerGround.material = ground.material.clone("lowerMat");
    lowerGround.material.diffuseColor = new BABYLON.Color3(0, 1, 0);

    // Fog
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.07;
    scene.fogColor = scene.clearColor;

    // Skybox
    /*
      var skybox = BABYLON.Mesh.CreateBox("skyBox", ground_width, scene);
      var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
        "textures/dark_forest_skybox/dark_forest",
        scene
      );
      skyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.disableLighting = true;
      skybox.material = skyboxMaterial;
      skybox.infiniteDistance = true;
    */

    var randomNumber = function(min, max) {
      if (min == max) {
        return min;
      }
      var random = Math.random();
      return random * (max - min) + min;
    };


    //-------------------------------------------------------------- Loading trees --------------------------------------------------------------//

    var trees = []

    const pine_tree_01_num = 1500;
    const pine_tree_02_num = 1000;
    const pine_tree_03_num = 1000;

    const dead_tree_01_num = 500;
    const dead_tree_02_num = 500;

    tree_min_angle = 0;
    tree_max_angle = 360 * Math.PI / 180
    tree_max_x = ground_width / 2;
    tree_max_z = ground_width / 2;
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "pine_tree_01.glb", scene, function(meshes, particleSystems, skeletons) {

      meshes[1].material.opacityTexture = null;
      meshes[1].material.backFaceCulling = false;
      meshes[1].isVisible = true;
      meshes[1].checkCollisions = true;
      meshes[1].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
      meshes[1].position.x = 2;

      for (var i = 1; i < pine_tree_01_num; i++) {
        var newTree = meshes[1].clone("pine_tree_01_" + i);
        //var newTree = meshes[1].createInstance("pine_tree_01_" + i);
        trees.push(newTree);
        var tree_x = randomNumber(-tree_max_x, tree_max_x);
        var tree_z = randomNumber(-tree_max_z, tree_max_z);
        while (Math.abs(tree_x) < 5) {
          tree_x = randomNumber(-tree_max_x, tree_max_x);
        }
        while (Math.abs(tree_z) < 5) {
          tree_z = randomNumber(-tree_max_z, tree_max_z);
        }
        newTree.position = new BABYLON.Vector3(
          tree_x,
          ground.getHeightAtCoordinates(0, 0),
          tree_z
        );
        newTree.rotate.y = randomNumber(tree_min_angle, tree_max_angle);
        newTree.checkCollisions = true;
        newTree.freezeWorldMatrix();
      }
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "pine_tree_02.glb", scene, function(meshes, particleSystems, skeletons) {

      meshes[1].material.opacityTexture = null;
      meshes[1].material.backFaceCulling = false;
      meshes[1].isVisible = true;
      meshes[1].checkCollisions = true;
      meshes[1].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
      meshes[1].position.x = 2;


      for (var i = 1; i < pine_tree_02_num; i++) {
        var newTree = meshes[1].clone("pine_tree_02_" + i);
        //var newTree = meshes[1].createInstance("pine_tree_02_" + i);
        trees.push(newTree);
        var tree_x = randomNumber(-tree_max_x, tree_max_x);
        var tree_z = randomNumber(-tree_max_z, tree_max_z);
        while (Math.abs(tree_x) < 5) {
          tree_x = randomNumber(-tree_max_x, tree_max_x);
        }
        while (Math.abs(tree_z) < 5) {
          tree_z = randomNumber(-tree_max_z, tree_max_z);
        }
        newTree.position = new BABYLON.Vector3(
          tree_x,
          ground.getHeightAtCoordinates(0, 0),
          tree_z
        );
        newTree.rotate.y = randomNumber(tree_min_angle, tree_max_angle);
        newTree.checkCollisions = true;
        newTree.freezeWorldMatrix();
      }
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "pine_tree_03.glb", scene, function(meshes, particleSystems, skeletons) {

      meshes[1].material.opacityTexture = null;
      meshes[1].material.backFaceCulling = false;
      meshes[1].isVisible = true;
      meshes[1].checkCollisions = true;
      meshes[1].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
      meshes[1].position.x = 2;


      for (var i = 1; i < pine_tree_03_num; i++) {
        var newTree = meshes[1].clone("pine_tree_03_" + i);
        //var newTree = meshes[1].createInstance("pine_tree_03_" + i);
        trees.push(newTree);
        var tree_x = randomNumber(-tree_max_x, tree_max_x);
        var tree_z = randomNumber(-tree_max_z, tree_max_z);
        while (Math.abs(tree_x) < 5) {
          tree_x = randomNumber(-tree_max_x, tree_max_x);
        }
        while (Math.abs(tree_z) < 5) {
          tree_z = randomNumber(-tree_max_z, tree_max_z);
        }
        newTree.position = new BABYLON.Vector3(
          tree_x,
          ground.getHeightAtCoordinates(0, 0),
          tree_z
        );
        newTree.rotate.y = randomNumber(tree_min_angle, tree_max_angle);
        newTree.checkCollisions = true;
        newTree.freezeWorldMatrix();
      }
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "dead_tree_01.glb", scene, function(meshes, particleSystems, skeletons) {

      meshes[1].material.opacityTexture = null;
      meshes[1].material.backFaceCulling = false;
      meshes[1].isVisible = true;
      meshes[1].checkCollisions = true;
      meshes[1].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
      meshes[1].position.x = 2;


      for (var i = 1; i < dead_tree_01_num; i++) {
        var newTree = meshes[1].clone("dead_tree_01_" + i);
        //var newTree = meshes[1].createInstance("dead_tree_01_" + i);
        trees.push(newTree);
        var tree_x = randomNumber(-tree_max_x, tree_max_x);
        var tree_z = randomNumber(-tree_max_z, tree_max_z);
        while (Math.abs(tree_x) < 5) {
          tree_x = randomNumber(-tree_max_x, tree_max_x);
        }
        while (Math.abs(tree_z) < 5) {
          tree_z = randomNumber(-tree_max_z, tree_max_z);
        }
        newTree.position = new BABYLON.Vector3(
          tree_x,
          ground.getHeightAtCoordinates(0, 0),
          tree_z
        );
        newTree.rotate.y = randomNumber(tree_min_angle, tree_max_angle);
        newTree.checkCollisions = true;
        newTree.freezeWorldMatrix();
      }
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "dead_tree_02.glb", scene, function(meshes, particleSystems, skeletons) {

      meshes[1].material.opacityTexture = null;
      meshes[1].material.backFaceCulling = false;
      meshes[1].isVisible = true;
      meshes[1].checkCollisions = true;
      meshes[1].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
      meshes[1].position.x = 2;


      for (var i = 1; i < dead_tree_01_num; i++) {
        var newTree = meshes[1].clone("dead_tree_02_" + i);
        //var newTree = meshes[1].createInstance("dead_tree_02_" + i);
        trees.push(newTree);
        var tree_x = randomNumber(-tree_max_x, tree_max_x);
        var tree_z = randomNumber(-tree_max_z, tree_max_z);
        while (Math.abs(tree_x) < 5) {
          tree_x = randomNumber(-tree_max_x, tree_max_x);
        }
        while (Math.abs(tree_z) < 5) {
          tree_z = randomNumber(-tree_max_z, tree_max_z);
        }
        newTree.position = new BABYLON.Vector3(
          tree_x,
          ground.getHeightAtCoordinates(0, 0),
          tree_z
        );
        newTree.rotate.y = randomNumber(tree_min_angle, tree_max_angle);
        newTree.checkCollisions = true;
        newTree.freezeWorldMatrix();
      }
    });

    //-------------------------------  Journal Pages //-------------------------------

    var paper_material = new BABYLON.StandardMaterial("textures/ground_texture.jpg", scene);
    paper_material.diffuseTexture = new BABYLON.Texture("textures/ground_texture.jpg", scene);

    var paper = BABYLON.MeshBuilder.CreateBox("paper_" + 0, { width: 0.3, height: 0.4, depth: 0.001 }, scene);
    //paper.material = paper_material;
    paper.position.y = 1;
    paper.checkCollisions = true;
    var paper_x = randomNumber(-150, 150);
    var paper_z = randomNumber(-150, 150);
    while (Math.abs(paper_x) < 5) {
      paper_x = randomNumber(-150, 150);
    }
    while (Math.abs(paper_z) < 5) {
      paper_z = randomNumber(-150, 150);
    }
    paper.position = new BABYLON.Vector3(
      paper_x,
      ground.getHeightAtCoordinates(0, 0) + 0.01,
      paper_z
    );

    for (i = 1; i < 6; i++) {
      var new_paper = paper.clone("paper_" + i);
      var paper_x = randomNumber(-150, 150);
      var paper_z = randomNumber(-150, 150);
      while (Math.abs(paper_x) < 5) {
        paper_x = randomNumber(-150, 150);
      }
      while (Math.abs(paper_z) < 5) {
        paper_z = randomNumber(-150, 150);
      }
      new_paper.position = new BABYLON.Vector3(
        paper_x,
        1,
        paper_z
      );
    }

    //-------------------------------  Rays Handler //-------------------------------
    scene.onPointerDown = function castRay() {
      var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
      ray.parent = camera;
      ray.length = 3;
      //var hit = scene.pickWithRay(ray);
      var hits = scene.multiPickWithRay(ray);

      if (hits[2]) {
        /*
        for (var i = 0; i < hits.length; i++) {
          console.log(hits[i].pickedMesh.name);
        }
        */

        //console.log("hit 2 : " + hits[2].pickedMesh.name);
        if (hits[1].pickedMesh.name.includes("paper")) {
          hits[1].pickedMesh.isVisible = false;
          hits[1].pickedMesh.checkCollisions = false;
          collectedPage();
        }
      } else
      if (hits[1]) {
        //console.log("hit 0 : " + hits[0].pickedMesh.name);
        //console.log("hit 1 : " + hits[1].pickedMesh.name);
        if (hits[1].pickedMesh.name.includes("paper")) {
          hits[1].pickedMesh.isVisible = false;
          hits[1].pickedMesh.checkCollisions = false;
          collectedPage();
        }
      }


    }

    //-------------------------------  END Rays Handler //-------------------------------


    //-----------------------------------  GOLEM //--------------------------------------



    var head = BABYLON.MeshBuilder.CreateBox("head", {}, scene);
    var eyeL = BABYLON.MeshBuilder.CreateBox("eyeL", {}, scene);
    var eyeR = BABYLON.MeshBuilder.CreateBox("eyeR", {}, scene);
    var upperBody = BABYLON.MeshBuilder.CreateBox("upperBody", {}, scene);
    var lowerBody = BABYLON.MeshBuilder.CreateBox("lowerBody", {}, scene);

    var arm1L = BABYLON.MeshBuilder.CreateBox("arm1L", {}, scene);
    var arm2L = BABYLON.MeshBuilder.CreateBox("arm2L", {}, scene);
    var handL = BABYLON.MeshBuilder.CreateBox("handL", {}, scene);

    var arm1R = BABYLON.MeshBuilder.CreateBox("arm1R", {}, scene);
    var arm2R = BABYLON.MeshBuilder.CreateBox("arm2R", {}, scene);
    var handR = BABYLON.MeshBuilder.CreateBox("handR", {}, scene);

    var leg1L = BABYLON.MeshBuilder.CreateBox("leg1L", {}, scene);
    var leg2L = BABYLON.MeshBuilder.CreateBox("leg2L", {}, scene);
    var footL = BABYLON.MeshBuilder.CreateBox("footL", {}, scene);

    var leg1R = BABYLON.MeshBuilder.CreateBox("leg1R", {}, scene);
    var leg2R = BABYLON.MeshBuilder.CreateBox("leg2R", {}, scene);
    var footR = BABYLON.MeshBuilder.CreateBox("footR", {}, scene);

    var viewAreaGolem = BABYLON.MeshBuilder.CreateCylinder("viewAreaGolem", { diameterTop: 5, diameterBottom: 10 }, scene);

    var bodyParts = [];
    bodyParts.push(
      head, upperBody, lowerBody,
      arm1L, arm2L, handL,
      arm1R, arm2R, handR,
      leg1L, leg2L, footL,
      leg1R, leg2R, footR
    );

    bodyParts.forEach((item, i) => {
      item.checkCollisions = true;
      item.applyGravity = true;
    });

    head.parent = upperBody;
    eyeL.parent = head;
    eyeR.parent = head;
    lowerBody.parent = upperBody;
    arm1L.parent = upperBody;
    arm1R.parent = upperBody;
    leg1L.parent = lowerBody;
    leg1R.parent = lowerBody;
    arm2L.parent = arm1L;
    arm2R.parent = arm1R;
    handL.parent = arm2L;
    handR.parent = arm2R;
    leg2L.parent = leg1L;
    leg2R.parent = leg1R;
    footL.parent = leg2L;
    footR.parent = leg2R;

    var pi = Math.PI;

    viewAreaGolem.parent = upperBody;
    viewAreaGolem.position.z = 8;
    viewAreaGolem.position.y = -1;
    viewAreaGolem.isVisible = false;

    viewAreaGolem.rotation.z = Math.PI / 2;
    viewAreaGolem.rotation.x = Math.PI / 2;
    viewAreaGolem.rotation.y = -Math.PI / 2;

    viewAreaGolem.scaling = new BABYLON.Vector3(2, 8, 2);


    //Head

    eyeL.position.z = 0.5;
    eyeL.position.x = -0.3;
    eyeL.position.y = 0.1;
    eyeL.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);

    eyeR.position.z = 0.5;
    eyeR.position.x = 0.3;
    eyeR.position.y = 0.1;
    eyeR.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);

    //Torso
    upperBody.position.y = 2;
    upperBody.scaling = head.scaling = new BABYLON.Vector3(1.2, 1, 1);
    lowerBody.position.y = -0.8;
    lowerBody.scaling = head.scaling = new BABYLON.Vector3(0.5, 0.6, 0.5);
    head.position.y = 0.4;
    head.position.z = 0.7;
    head.scaling = new BABYLON.Vector3(0.4, 0.4, 0.4);

    // Right Arm
    arm1R.position.x = -0.8;
    arm1R.position.y = 0.1;
    arm1R.scaling = new BABYLON.Vector3(0.7, 0.6, 0.5);
    arm1R.rotation = new BABYLON.Vector3(10 * pi / 180, -15 * pi / 180, 60 * pi / 180);
    arm2R.position.x = -0.8;
    arm2R.position.z = 0.2;
    arm2R.scaling = new BABYLON.Vector3(0.8, 0.6, 0.5);
    arm2R.rotation = new BABYLON.Vector3(0, 30 * pi / 180, 0);
    handR.position.x = -0.8;
    handR.scaling = new BABYLON.Vector3(0.6, 1.6, 1.6);

    // Left Arm
    arm1L.position.x = 0.8;
    arm1L.position.y = 0.1;
    arm1L.scaling = new BABYLON.Vector3(0.7, 0.6, 0.5);
    arm1L.rotation = new BABYLON.Vector3(10 * pi / 180, 15 * pi / 180, -60 * pi / 180);
    arm2L.position.x = 0.8;
    arm2L.position.z = 0.2;
    arm2L.scaling = new BABYLON.Vector3(0.8, 0.6, 0.5);
    arm2L.rotation = new BABYLON.Vector3(0, -30 * pi / 180, 0);
    handL.position.x = 0.8;
    handL.scaling = new BABYLON.Vector3(0.6, 1.6, 1.6);

    //Right Leg
    leg1R.position.y = -0.7;
    leg1R.position.x = -0.35;
    leg1R.scaling = new BABYLON.Vector3(0.3, 0.5, 0.3);

    leg2R.position.y = -1;
    leg2R.scaling = new BABYLON.Vector3(2, 1.5, 2);
    footR.position.y = -0.8;
    footR.scaling = new BABYLON.Vector3(1.2, 0.5, 2);

    //Left Leg
    leg1L.position.y = -0.7;
    leg1L.position.x = 0.35;
    leg1L.scaling = new BABYLON.Vector3(0.3, 0.5, 0.3);

    leg2L.position.y = -1;
    leg2L.scaling = new BABYLON.Vector3(2, 1.5, 2);
    footL.position.y = -0.8;
    footL.scaling = new BABYLON.Vector3(1.2, 0.5, 2);


    var bodyMaterial = new BABYLON.StandardMaterial("bodyMaterial", scene);
    bodyMaterial.diffuseTexture = new BABYLON.Texture("textures/rock-texture.jpg", scene);
    bodyMaterial.diffuseColor = new BABYLON.Color3(0.84, 0.46, 0.31);

    var eyeMaterial = new BABYLON.StandardMaterial("eyeMaterial", scene);
    //eyeMaterial.emissiveTexture = new BABYLON.Texture("textures/rock-texture.jpg", scene);
    eyeMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
    eyeMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);

    bodyParts.forEach((item, i) => {
      item.material = bodyMaterial;
    });

    eyeL.material = eyeMaterial;
    eyeR.material = eyeMaterial;

    // Animations

    //Position Animation
    var frameRate = 60;
    var animation_speed = 0.3;

    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------
    // LEFT LEG

    // leg1L
    var keyFrames_leg1L = [];
    var leg1L_anim = new BABYLON.Animation(
      "leg1L_anim",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_leg1L.push({
      frame: frameRate * 0 / 4,
      value: 0
    });
    keyFrames_leg1L.push({
      frame: frameRate * 1 / 4,
      value: -70 * pi / 180
    });
    keyFrames_leg1L.push({
      frame: frameRate * 2 / 4,
      value: 0 * pi / 180
    });
    keyFrames_leg1L.push({
      frame: frameRate * 3 / 4,
      value: 70 * pi / 180
    });
    keyFrames_leg1L.push({
      frame: frameRate * 4 / 4,
      value: 0 * pi / 180
    });
    leg1L_anim.setKeys(keyFrames_leg1L);
    //scene.beginDirectAnimation(leg1L, [leg1L_anim], 0, frameRate, true, animation_speed);

    // leg2L
    var keyFrames_leg2L = [];
    var leg2L_anim = new BABYLON.Animation(
      "leg2L_anim",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_leg2L.push({
      frame: frameRate * 0 / 3,
      value: 0
    });
    keyFrames_leg2L.push({
      frame: frameRate * 1 / 3,
      value: 30 * pi / 180
    });
    keyFrames_leg2L.push({
      frame: frameRate * 2 / 3,
      value: 70 * pi / 180
    });
    keyFrames_leg2L.push({
      frame: frameRate * 3 / 3,
      value: 0
    });
    leg2L_anim.setKeys(keyFrames_leg2L);
    //scene.beginDirectAnimation(leg2L, [leg2L_anim], 0, frameRate, true, animation_speed);

    // footL
    var keyFrames_footL = [];
    var footL_anim = new BABYLON.Animation(
      "footL_anim",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_footL.push({
      frame: frameRate * 0 / 3,
      value: 0
    });
    keyFrames_footL.push({
      frame: frameRate * 1 / 3,
      value: -30 * pi / 180
    });
    keyFrames_footL.push({
      frame: frameRate * 2 / 3,
      value: -30 * pi / 180
    });
    keyFrames_footL.push({
      frame: frameRate * 3 / 3,
      value: 0
    });
    footL_anim.setKeys(keyFrames_footL);
    //scene.beginDirectAnimation(footL, [footL_anim], 0, frameRate, true, animation_speed);

    // Create the animation group
    var animationGroupLegL = new BABYLON.AnimationGroup("animationGroupLegL");
    animationGroupLegL.addTargetedAnimation(leg1L_anim, leg1L);
    animationGroupLegL.addTargetedAnimation(leg2L_anim, leg2L);
    animationGroupLegL.addTargetedAnimation(footL_anim, footL);

    // Make sure to normalize animations to the same timeline
    //animationGroupLegL.normalize(0, 100);
    animationGroupLegL.speedRatio = 0.4;
    animationGroupLegL.loopAnimation = true;

    //animationGroupLegL.play(true);

    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // RIGHT LEG

    // leg1R
    var keyFrames_leg1R = [];
    var leg1R_anim = new BABYLON.Animation(
      "leg1R_anim",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_leg1R.push({
      frame: frameRate * 0 / 4,
      value: 0
    });
    keyFrames_leg1R.push({
      frame: frameRate * 1 / 4,
      value: 70 * pi / 180
    });
    keyFrames_leg1R.push({
      frame: frameRate * 2 / 4,
      value: 0 * pi / 180
    });
    keyFrames_leg1R.push({
      frame: frameRate * 3 / 4,
      value: -70 * pi / 180
    });
    keyFrames_leg1R.push({
      frame: frameRate * 4 / 4,
      value: 0 * pi / 180
    });
    leg1R_anim.setKeys(keyFrames_leg1R);

    // leg2R
    var keyFrames_leg2R = [];
    var leg2R_anim = new BABYLON.Animation(
      "leg2R_anim",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_leg2R.push({
      frame: frameRate * 0 / 3,
      value: 0
    });
    keyFrames_leg2R.push({
      frame: frameRate * 1 / 3,
      value: 70 * pi / 180
    });
    keyFrames_leg2R.push({
      frame: frameRate * 2 / 3,
      value: 30 * pi / 180
    });
    keyFrames_leg2R.push({
      frame: frameRate * 3 / 3,
      value: 0
    });
    leg2R_anim.setKeys(keyFrames_leg2R);


    // footR
    var keyFrames_footR = [];
    var footR_anim = new BABYLON.Animation(
      "footR_anim",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_footR.push({
      frame: frameRate * 0 / 3,
      value: 0
    });
    keyFrames_footR.push({
      frame: frameRate * 1 / 3,
      value: -30 * pi / 180
    });
    keyFrames_footR.push({
      frame: frameRate * 2 / 3,
      value: -30 * pi / 180
    });
    keyFrames_footR.push({
      frame: frameRate * 3 / 3,
      value: 0
    });
    footR_anim.setKeys(keyFrames_footR);


    // Create the animation group
    var animationGroupLegR = new BABYLON.AnimationGroup("animationGroupLegR");
    animationGroupLegR.addTargetedAnimation(leg1R_anim, leg1R);
    animationGroupLegR.addTargetedAnimation(leg2R_anim, leg2R);
    animationGroupLegR.addTargetedAnimation(footR_anim, footR);

    // Make sure to normalize animations to the same timeline
    //animationGroupLegR.normalize(0, 100);
    animationGroupLegR.speedRatio = 0.4;
    animationGroupLegR.loopAnimation = true;

    //animationGroupLegR.play(true);


    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // TORSO

    var keyFrames_torso = [];
    var torso_anim = new BABYLON.Animation(
      "torso_anim",
      "rotation.y",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_torso.push({
      frame: frameRate * 0 / 3,
      value: 0
    });
    keyFrames_torso.push({
      frame: frameRate * 1 / 3,
      value: 10 * pi / 180
    });
    keyFrames_torso.push({
      frame: frameRate * 2 / 3,
      value: -10 * pi / 180
    });
    keyFrames_torso.push({
      frame: frameRate * 3 / 3,
      value: 0
    });
    torso_anim.setKeys(keyFrames_torso);

    // Create the animation group
    var animationGroupTorso = new BABYLON.AnimationGroup("animationGroupTorso");
    animationGroupTorso.addTargetedAnimation(torso_anim, upperBody);

    // Make sure to normalize animations to the same timeline
    //animationGroupTorso.normalize(0, 100);
    animationGroupTorso.speedRatio = 0.2;
    animationGroupTorso.loopAnimation = true;

    //animationGroupTorso.play(true);

    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // LEFT ARM ATTAK

    // attack 1 RX
    var keyFrames_arm1L_attak_1_RX = [];
    var arm1L_attak_anim_1_RX = new BABYLON.Animation(
      "arm1L_attak_anim_1_RX",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_arm1L_attak_1_RX.push({
      frame: frameRate * 0 / 1,
      value: 0
    });
    keyFrames_arm1L_attak_1_RX.push({
      frame: frameRate * 1 / 1,
      value: -70 * pi / 180
    });
    arm1L_attak_anim_1_RX.setKeys(keyFrames_arm1L_attak_1_RX);

    // attack 1 RY
    var keyFrames_arm1L_attak_1_RY = [];
    var arm1L_attak_anim_1_RY = new BABYLON.Animation(
      "arm1L_attak_1_anim_attak_1_RY",
      "rotation.y",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_arm1L_attak_1_RY.push({
      frame: frameRate * 0 / 1,
      value: 0
    });
    keyFrames_arm1L_attak_1_RY.push({
      frame: frameRate * 1 / 1,
      value: -30 * pi / 180
    });
    arm1L_attak_anim_1_RY.setKeys(keyFrames_arm1L_attak_1_RY)

    // attack 2 RX
    var keyFrames_arm1L_attak_2_RX = [];
    var arm1L_attak_anim_2_RX = new BABYLON.Animation(
      "arm1L_attak_anim_2_RX",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_arm1L_attak_2_RX.push({
      frame: frameRate * 0 / 2,
      value: -70 * pi / 180
    });
    keyFrames_arm1L_attak_2_RX.push({
      frame: frameRate * 1 / 2,
      value: -50 * pi / 180
    });
    keyFrames_arm1L_attak_2_RX.push({
      frame: frameRate * 2 / 2,
      value: -70 * pi / 180
    });
    arm1L_attak_anim_2_RX.setKeys(keyFrames_arm1L_attak_2_RX);

    // Create the animation group
    var animationGroupArm1L_attak_1 = new BABYLON.AnimationGroup("animationGroupArm1L_attak_1");
    animationGroupArm1L_attak_1.addTargetedAnimation(arm1L_attak_anim_1_RX, arm1L);
    animationGroupArm1L_attak_1.addTargetedAnimation(arm1L_attak_anim_1_RY, arm1L);

    // Make sure to normalize animations to the same timeline
    //animationGroupTorso.normalize(0, 100);
    animationGroupArm1L_attak_1.speedRatio = 0.7;
    animationGroupArm1L_attak_1.loopAnimation = false;

    // Create the animation group
    var animationGroupArm1L_attak_2 = new BABYLON.AnimationGroup("animationGroupArm1L_attak_2");
    animationGroupArm1L_attak_2.addTargetedAnimation(arm1L_attak_anim_2_RX, arm1L);

    // Make sure to normalize animations to the same timeline
    //animationGroupTorso.normalize(0, 100);
    animationGroupArm1L_attak_2.speedRatio = 0.7;
    animationGroupArm1L_attak_2.loopAnimation = true;

    animationGroupArm1L_attak_1.onAnimationEndObservable.add(function() {
      animationGroupArm1L_attak_2.play(true);
    });

    //animationGroupArm1L_attak_1.play();

    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // RIGHT ARM ATTAK

    // attack 1 RX
    var keyFrames_arm1R_attak_1_RX = [];
    var arm1R_attak_anim_1_RX = new BABYLON.Animation(
      "arm1R_attak_anim_1_RX",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_arm1R_attak_1_RX.push({
      frame: frameRate * 0 / 1,
      value: 0
    });
    keyFrames_arm1R_attak_1_RX.push({
      frame: frameRate * 1 / 1,
      value: -70 * pi / 180
    });
    arm1R_attak_anim_1_RX.setKeys(keyFrames_arm1R_attak_1_RX);

    // attack 1 RY
    var keyFrames_arm1R_attak_1_RY = [];
    var arm1R_attak_anim_1_RY = new BABYLON.Animation(
      "arm1R_attak_anim_1_RY",
      "rotation.y",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_arm1R_attak_1_RY.push({
      frame: frameRate * 0 / 1,
      value: 0
    });
    keyFrames_arm1R_attak_1_RY.push({
      frame: frameRate * 1 / 1,
      value: 30 * pi / 180
    });
    arm1R_attak_anim_1_RY.setKeys(keyFrames_arm1R_attak_1_RY)

    // attack 2 RX
    var keyFrames_arm1R_attak_2_RX = [];
    var arm1R_attak_anim_2_RX = new BABYLON.Animation(
      "arm1R_attak_anim_2_RX",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_arm1R_attak_2_RX.push({
      frame: frameRate * 0 / 2,
      value: -70 * pi / 180
    });
    keyFrames_arm1R_attak_2_RX.push({
      frame: frameRate * 1 / 2,
      value: -50 * pi / 180
    });
    keyFrames_arm1R_attak_2_RX.push({
      frame: frameRate * 2 / 2,
      value: -70 * pi / 180
    });
    arm1R_attak_anim_2_RX.setKeys(keyFrames_arm1R_attak_2_RX);

    // Create the animation group
    var animationGroupArm1R_attak_1 = new BABYLON.AnimationGroup("animationGroupArm1R_attak_1");
    animationGroupArm1R_attak_1.addTargetedAnimation(arm1R_attak_anim_1_RX, arm1R);
    animationGroupArm1R_attak_1.addTargetedAnimation(arm1R_attak_anim_1_RY, arm1R);

    // Make sure to normalize animations to the same timeline
    //animationGroupTorso.normalize(0, 100);
    animationGroupArm1R_attak_1.speedRatio = 0.7;
    animationGroupArm1R_attak_1.loopAnimation = false;

    // Create the animation group
    var animationGroupArm1R_attak_2 = new BABYLON.AnimationGroup("animationGroupArm1R_attak_2");
    animationGroupArm1R_attak_2.addTargetedAnimation(arm1R_attak_anim_2_RX, arm1R);

    // Make sure to normalize animations to the same timeline
    //animationGroupTorso.normalize(0, 100);
    animationGroupArm1R_attak_2.speedRatio = 0.7;
    animationGroupArm1R_attak_2.loopAnimation = true;

    animationGroupArm1R_attak_1.onAnimationEndObservable.add(function() {
      animationGroupArm1R_attak_2.play(true);
    });

    //animationGroupArm1R_attak_1.play();

    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // REPOSITION ARMS ATTACK -> IDLE/STOP

    // reposition right arm
    var keyFrames_arm1R_reposition = [];
    var arm1R_attak_reposition = new BABYLON.Animation(
      "arm1R_attak_reposition",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_arm1R_reposition.push({
      frame: 0,
      value: -50 * pi / 180
    });
    keyFrames_arm1R_reposition.push({
      frame: frameRate,
      value: 0
    });
    arm1R_attak_reposition.setKeys(keyFrames_arm1R_reposition);

    // reposition left arm
    var keyFrames_arm1L_reposition = [];
    var arm1L_attak_reposition = new BABYLON.Animation(
      "arm1L_attak_reposition",
      "rotation.x",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    keyFrames_arm1L_reposition.push({
      frame: 0,
      value: -50 * pi / 180
    });
    keyFrames_arm1L_reposition.push({
      frame: frameRate,
      value: 0
    });
    arm1L_attak_reposition.setKeys(keyFrames_arm1L_reposition);

    // Create the animation group
    var animationGroupRepositionArms = new BABYLON.AnimationGroup("animationGroupRepositionArms");
    animationGroupRepositionArms.addTargetedAnimation(arm1R_attak_reposition, arm1R);
    animationGroupRepositionArms.addTargetedAnimation(arm1L_attak_reposition, arm1L);

    // Make sure to normalize animations to the same timeline
    //animationGroupRepositionArms.normalize(0, 100);
    animationGroupRepositionArms.speedRatio = 0.7;
    animationGroupRepositionArms.loopAnimation = false;

    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------


    function playIdle() {
      if (animationGroupArm1L_attak_1.onAnimationGroupPlayObservable) {
        animationGroupRepositionArms.play();
        animationGroupArm1L_attak_1.stop();
        animationGroupArm1R_attak_1.stop();
        animationGroupArm1L_attak_1.reset();
        animationGroupArm1R_attak_1.reset();
      }

      if (animationGroupArm1L_attak_2.onAnimationGroupPlayObservable) {
        animationGroupArm1L_attak_2.stop();
        animationGroupArm1R_attak_2.stop();
        animationGroupArm1L_attak_2.reset();
        animationGroupArm1R_attak_2.reset();
      }


      animationGroupLegL.speedRatio = 0.4;
      animationGroupLegR.speedRatio = 0.4;
      animationGroupLegL.play(true);
      animationGroupLegR.play(true);
      animationGroupTorso.play(true);
    }

    function pauseIdle() {
      animationGroupLegL.pause();
      animationGroupLegR.pause();
      animationGroupTorso.pause();
    }

    function stopIdle() {
      animationGroupLegL.reset();
      animationGroupLegR.reset();
      animationGroupTorso.reset();

      animationGroupLegL.stop();
      animationGroupLegR.stop();
      animationGroupTorso.stop();
    }

    function playAttack() {
      animationGroupLegL.speedRatio = 0.8;
      animationGroupLegR.speedRatio = 0.8;

      animationGroupTorso.reset();
      animationGroupTorso.stop();

      animationGroupLegL.play(true);
      animationGroupLegR.play(true);
      animationGroupArm1L_attak_1.play();
      animationGroupArm1R_attak_1.play();
    }

    function pauseAttack() {
      animationGroupLegL.pause();
      animationGroupLegR.pause();
      animationGroupTorso.pause();

      animationGroupArm1L_attak_1.pause();
      animationGroupArm1R_attak_1.pause();

      animationGroupArm1L_attak_2.pause();
      animationGroupArm1R_attak_2.pause();
    }

    function stopAttack() {
      animationGroupLegL.reset();
      animationGroupLegR.reset();
      animationGroupTorso.reset();

      animationGroupArm1L_attak_1.reset();
      animationGroupArm1R_attak_1.reset();

      animationGroupArm1L_attak_2.reset();
      animationGroupArm1R_attak_2.reset();

      animationGroupLegL.stop();
      animationGroupLegR.stop();
      animationGroupTorso.stop();

      animationGroupArm1L_attak_1.stop();
      animationGroupArm1R_attak_1.stop();

      animationGroupArm1L_attak_2.stop();
      animationGroupArm1R_attak_2.stop();

      animationGroupRepositionArms.play();
    }



    //------------------------------------ END GOLEM //----------------------------------

    //------------------------------- GAMEPLAY LOGIC //----------------------------------

    gameOverFlag = false;
    var playAttackFlag = false;
    var attack_flag = true;

    var golem_speed_idle = 0.03;
    var golem_speed_attack = 0.075;

    var collected_pages_counter = 0;

    function startGame() {
      gameOverFlag = false;
      collected_pages_counter = 0;
      document.getElementById('page-counter').innerHTML = 'COLLECTED PAGES : ' + collected_pages_counter + '/6';
      playIdle();
      upperBody.position = new BABYLON.Vector3(
        Math.floor((Math.random() * 50)),
        0,
        Math.floor((Math.random() * 50))
      );
      //TEST
      //upperBody.position = new BABYLON.Vector3(0, 0, 8);
    }

    startGame();

    function gameOver() {
      gameOverFlag = true;
      //window.location.reload(true);
      document.getElementById('page-counter').innerHTML = "";
      //document.getElementById("my-menu").reload(true);
      document.getElementById("my-menu").innerHTML = '<div class="container"><h1><a href="#menu">Game Over</a></h1><div class="popover" id="menu"><div class="content"><a href="#" class="close"></a><div class="nav"><ul class="nav_list"><div class="nav_list_item"><li><a href="" onclick = restartGame()>restart</a></li></div><div class="nav_list_item"><li><a href="#">quit</a></li></div></ul></div></div></div></div>';

      /*
      if (gameOverFlag == false) {
        //console.log("GAME OVER");
        gameOverFlag = true;
        attack_flag = false;

        document.getElementById("my-menu").innerHTML = '<div class="container"><h1><a href="#menu">Game Over</a></h1><div class="popover" id="menu"><div class="content"><a href="#" class="close"></a><div class="nav"><ul class="nav_list"><div class="nav_list_item"><li><a href="" onclick = restartGame()>restart</a></li></div><div class="nav_list_item"><li><a href="#">quit</a></li></div></ul></div></div></div></div>';

      }
      */
    }

    function generateRandomDirection() {
      var newDirection = new BABYLON.Vector3(Math.random(), 0, Math.random());
      newDirection.normalize();
      return newDirection;
    }

    var stop_golem_in_position = false;

    function walkIdle(direction, old_direction) {
      if (stop_golem_in_position) {
        return;
      }
      direction.normalize(); // direction now a unit vector
      upperBody.translate(direction, 0.03, BABYLON.Space.LOCAL);
      upperBody.position.y = 2;

      var cos_phi = BABYLON.Vector3.Dot(direction.normalize(), old_direction.normalize());
      upperBody.rotation.y += cos_phi;
      //console.log("cosine : " + upperBody.rotation.y);
    }




    var golemSearchMode = true;
    var golemAttackMode = false;


    //------------------------------- END GAMEPLAY LOGIC //------------------------------

    //------------------------------- Collision Handler //-------------------------------




    function golem_attack() {
      upperBody.lookAt(camera.position);
      upperBody.position.y = 2;

      if (stop_golem_in_position) {
        return
      }

      if (camera.position.x > upperBody.position.x) {
        upperBody.position.x += golem_speed_attack;
      } else {
        upperBody.position.x -= golem_speed_attack;
      }
      if (camera.position.z > upperBody.position.z) {
        upperBody.position.z += golem_speed_attack;
      } else {
        upperBody.position.z -= golem_speed_attack;
      }
    }


    var golem_direction = generateRandomDirection();
    var player_detected_flag = false;
    var change_direction_flag = true;
    var old_golem_direction = golem_direction;
    var count_change_directions = 0;
    var delay = Math.floor((Math.random() * 10000) + 20000);
    var prev_delay = delay;

    scene.registerBeforeRender(() => {
      if (player_detected_flag) {
        golem_attack()
      } else {

        if (change_direction_flag == true) {
          old_golem_direction = golem_direction;
          golem_direction = generateRandomDirection();
          change_direction_flag = false;
        } else {
          walkIdle(golem_direction, old_golem_direction);
          old_golem_direction = golem_direction;
        }


        trees.forEach((tree, index) => {
          if (upperBody.intersectsMesh(tree, false)) {
            setTimeout(() => {
              count_change_directions++;
              //console.log("Count intersections : " + count_change_directions);
              if (count_change_directions == 400) {
                //console.log("[GOLEM] change direction");
                count_change_directions = 0;
                change_direction_flag = true;
              }
            }, 5000);
          }
        });


        if (upperBody.intersectsMesh(border0, false) ||
          upperBody.intersectsMesh(border1, false) ||
          upperBody.intersectsMesh(border2, false) ||
          upperBody.intersectsMesh(border3, false)) {
          //console.log("[GOLEM] hitted the border");
          setTimeout(() => {
            old_golem_direction = golem_direction;
            golem_direction = golem_direction.negate()
          }, 100000);
        }
      }
    });


    camera.onCollide = function(collidedMesh) {
      bodyParts.forEach((item, i) => {
        if (collidedMesh.name.includes(item.name)) {
          gameOver();
        }
      });
      if (collidedMesh.name.includes("border")) {
        //console.log(collidedMesh.name);
        if (collected_pages_counter == 6) {
          gameOver();
        } else {
          document.getElementById('player-message').innerHTML = '<h3> A strange force is blocking me , i need to collect all pages to escape.</h3>';
          setTimeout(() => {
            document.getElementById('player-message').innerHTML = "";
          }, 3000);
        }
      }
    }

    // CAMERA COLLIDER
    let camera_collider = BABYLON.MeshBuilder.CreateBox("camera_collider", { size: 0.5 }, scene);
    camera_collider.parent = camera;

    camera_collider.actionManager = new BABYLON.ActionManager(scene);
    let action_startAttack = new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: {
          mesh: viewAreaGolem
        }
      },
      (evt) => {
        //console.log("PLAYER FOUND");
        //console.log("start_attack");
        player_detected_flag = true;
        stopIdle();
        playAttack();
      }
    );

    let action_endAttack = new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
        parameter: {
          mesh: viewAreaGolem
        }
      },
      (evt) => {
        //console.log("PLAYER LOST");
        //console.log("end_attack");
        player_detected_flag = false;
        stopAttack();
        playIdle();
      }
    );

    camera_collider.actionManager.registerAction(action_startAttack);
    camera_collider.actionManager.registerAction(action_endAttack);




    //------------------------------- END Collision Handler //-------------------------------


    //-------------------------------------------------------------- END Loading trees --------------------------------------------------------------//


    /* End Create Scenery */



    camera.checkCollisions = true;
    camera.applyGravity = true;

    camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
    camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);

    ground.checkCollisions = true;
    lowerGround.checkCollisions = true;

    /*
    // Enable collision detection and gravity on the free camera.
    camera.checkCollisions = true;
    camera.applyGravity = true;
    // Set the player size, the camera"s ellipsoid.
    camera.ellipsoid = new BABYLON.Vector3(0.4, 0.8, 0.4);
    */


    //Create Visible Ellipsoid around camera
    var a = 0.5;
    var b = 1;
    var points = [];
    for (var theta = -Math.PI / 2; theta < Math.PI / 2; theta += Math.PI / 36) {
      points.push(
        new BABYLON.Vector3(0, b * Math.sin(theta), a * Math.cos(theta))
      );
    }

    var ellipse = [];
    ellipse[0] = BABYLON.MeshBuilder.CreateLines("e", { points: points }, scene);
    ellipse[0].color = BABYLON.Color3.Red();
    ellipse[0].parent = camera;
    ellipse[0].rotation.y = (5 * Math.PI) / 16;
    for (var i = 1; i < 23; i++) {
      ellipse[i] = ellipse[0].clone("el" + i);
      ellipse[i].parent = camera;
      ellipse[i].rotation.y = (5 * Math.PI) / 16 + (i * Math.PI) / 16;
    }


    /* New Input Management for Camera
    __________________________________*/

    //First remove the default management.
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    camera.inputs.removeByType("FreeCameraMouseInput");

    //Key Input Manager To Use Keys to Move Forward and BackWard and Look to the Left or Right
    var FreeCameraKeyboardWalkInput = function() {
      this._keys = [];
      this.keysUp = [87]; //w
      this.keysDown = [83]; //s
      this.keysLeft = [65]; //a
      this.keysRight = [68]; //d
      this.keysRun = [16]; //shift
    };

    //Add attachment controls
    FreeCameraKeyboardWalkInput.prototype.attachControl = function(
      element,
      noPreventDefault
    ) {
      var _this = this;
      if (!this._onKeyDown) {
        element.tabIndex = 1;
        this._onKeyDown = function(evt) {
          if (
            _this.keysUp.indexOf(evt.keyCode) !== -1 ||
            _this.keysDown.indexOf(evt.keyCode) !== -1 ||
            _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            _this.keysRight.indexOf(evt.keyCode) !== -1 ||
            _this.keysRun.indexOf(evt.keyCode) !== -1
          ) {
            var index = _this._keys.indexOf(evt.keyCode);
            if (index === -1) {
              _this._keys.push(evt.keyCode);
            }
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          }
        };
        this._onKeyUp = function(evt) {
          if (
            _this.keysUp.indexOf(evt.keyCode) !== -1 ||
            _this.keysDown.indexOf(evt.keyCode) !== -1 ||
            _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            _this.keysRight.indexOf(evt.keyCode) !== -1 ||
            _this.keysRun.indexOf(evt.keyCode) !== -1
          ) {
            var index = _this._keys.indexOf(evt.keyCode);
            if (index >= 0) {
              _this._keys.splice(index, 1);
            }
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          }
        };
        element.addEventListener("keydown", this._onKeyDown, false);
        element.addEventListener("keyup", this._onKeyUp, false);
      }
    };

    //Add detachment controls
    FreeCameraKeyboardWalkInput.prototype.detachControl = function(element) {
      if (this._onKeyDown) {
        element.removeEventListener("keydown", this._onKeyDown);
        element.removeEventListener("keyup", this._onKeyUp);
        BABYLON.Tools.UnregisterTopRootEvents([
          { name: "blur", handler: this._onLostFocus }
        ]);
        this._keys = [];
        this._onKeyDown = null;
        this._onKeyUp = null;
      }
    };

    //Keys movement control by checking inputs
    FreeCameraKeyboardWalkInput.prototype.checkInputs = function() {
      if (this._onKeyDown) {
        var camera = this.camera;
        for (var index = 0; index < this._keys.length; index++) {
          var keyCode = this._keys[index];
          var speed = camera.speed;
          if (this.keysRun.indexOf(keyCode) !== -1) {
            speed = camera.speed * 1.3;
          } else if (this.keysLeft.indexOf(keyCode) !== -1) {
            //camera.rotation.y -= camera.angularSpeed;
            //camera.direction.copyFromFloats(0, 0, 0);
            camera.direction.copyFromFloats(-speed * 0.6, 0, 0);
          } else if (this.keysUp.indexOf(keyCode) !== -1) {
            camera.direction.copyFromFloats(0, 0, speed);
          } else if (this.keysRight.indexOf(keyCode) !== -1) {
            //camera.rotation.y += camera.angularSpeed;
            //camera.direction.copyFromFloats(0, 0, 0);
            camera.direction.copyFromFloats(speed * 0.6, 0, 0);
          } else if (this.keysDown.indexOf(keyCode) !== -1) {
            camera.direction.copyFromFloats(0, 0, -speed);
          }
          if (camera.getScene().useRightHandedSystem) {
            camera.direction.z *= -1;
          }
          camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
          BABYLON.Vector3.TransformNormalToRef(
            camera.direction,
            camera._cameraTransformMatrix,
            camera._transformedDirection
          );
          camera.cameraDirection.addInPlace(camera._transformedDirection);
        }
      }
    };

    //Add the onLostFocus function
    FreeCameraKeyboardWalkInput.prototype._onLostFocus = function(e) {
      this._keys = [];
    };

    //Add the two required functions for the control Name
    FreeCameraKeyboardWalkInput.prototype.getTypeName = function() {
      return "FreeCameraKeyboardWalkInput";
    };

    FreeCameraKeyboardWalkInput.prototype.getSimpleName = function() {
      return "keyboard";
    };

    //Add the new keys input manager to the camera.
    camera.inputs.add(new FreeCameraKeyboardWalkInput());

    //The Mouse Manager to use the mouse (touch) to search around including above and below
    var FreeCameraSearchInput = function(touchEnabled) {
      if (touchEnabled === void 0) {
        touchEnabled = true;
      }
      this.touchEnabled = touchEnabled;
      this.buttons = [0, 1, 2];
      this.angularSensibility = 10000.0;
      this.restrictionX = 100;
      this.restrictionY = 60;
    };

    //add attachment control which also contains the code to react to the input from the mouse
    FreeCameraSearchInput.prototype.attachControl = function(
      element,
      noPreventDefault
    ) {
      var _this = this;
      var engine = this.camera.getEngine();
      var angle = { x: 0, y: 0 };
      if (!this._pointerInput) {
        this._pointerInput = function(p, s) {
          var evt = p.event;
          if (!_this.touchEnabled && evt.pointerType === "touch") {
            return;
          }
          if (
            p.type !== BABYLON.PointerEventTypes.POINTERMOVE &&
            _this.buttons.indexOf(evt.button) === -1
          ) {
            return;
          }
          if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
            try {
              evt.srcElement.setPointerCapture(evt.pointerId);
            } catch (e) {
              //Nothing to do with the error. Execution will continue.
            }
            _this.previousPosition = {
              x: evt.clientX,
              y: evt.clientY
            };
            if (!noPreventDefault) {
              evt.preventDefault();
              element.focus();
            }
          } else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
            try {
              evt.srcElement.releasePointerCapture(evt.pointerId);
            } catch (e) {
              //Nothing to do with the error.
            }
            _this.previousPosition = null;
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          } else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
            if (!_this.previousPosition || engine.isPointerLock) {
              return;
            }
            var offsetX = evt.clientX - _this.previousPosition.x;
            var offsetY = evt.clientY - _this.previousPosition.y;
            angle.x += offsetX;
            angle.y -= offsetY;
            if (Math.abs(angle.x) > _this.restrictionX) {
              angle.x -= offsetX;
            }
            if (Math.abs(angle.y) > _this.restrictionY) {
              angle.y += offsetY;
            }
            if (_this.camera.getScene().useRightHandedSystem) {
              if (Math.abs(angle.x) < _this.restrictionX) {
                _this.camera.cameraRotation.y -=
                  offsetX / _this.angularSensibility;
              }
            } else {
              if (Math.abs(angle.x) < _this.restrictionX) {
                _this.camera.cameraRotation.y +=
                  offsetX / _this.angularSensibility;
              }
            }
            if (Math.abs(angle.y) < _this.restrictionY) {
              _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
            }
            _this.previousPosition = {
              x: evt.clientX,
              y: evt.clientY
            };
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          }
        };
      }
      this._onSearchMove = function(evt) {
        if (!engine.isPointerLock) {
          return;
        }
        var offsetX =
          evt.movementX ||
          evt.mozMovementX ||
          evt.webkitMovementX ||
          evt.msMovementX ||
          0;
        var offsetY =
          evt.movementY ||
          evt.mozMovementY ||
          evt.webkitMovementY ||
          evt.msMovementY ||
          0;
        if (_this.camera.getScene().useRightHandedSystem) {
          _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
        } else {
          _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
        }
        _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
        _this.previousPosition = null;
        if (!noPreventDefault) {
          evt.preventDefault();
        }
      };
      this._observer = this.camera
        .getScene()
        .onPointerObservable.add(
          this._pointerInput,
          BABYLON.PointerEventTypes.POINTERDOWN |
          BABYLON.PointerEventTypes.POINTERUP |
          BABYLON.PointerEventTypes.POINTERMOVE
        );
      element.addEventListener("mousemove", this._onSearchMove, false);
    };

    //Add detachment control
    FreeCameraSearchInput.prototype.detachControl = function(element) {
      if (this._observer && element) {
        this.camera.getScene().onPointerObservable.remove(this._observer);
        element.removeEventListener("mousemove", this._onSearchMove);
        this._observer = null;
        this._onSearchMove = null;
        this.previousPosition = null;
      }
    };

    //Add the two required functions for names
    FreeCameraSearchInput.prototype.getTypeName = function() {
      return "FreeCameraSearchInput";
    };

    FreeCameraSearchInput.prototype.getSimpleName = function() {
      return "MouseSearchCamera";
    };

    //Add the new mouse input manager to the camera
    camera.inputs.add(new FreeCameraSearchInput());

    function resumeGame() {
      document.getElementById("my-menu").innerHTML = "";
      stop_golem_in_position = false;

    }

    function restartGame() {
      collected_pages_counter = 0;
      document.getElementById("my-menu").innerHTML = "";
      stop_golem_in_position = false;
      startGame();
      camera.position = new BABYLON.Vector3(0, 0, 0);
    }

    pauseGame = function() {
      stop_golem_in_position = true;
      document.getElementById('page-counter').innerHTML = "";
    }

    function collectedPage() {
      collected_pages_counter++;
      if (collected_pages_counter == 6) {
        document.getElementById('player-message').innerHTML = "<h3>It's time to escape</h3>"
        setTimeout(() => {
          document.getElementById('player-message').innerHTML = "";
        }, 3000);
      }
      document.getElementById('page-counter').innerHTML = 'COLLECTED PAGES : ' + collected_pages_counter + '/6';
    }


    return scene;
  };

  var canvas, engine;
  var divFps;

  /******* End of the create scene function ******/
  window.onload = function init() {
    canvas = document.getElementById("renderCanvas"); // Get the canvas element
    engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    // *****************************   locking the pointer  *************************************//

    // pointer lock object forking for cross browser

    canvas.requestPointerLock =
      canvas.requestPointerLock || canvas.mozRequestPointerLock;

    document.exitPointerLock =
      document.exitPointerLock || document.mozExitPointerLock;

    canvas.onclick = function() {
      canvas.requestPointerLock();
    };

    divFps = document.getElementById("fps");


    // *****************************  END locking the pointer  *************************************//


    var pauseGame = null;
    var gameOverFlag = false;


    var scene = createScene(); //Call the createScene function

    if ("onpointerlockchange" in document) {
      document.addEventListener('pointerlockchange', lockChangeAlert, false);
    } else if ("onmozpointerlockchange" in document) {
      document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    }

    function lockChangeAlert() {
      if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
        //console.log('The pointer lock status is now locked');
        // Do something useful in response
      } else {
        //console.log('The pointer lock status is now unlocked');
        // Do something useful in response
        /*
        if (gameOverFlag == false) {
          return;
        }*/
        pauseGame
        document.getElementById("my-menu").innerHTML = '<div class="container"><h1><a href="#menu">Menu</a></h1><div class="popover" id="menu"><div class="content"><a href="#" class="close"></a><div class="nav"><ul class="nav_list"><div class="nav_list_item"><li><a href="" onclick = resumeGame()>resume</a></li></div><div class="nav_list_item"><li><a href="" onclick = restartGame()>restart</a></li></div><div class="nav_list_item"><li><a href="#">quit</a></li></div></ul></div></div><div><div>';

      }
    }
    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function() {
      divFps.innerHTML = engine.getFps().toFixed() + " fps";
      scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function() {
      engine.resize();
    });
  };
