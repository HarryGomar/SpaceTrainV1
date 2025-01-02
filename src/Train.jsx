import * as THREE from 'three';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useAnimations, useGLTF, useKeyboardControls } from '@react-three/drei';
import { Selection, Select, EffectComposer, Outline } from '@react-three/postprocessing';

export default function Train(props) {
  // Load the GLTF model
  const { nodes, materials, animations } = useGLTF("./Train/SpaceTrainV1.glb");

  // Access camera and controls from the Three.js context
  const { camera, controls } = useThree();

  // Animation actions
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  // References to interactable objects
  const interior = useRef();
  const hide = useRef();
  const door = useRef();
  const terminal = useRef();
  const projectScreen = useRef();
  const exitMain = useRef();
  const UOL = useRef();
  const TrainProj = useRef();
  const Datos = useRef();
  const exterior = useRef()
  const backToMain = useRef()


  // State variables
  const [hoveredObject, setHoveredObject] = useState(null);
  const [inTrain, setInTrain] = useState(false);
  const [inTer, setInTer] = useState(false);
  const [inProj, setInProj] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [isExitMainVisible, setIsExitMainVisible] = useState(false);
  const [isUOLVisible, setIsUOLVisible] = useState(false);
  const [isBackToMainVisible, setIsBackToMainVisible] = useState(false);

  // Keyboard controls
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // Vector for camera adjustments
  const vec = useRef(new THREE.Vector3());

  // Reference to store the last camera position
  const lastPos = useRef(new THREE.Vector3());

  // Reference to store timer IDs for cleanup
  const timers = useRef([]);

  // Texture loader and materials
  const textureLoader = new THREE.TextureLoader();

  const UOLtexture = textureLoader.load('./Screen/UOFscreen.png');
  UOLtexture.flipY = false;
  const UOLmaterial = new THREE.MeshBasicMaterial({ map: UOLtexture });

  const Datodostexture = textureLoader.load('./Screen/DatodosProj.png');
  Datodostexture.flipY = false;
  const Datodosmaterial = new THREE.MeshBasicMaterial({ map: Datodostexture });

  const SpaceTraintexture = textureLoader.load('./Screen/SpaceTrain.png');
  SpaceTraintexture.flipY = false;
  const SpaceTrainmaterial = new THREE.MeshBasicMaterial({ map: SpaceTraintexture });

  const MainScreenTexture = textureLoader.load('./Screen/ProjectScreenMain.png');
  MainScreenTexture.flipY = false;
  const MainScreenMaterial = new THREE.MeshBasicMaterial({ map: MainScreenTexture });

  // Set initial material for project screen
  useEffect(() => {
    if (materials && materials.MonitorProject) {
      setCurrentMaterial(materials.MonitorProject);
    }
  }, [materials]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Update cursor based on hover state
  useEffect(() => {
    document.body.style.cursor = hoveredObject ? 'pointer' : 'auto';
  }, [hoveredObject]);

  // Function to revert project screen material to original
  const revertToOriginalMaterial = useCallback(() => {
    if (materials && materials.MonitorProject) {
      setCurrentMaterial(materials.MonitorProject);
    } else {
      console.error("MonitorProject material is not available");
    }
  }, [materials]);



  // Camera control functions
  const cameraChange = useCallback(() => {
    controls.maxAzimuthAngle = Infinity;
    controls.minAzimuthAngle = Infinity;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
    controls.enableZoom = false;

    controls.enableRotate = true;
    controls.enablePan = true;
  }, [controls]);

  const cameraChangeScreen = useCallback(() => {
    controls.enableRotate = false;
    controls.enablePan = false;
  }, [controls]);




  // Event handler to open the train door and enter train
  const goTrain = useCallback((event) => {
    event.stopPropagation();
    if (!inTrain) {
      // Play door open animation
      if (actions.OpenDoor) {
        actions.OpenDoor.setLoop(THREE.LoopOnce);
        actions.OpenDoor.play();
      }

      // Get door position
      const targetDoor = new THREE.Vector3();
      door.current.updateMatrixWorld();
      door.current.getWorldPosition(targetDoor);

      // Store current camera position
      camera.getWorldPosition(lastPos.current);

      // Adjust camera controls
      controls.minDistance = 0;

      // Animate camera to door position
      gsap.to(camera.position, {
        duration: 1,
        x: targetDoor.x - 1.5,
        z: targetDoor.z,
        y: targetDoor.y + 0.11,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      gsap.to(controls.target, {
        duration: 1,
        x: targetDoor.x,
        z: targetDoor.z,
        y: targetDoor.y + 0.11,
        onUpdate: () => {
          controls.update();
        },
      });

      // Additional camera movements with delays
      gsap.to(camera.position, {
        duration: 1,
        delay: 1,
        x: targetDoor.x + 0.2,
        z: targetDoor.z,
        y: targetDoor.y + 0.11,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      gsap.to(controls.target, {
        duration: 1,
        delay: 1,
        x: targetDoor.x + 0.21,
        z: targetDoor.z,
        y: targetDoor.y + 0.11,
        onUpdate: () => {
          controls.update();
        },
      });

      gsap.to(camera.position, {
        duration: 1,
        delay: 1.5,
        x: targetDoor.x + 0.2,
        z: targetDoor.z,
        y: targetDoor.y + 0.11,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      gsap.to(controls.target, {
        duration: 1,
        delay: 1.5,
        x: targetDoor.x + 0.21,
        z: targetDoor.z + 0.025,
        y: targetDoor.y + 0.11,
        onUpdate: () => {
          controls.update();
        },
      });

      // Change camera controls
      cameraChange();

      // Reset door animation
      if (actions.OpenDoor) {
        actions.OpenDoor.reset();
      }

      // Enter train after animations
      timers.current.push(setTimeout(() => {
        setInTrain(true);
      }, 2000));
    }
  }, [inTrain, actions, camera, controls, cameraChange]);

  
  // Event handler to open the terminal and navigate to terminal view
  const goTerminal = useCallback((event) => {
    event.stopPropagation();
    if (!inTer) {
      // Store current camera position
      camera.getWorldPosition(lastPos.current);

      // Get terminal position
      const targetTer = new THREE.Vector3();
      terminal.current.getWorldPosition(targetTer);

      // Adjust target position
      vec.current.set(targetTer.x, targetTer.y, targetTer.z - 0.15);

      // Animate camera to terminal
      gsap.to(camera.position, {
        duration: 4,
        x: targetTer.x,
        z: targetTer.z - 0.15,
        y: targetTer.y + 0.05,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      gsap.to(controls.target, {
        duration: 3,
        x: targetTer.x,
        z: targetTer.z,
        y: targetTer.y + 0.03,
        onUpdate: () => {
          controls.update();
        },
      });

      // Show iframe
      setIframeVisible(true);

      // Change camera controls
      cameraChangeScreen();

      // Enter terminal view
      setInTer(true);
    }
  }, [inTer, camera, controls, cameraChangeScreen]);

  // Event handler to exit the terminal and return to previous view
  const exitTerminalHandler = useCallback((event) => {
    event.stopPropagation();
    if (inTer) {
      // Animate camera back to last position
      gsap.to(camera.position, {
        duration: 2,
        x: lastPos.current.x,
        z: lastPos.current.z,
        y: lastPos.current.y,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      gsap.to(controls.target, {
        duration: 2,
        x: lastPos.current.x,
        z: lastPos.current.z + 0.025,
        y: lastPos.current.y,
        onUpdate: () => {
          controls.update();
        },
      });

      // Hide iframe
      setIframeVisible(false);

      // Change camera controls
      cameraChange();

      // Exit terminal view
      setInTer(false);
    }
  }, [inTer, camera, controls, cameraChange]);






  const openMain = useCallback(() => {
    if (MainScreenMaterial) {
      setCurrentMaterial(MainScreenMaterial);
      setIsBackToMainVisible(false);
      setIsExitMainVisible(true);
      setIsUOLVisible(true);
    }
  }, [MainScreenMaterial]);

  // Event handler to open UOL project
  const openUOLHandler = useCallback((event) => {
    event.stopPropagation();
    if (UOLmaterial) {
      setCurrentMaterial(UOLmaterial);
      setIsBackToMainVisible(true);
      setIsExitMainVisible(false);
      setIsUOLVisible(false);
    }
  }, [UOLmaterial]);

  // Event handler to open Space Train project
  const openTrainHandler = useCallback((event) => {
    event.stopPropagation();
    if (SpaceTrainmaterial) {
      setCurrentMaterial(SpaceTrainmaterial);
      setIsBackToMainVisible(true);
      setIsExitMainVisible(false);
      setIsUOLVisible(false);
    }
  }, [SpaceTrainmaterial]);

  // Event handler to open Datodos project
  const openDatoHandler = useCallback((event) => {
    event.stopPropagation();
    if (Datodosmaterial) {
      setCurrentMaterial(Datodosmaterial);
      setIsBackToMainVisible(true);
      setIsExitMainVisible(false);
      setIsUOLVisible(false);
    }
  }, [Datodosmaterial]);

  // Event handler to open main project screen
  const openMainHandler = useCallback(() => {
    if (MainScreenMaterial) {
      setCurrentMaterial(MainScreenMaterial);
      setIsBackToMainVisible(false);
      setIsExitMainVisible(true);
      setIsUOLVisible(true);
    }
  }, [MainScreenMaterial]);

  // Unified hover handler
  const handleHover = useCallback((objectName) => {
    setHoveredObject(objectName);
  }, []);




  
  // Event handler to navigate to the project screen
  const goProj = useCallback((event) => {
    event.stopPropagation();
    if (!inProj) {
      // Store current camera position
      camera.getWorldPosition(lastPos.current);

      // Get project screen position
      const targetProj = new THREE.Vector3();
      projectScreen.current.getWorldPosition(targetProj);

      // Adjust target position
      vec.current.set(targetProj.x, targetProj.y, targetProj.z);

      // Animate camera to project screen
      gsap.to(camera.position, {
        duration: 2,
        x: targetProj.x - 0.3,
        z: targetProj.z,
        y: targetProj.y,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      gsap.to(controls.target, {
        duration: 1.5,
        x: targetProj.x - 0.1,
        z: targetProj.z,
        y: targetProj.y,
        onUpdate: () => {
          controls.update();
        },
      });

      // Change camera controls
      cameraChangeScreen();

      // Open main screen
      openMain();

      // Show exit and UOL buttons
      setIsExitMainVisible(true);
      setIsUOLVisible(true);

      // Enter project view after animations
      
      setInProj(true);
     
    }
  }, [inProj, camera, controls, projectScreen, cameraChangeScreen, openMain]);

  // Event handler to exit the project screen and return to main view
  const exitProjHandler = useCallback((event) => {
    event.stopPropagation();
    if (inProj) {
      // Animate camera back to last position
      gsap.to(camera.position, {
        duration: 2,
        x: lastPos.current.x,
        z: lastPos.current.z,
        y: lastPos.current.y,
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      });

      gsap.to(controls.target, {
        duration: 2,
        x: lastPos.current.x,
        z: lastPos.current.z + 0.025,
        y: lastPos.current.y,
        onUpdate: () => {
          controls.update();
        },
      });

      // Change camera controls
      cameraChange();

      revertToOriginalMaterial();

      setIsExitMainVisible(false);
      setIsUOLVisible(false);
      setIsBackToMainVisible(false);

      // Exit project view
      setInProj(false);
    }
  }, [inProj, camera, controls, cameraChange, revertToOriginalMaterial]);




  // Movement logic handled in useFrame
  useFrame(() => {
    const { forward, backward } = getKeys();

    if (!inProj && !inTer && inTrain) {
      // Forward movement
      if (forward && interior.current.position.z > -60) {
        gsap.to(interior.current.position, {
          duration: 0.1,
          x: interior.current.position.x,
          z: interior.current.position.z - 0.4,
          y: interior.current.position.y,
        });
      }

      if (forward && interior.current.position.z <= -30 && interior.current.position.z >= -45) {
        gsap.to(interior.current.position, {
          duration: 0.1,
          x: interior.current.position.x,
          z: interior.current.position.z - 0.4,
          y: interior.current.position.y - 0.17,
        });
      }

      // Backward movement
      if (backward && interior.current.position.z < 32) {
        gsap.to(interior.current.position, {
          duration: 0.1,
          x: interior.current.position.x,
          z: interior.current.position.z + 0.4,
          y: interior.current.position.y,
        });
      }

      if (backward && interior.current.position.z <= -30 && interior.current.position.z >= -45) {
        gsap.to(interior.current.position, {
          duration: 0.1,
          x: interior.current.position.x,
          z: interior.current.position.z + 0.4,
          y: interior.current.position.y + 0.17,
        });
      }
    }
  });

  return (
        <group {...props} dispose={null} ref={group}>
          <group name="Interior" ref={interior}>
    
            {/* Hide Objects When Outside */}
            {inTrain && (
              <group name="Hide" ref={hide}>
                <mesh
                  name="ControlWalls"
                  geometry={nodes.ControlWalls.geometry}
                  material={materials.ControlWalls}
                  position={[-0.3121, 2.05338, 69.48592]}
                  scale={0.19111}
                />
                <mesh
                  name="ControlObjects"
                  geometry={nodes.ControlObjects.geometry}
                  material={materials.ControlObjects}
                  position={[-3.28297, 8.44685, 71.84576]}
                  rotation={[1.57453, -0.00001, Math.PI / 2]}
                  scale={0.13227}
                />
              </group>
            )}
    
            {/* Interactables */}
            <group name="Interact">
    
              {/* Terminal Body and Iframe */}
              <group>
                <group
                  position={[-4.33, 9.30, 73.2]}
                  rotation={[0, Math.PI, 0]}
                  style={{ overflow: 'hidden' }}
                >
                  {iframeVisible && (
                    <Html
                      occlude="blending"
                      transform
                      scale={0.07}
                      fullscreen
                    >
                      <iframe
                        style={{
                          width: '1060px',
                          height: '900px',
                          border: 'none',
                        }}
                        src='https://terminal-inner-website.vercel.app/'
                      />
                    </Html>
                  )}
                </group>
              </group>
    
              {/* Highlight Clickable Objects */}
              <Selection>
                <EffectComposer autoClear={false}>
                  <Outline
                    visibleEdgeColor="white"
                    hiddenEdgeColor="white"
                    blur
                    width={1000}
                    edgeStrength={100}
                  />
                </EffectComposer>
    
                <group
                  name="InteractablesGroup"
                  onPointerOver={(e) => handleHover(e.object.parent.name)}
                  onPointerOut={() => handleHover(null)}
                >
                  {inTrain && (
                    <group name="InsideInteractables">
                      {/* Project Screen */}
                      <Select name="ProjectsScreen_3" enabled={hoveredObject === "ProjectsScreen_3"}>
                        <mesh
                          ref={projectScreen}
                          position={[5.6097, 4.73113, 15.96946]}
                          rotation={[0, 0, -Math.PI / 2]}
                          scale={0.93778}
                          name="ProjectsScreen_3"
                          geometry={nodes.ProjectsScreen_3.geometry}
                          material={currentMaterial}
                          onPointerOver={() => handleHover("ProjectsScreen_3")}
                          onPointerOut={() => handleHover(null)}
                          onClick={goProj}
                        />
                      </Select>
    
                      {/* Terminal Display */}
                      <Select name="DisplayTerminal" enabled={hoveredObject === "DisplayTerminal"}>
                        <mesh
                          ref={terminal}
                          name="DisplayTerminal"
                          geometry={nodes.DisplayTerminal.geometry}
                          material={materials.Terminal}
                          position={[-4.27581, 8.33239, 73.72633]}
                          rotation={[-Math.PI, 0, -Math.PI]}
                          scale={1.16246}
                          onPointerOver={() => handleHover("DisplayTerminal")}
                          onPointerOut={() => handleHover(null)}
                          onClick={goTerminal}
                        />
                      </Select>
    
                      {/* About Me Screen */}
                      <Select name="AboutMeScreen" enabled={hoveredObject === "AboutMeScreen"}>
                        <mesh
                          name="AboutMeScreen"
                          geometry={nodes.AboutMeScreen.geometry}
                          material={materials.FilmScreen}
                          position={[-0.3121, 2.05338, 69.48592]}
                          scale={0.19111}
                          onPointerOver={() => handleHover("AboutMeScreen")}
                          onPointerOut={() => handleHover(null)}
                        />
                      </Select>
    
                      {/* Exit Terminal Button */}
                      <Select name="ButtonTerminal" enabled={hoveredObject === "ButtonTerminal"}>
                        {inTer && (
                          <mesh
                            name="ButtonTerminal"
                            onPointerOver={() => handleHover("ButtonTerminal")}
                            onPointerOut={() => handleHover(null)}
                            onClick={exitTerminalHandler}
                            position={[-5.38581, 8.355, 72.52633]}
                            scale={0.05}
                          >
                            <cylinderGeometry
                              attach="geometry"
                              args={[1, 1, 1, 10]}
                            />
                            <meshStandardMaterial attach="material" color="red" />
                          </mesh>
                        )}
                      </Select>
                    </group>
                  )}
    
                  {/* Door Interactable */}
                  <group
                    name="DoorRight"
                    position={[-5.77522, 3.42571, 3.83667]}
                    rotation={[Math.PI / 2, 0, -Math.PI]}
                    scale={[0.90375, 0.90375, 0.9559]}
                  >
                    <Select name="DoorRight_1" enabled={hoveredObject === "DoorRight_1"}>
                      <mesh
                        ref={door}
                        name="DoorRight_1"
                        geometry={nodes.DoorRight_1.geometry}
                        material={materials.DoorMetal}
                        onPointerOver={() => handleHover("DoorRight_1")}
                        onPointerOut={() => handleHover(null)}
                        onClick={goTrain}
                      />
                    </Select>
                    <mesh
                      name="DoorRight_2"
                      geometry={nodes.DoorRight_2.geometry}
                      material={materials.GlowRed}
                    />
                  </group>
                </group>
              </Selection>
    
              {/* Project Screen Hitboxes */}
              {inProj && (
                <group name="Hitboxes">
                  {isExitMainVisible && (
                    <mesh
                      ref={exitMain}
                      name="ExitMain"
                      geometry={new THREE.BoxGeometry(0.6, 0.6, 0.6)}
                      material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                      position={[5.884, 3.2, 13.25]}
                      onPointerOver={() => handleHover("ExitMain")}
                      onPointerOut={() => handleHover(null)}
                      onClick={exitProjHandler}
                    />
                  )}
    
                  {isUOLVisible && (
                    <group>
                      {/* UOL Project */}
                      <mesh
                        ref={UOL}
                        name="UOL"
                        geometry={new THREE.BoxGeometry(0.9, 0.9, 0.9)}
                        material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                        position={[5.884, 5.2, 14]}
                        onPointerOver={() => handleHover("UOL")}
                        onPointerOut={() => handleHover(null)}
                        onClick={openUOLHandler}
                      />
    
                      {/* Space Train Project */}
                      <mesh
                        ref={TrainProj}
                        name="SpaceTrain"
                        geometry={new THREE.BoxGeometry(1, 1, 1)}
                        material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                        position={[5.884, 5.2, 16]}
                        onPointerOver={() => handleHover("SpaceTrain")}
                        onPointerOut={() => handleHover(null)}
                        onClick={openTrainHandler}
                      />
    
                      {/* Datodos Project */}
                      <mesh
                        ref={Datos}
                        name="Datos"
                        geometry={new THREE.BoxGeometry(0.9, 0.9, 0.9)}
                        material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                        position={[5.884, 5.2, 18]}
                        onPointerOver={() => handleHover("Datos")}
                        onPointerOut={() => handleHover(null)}
                        onClick={openDatoHandler}
                      />
                    </group>
                  )}
    
                  {isBackToMainVisible && (
                    <mesh
                      ref={backToMain}
                      name="BackToMain"
                      geometry={new THREE.BoxGeometry(0.7, 0.7, 0.7)}
                      material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                      position={[5.884, 6.2, 17.65]}
                      onPointerOver={() => handleHover("BackToMain")}
                      onPointerOut={() => handleHover(null)}
                      onClick={openMainHandler}
                    />
                  )}
                </group>
              )}
    
              {/* Project Screens Group */}
              <group
                name="ProjectsScreen"
                position={[5.6097, 4.73113, 15.96946]}
                rotation={[0, 0, -Math.PI / 2]}
                scale={0.93778}
              >
                <mesh
                  name="ProjectsScreen_1"
                  geometry={nodes.ProjectsScreen_1.geometry}
                  material={materials.MainScreen}
                />
                <mesh
                  name="ProjectsScreen_2"
                  geometry={nodes.ProjectsScreen_2.geometry}
                  material={materials.UOLScreen}
                />
                <mesh
                  name="ProjectsScreen_3"
                  geometry={nodes.ProjectsScreen_3.geometry}
                  material={currentMaterial} // Dynamic material
                />
                <mesh
                  name="ProjectsScreen_4"
                  geometry={nodes.ProjectsScreen_4.geometry}
                  material={materials.SpaceTrain}
                />
                <mesh
                  name="ProjectsScreen_5"
                  geometry={nodes.ProjectsScreen_5.geometry}
                  material={materials.Datodos}
                />
              </group>
    
            </group>
          
  
          {/* TRAIN HEAD */}
          <group name="TrainHead" position={[0.03631, -29.9528, 9.10449]} scale={0.45295}>
            <mesh
              name="TrainHead_1"
              geometry={nodes.TrainHead_1.geometry}
              material={materials.Glass}
            />
            <mesh
              name="TrainHead_2"
              geometry={nodes.TrainHead_2.geometry}
              material={materials.TrainWalls}
            />
            <mesh
              name="TrainHead_3"
              geometry={nodes.TrainHead_3.geometry}
              material={materials['PaintOutsideWhite.001']}
            />
          </group>
  
          {/* LIGHTS */}
          
          {inTrain && (   
            <group name="Lights">
              <group position={[0.018, 6.714, -28.742]}>
                <pointLight intensity={0.1} decay={2} color="#fffdd3" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[0.018, 10.273, -13.14]}>
                <pointLight intensity={0.1} decay={2} color="#f0e7ff" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[0.018, 10.852, 48.849]}>
                <pointLight intensity={0.1} decay={2} color="#f0e7ff" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[0.018, 10.273, 30.02]}>
                <pointLight intensity={0.1} decay={2} color="#f0e7ff" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[0.018, 10.273, 7.861]}>
                <pointLight intensity={0.1} decay={2} color="#f0e7ff" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[-7.913, 14.077, 65.586]}>
                <pointLight intensity={0.1} decay={2} color="#f0e7ff" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[-0.136, 12.423, 58.097]}>
                <pointLight intensity={0.1} decay={2} color="#ffeea8" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[6.745, 14.077, 65.586]}>
                <pointLight intensity={0.1} decay={2} color="#f0e7ff" rotation={[-Math.PI / 2, 0, 0]} />
              </group>
            </group>
          )}
  
  
          {/* OBJECTS */}
          <group name="Loose">
          <group
            name="Tablet"
            position={[3.94258, 2.31633, -0.4522]}
            rotation={[0, -0.97512, 0]}
            scale={5.25435}>
            <mesh
              name="Tablet_1"
              geometry={nodes.Tablet_1.geometry}
              material={materials.Tablet_white}
            />
            <mesh name="Tablet_2" geometry={nodes.Tablet_2.geometry} material={materials.Handle} />
            <mesh
              name="Tablet_3"
              geometry={nodes.Tablet_3.geometry}
              material={materials.TabletGlow}
            />
          </group>
          <mesh
            name="RadarPlane"
            geometry={nodes.RadarPlane.geometry}
            material={materials.Controller}
            position={[-1.44281, 8.5418, 72.88918]}
            rotation={[Math.PI / 2, 0, 2.76649]}
            scale={0.77296}
          />
          <group name="Puzzle" position={[0.49346, 0.75457, -29.20572]} scale={8.31741}>
            <mesh
              name="Puzzle_1"
              geometry={nodes.Puzzle_1.geometry}
              material={materials['JigsawPuzzleFront.001']}
            />
            <mesh
              name="Puzzle_2"
              geometry={nodes.Puzzle_2.geometry}
              material={materials['JigsawPuzzleBack.001']}
            />
          </group>
          <mesh
            name="PaintingsBorder"
            geometry={nodes.PaintingsBorder.geometry}
            material={materials.PaintingBorder}
            position={[-5.92163, 5.46794, 14.41192]}
            rotation={[1.57453, -0.00001, Math.PI / 2]}
            scale={0.13227}
          />
          <mesh
            name="Painting5"
            geometry={nodes.Painting5.geometry}
            material={materials.Painting5}
            position={[5.78982, 5.23937, 43.31192]}
            rotation={[1.56706, 0.00001, -Math.PI / 2]}
            scale={0.13337}
          />
          <group
            name="Painting4"
            position={[-5.81018, 5.10591, 43.41192]}
            rotation={[1.57453, -0.00001, Math.PI / 2]}
            scale={0.13123}>
            <mesh
              name="Painting2_1"
              geometry={nodes.Painting2_1.geometry}
              material={materials.PaintingBorder}
            />
            <mesh
              name="Painting2_2"
              geometry={nodes.Painting2_2.geometry}
              material={materials.Painting4}
            />
          </group>
          <group
            name="Painting3"
            position={[-5.77261, 4.56798, 21.77623]}
            rotation={[Math.PI, 0, Math.PI / 2]}
            scale={0.18}>
            <mesh
              name="Painting3_1"
              geometry={nodes.Painting3_1.geometry}
              material={materials.PaintingBorder}
            />
            <mesh
              name="Painting3_2"
              geometry={nodes.Painting3_2.geometry}
              material={materials.Painting1}
            />
          </group>
          <group
            name="Painting2"
            position={[-5.67114, 4.49911, -9.08524]}
            rotation={[Math.PI, 0, Math.PI / 2]}
            scale={0.17183}>
            <mesh
              name="Painting4_1"
              geometry={nodes.Painting4_1.geometry}
              material={materials.PaintingBorder}
            />
            <mesh
              name="Painting4_2"
              geometry={nodes.Painting4_2.geometry}
              material={materials.Painting3}
            />
          </group>
          <group
            name="Painting"
            position={[-5.92163, 5.46794, 14.41192]}
            rotation={[1.57453, -0.00001, Math.PI / 2]}
            scale={0.13227}>
            <mesh
              name="Painting5_1"
              geometry={nodes.Painting5_1.geometry}
              material={materials.PaintingBorder}
            />
            <mesh
              name="Painting5_2"
              geometry={nodes.Painting5_2.geometry}
              material={materials.Painting2}
            />
          </group>
          <group name="Levers" position={[-7.99804, 8.45675, 71.8767]} scale={0.11154}>
            <mesh
              name="Levers_1"
              geometry={nodes.Levers_1.geometry}
              material={materials['M_Controls.001']}
            />
            <mesh
              name="Levers_2"
              geometry={nodes.Levers_2.geometry}
              material={materials['M_Controls.002']}
            />
          </group>
          <mesh
            name="Cricket_Ball"
            geometry={nodes.Cricket_Ball.geometry}
            material={materials['Cricket Ball.002']}
            position={[-5.62088, 2.6681, 28.22861]}
            rotation={[Math.PI, -0.63312, Math.PI]}
            scale={1.42172}
          />
          </group>
          <group name="Baked">
            <mesh
              name="Walls"
              geometry={nodes.Walls.geometry}
              material={materials.Walls}
              position={[-5.82977, 3.59277, 19.99672]}
              rotation={[Math.PI / 2, -1.57055, 0]}
              scale={[1, 1, 0.4245]}
            />
            <mesh
              name="Roof"
              geometry={nodes.Roof.geometry}
              material={materials.Roof}
              position={[-0.3121, 2.05338, 69.48592]}
              scale={0.19111}
            />
            <mesh
              name="Plants"
              geometry={nodes.Plants.geometry}
              material={materials.Plants}
              position={[6.07357, 3.2712, -14.58852]}
              rotation={[0, 0.37855, 0]}
              scale={[1, 0.52052, 1]}
            />
            <mesh
              name="Papers"
              geometry={nodes.Papers.geometry}
              material={materials.Papers}
              position={[4.55996, 1.67764, 9.96313]}
              rotation={[0, -1.25841, 0]}
              scale={4.65629}
            />
            <mesh
              name="Objects"
              geometry={nodes.Objects.geometry}
              material={materials.Objects}
              position={[-5.92163, 5.46794, 14.41192]}
              rotation={[1.57453, -0.00001, Math.PI / 2]}
              scale={0.13227}
            />
            <mesh
              name="Floor"
              geometry={nodes.Floor.geometry}
              material={materials.Floor}
              position={[-0.3121, 2.05338, 69.48592]}
              scale={0.19111}
            />
            <mesh
              name="Books"
              geometry={nodes.Books.geometry}
              material={materials.Books}
              position={[-6.24508, 6.43007, 28.70142]}
              rotation={[Math.PI / 2, 0, -Math.PI / 2]}
              scale={[1.81401, 1.73215, 1.73215]}
            />
            <mesh
              name="Plants2"
              geometry={nodes.Plants2.geometry}
              material={materials.Plants2}
              position={[6.07357, 3.2712, -14.58852]}
              rotation={[0, 0.37855, 0]}
              scale={[1, 0.52052, 1]}
            />
          </group>
  
        </group>



        {/* EXTERIOR */}
        {!inTrain && (             
          <group name="Exterior" ref = {exterior} position={[0.276, 17.189, 43.572]} rotation={[0, 0, 0.001]} scale={32.078}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_1.geometry}
              material={materials.PanelMetal}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_2.geometry}
              material={materials['Solar Panel']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_3.geometry}
              material={materials.TrainWalls}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_4.geometry}
              material={materials.under}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_5.geometry}
              material={materials.TrainLight}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_6.geometry}
              material={materials.CubeMetal}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_7.geometry}
              material={materials.rails}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_8.geometry}
              material={materials.PaintOutsideWhite}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_9.geometry}
              material={materials.GreyPaint}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_10.geometry}
              material={materials.Vent}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_11.geometry}
              material={materials.Tanks}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_12.geometry}
              material={materials.Turbine}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_13.geometry}
              material={materials.PointTurbine}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_14.geometry}
              material={materials.Pipe}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_15.geometry}
              material={materials.Antena}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_16.geometry}
              material={materials.GlowCentre}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_17.geometry}
              material={materials.MetalOutside}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_18.geometry}
              material={materials.GlowRed}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Train_19.geometry}
              material={materials.Cables}
            />
          </group>
        )}

        {!inTrain && (   
            <group>
              <directionalLight castShadow position={[-90, 60, 60] } intensity={ 3 } shadow-normalBias={ 0.04 } />
              <directionalLight castShadow position={ [-4.33, 60, 120]} intensity={ 3 } shadow-normalBias={ 0.04 } />
            </group>         
          )}
        
      </group>
    )
  }
  useGLTF.preload('./Train/SpaceTrainV1.glb')
  