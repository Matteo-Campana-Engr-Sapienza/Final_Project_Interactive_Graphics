var createScene = function() {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);




  // Parameters: alpha, beta, radius, target position, scene
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

  // Positions the camera overwriting alpha, beta, radius
  camera.setPosition(new BABYLON.Vector3(0, 0, 20));

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);


  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

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
  bodyMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);
  bodyMaterial.diffuseColor = new BABYLON.Color3(0.84, 0.46, 0.31);

  var eyeMaterial = new BABYLON.StandardMaterial("eyeMaterial", scene);
  eyeMaterial.emissiveTexture = new BABYLON.Texture("textures/grass.png", scene);
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


  // UI
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  var panel = new BABYLON.GUI.StackPanel();
  panel.isVertical = false;
  advancedTexture.addControl(panel);

  var addButton = function(text, callback) {
    var button = BABYLON.GUI.Button.CreateSimpleButton("button", text);
    button.width = "140px";
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.paddingLeft = "10px";
    button.paddingRight = "10px";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.onPointerUpObservable.add(function() {
      callback();
    });
    panel.addControl(button);
  }

  addButton("Play Idle", function() {
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
  });

  addButton("Pause Idle", function() {
    animationGroupLegL.pause();
    animationGroupLegR.pause();
    animationGroupTorso.pause();
  });

  addButton("Stop Idle", function() {
    animationGroupLegL.reset();
    animationGroupLegR.reset();
    animationGroupTorso.reset();

    animationGroupLegL.stop();
    animationGroupLegR.stop();
    animationGroupTorso.stop();
  });

  addButton("Play Attack", function() {
    animationGroupLegL.speedRatio = 0.8;
    animationGroupLegR.speedRatio = 0.8;

    animationGroupTorso.reset();
    animationGroupTorso.stop();

    animationGroupLegL.play(true);
    animationGroupLegR.play(true);
    animationGroupArm1L_attak_1.play();
    animationGroupArm1R_attak_1.play();
  });

  addButton("Pause Attack", function() {
    animationGroupLegL.pause();
    animationGroupLegR.pause();
    animationGroupTorso.pause();

    animationGroupArm1L_attak_1.pause();
    animationGroupArm1R_attak_1.pause();

    animationGroupArm1L_attak_2.pause();
    animationGroupArm1R_attak_2.pause();
  });

  addButton("Stop Attack", function() {
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
  });

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

  return scene;

};
