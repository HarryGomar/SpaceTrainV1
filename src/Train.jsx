import * as THREE from 'three';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

import { useFrame, useLoader } from '@react-three/fiber';
import { Html, useAnimations, useGLTF, useKeyboardControls } from '@react-three/drei';

import { Selection, Select, EffectComposer, Outline } from '@react-three/postprocessing'




export default function Train(props)
{

  //LOADING TRAIN
  const { nodes, materials, animations} = useGLTF("./Train/SpaceTrainV1.glb");


  const [hovering, setHovered] = useState(false)

  const [hovered, hover] = useState(null)


  useEffect(() => {
    document.body.style.cursor = hovering ? 'pointer' : 'auto'
  }, [hovering])

  const handleHover = (isHovering) => {
    setHovered(isHovering);
    hover(isHovering);  // Assuming 'hover' is a function that you want to call
  };


  
  //STATE DECLARATIONS
    const [clicked, setClicked] = useState(false)

    const [clickedTer, setClickedTer] = useState(false)

    const [clickedProj, setClickedProj] = useState(false)

    const [clickedExitProj, setClickedExitProj] = useState(false)

    const [clickedExitTer, setClickedExitTer] = useState(false)

    const [inTrain, setInTrain] = useState(false)

    const [inTer, setInTer] = useState(false)

    const [inProj, setInProj] = useState(false)

    const [iframeVisible, setIframeVisible] = useState(false);

    const [currentMaterial, setCurrentMaterial] = useState(null);

    

    //REFERENCES TO OBJECTS 
    const group = useRef()

    const door = useRef()

    const terminal = useRef()

    const projectScreen = useRef()

    const lastPos = useRef(new THREE.Vector3());


    //OPEN DOOR
    function goTrain(event)
    {
      event.stopPropagation()
      setClicked(!clicked)
    }

    //TERMINAL
    function goTerminal(event)
    {
      event.stopPropagation()

      setClickedTer(!clickedTer)

      setTimeout(() => {
        setInTer(true);
      }, 5000);

    }

    function exitTerminal(event)
    {
      event.stopPropagation()
      setClickedExitTer(!clickedExitTer)
    }

    //PROJECT SCREEN MATERIAL FUNCTIONS
    useEffect(() => {
      if (materials) {
          setCurrentMaterial(materials.MonitorProject);
      }
    }, [materials]);

    const turnOnProj = () => {
      if (materials && materials.MainScreen) {
        setCurrentMaterial(materials.MainScreen);
      } else {
        console.error("MainScreen material is not available");
      }
    };
    
    const revertToOriginalMaterial = () => {
      if (materials.MonitorProject) {
        setCurrentMaterial(materials.MonitorProject);
      } else {
        console.error("MonitorProject material is not available");
      }
    };

    // Material creation

    const textureLoader = new THREE.TextureLoader();

    const UOLtexture = textureLoader.load('./Screen/UOFscreen.png');
    UOLtexture.flipY = false
    const UOLmaterial = new THREE.MeshBasicMaterial({ map: UOLtexture  });

    
    const Datodostexture = textureLoader.load('./Screen/DatodosProj.png');
    Datodostexture.flipY = false
    const Datodosmaterial = new THREE.MeshBasicMaterial({ map: Datodostexture  });

    
    const SpaceTraintexture = textureLoader.load('./Screen/SpaceTrain.png');
    SpaceTraintexture.flipY = false
    const SpaceTrainmaterial = new THREE.MeshBasicMaterial({ map: SpaceTraintexture  });


    //SCREEN NAVIGATION
    const backToMain = useRef()
    const UOL = useRef()
    const TrainProj = useRef()
    const Datos = useRef()

    const exitMain= useRef()

    const [isExitMainVisible, setIsExitMainVisible] = useState(false);
    const [isUOLVisible, setIsUOLVisible] = useState(false);
    const [isBackToMainVisible, setIsBackToMainVisible] = useState(false);

    function goProj(event)
    {
      

      event.stopPropagation()

      

      setClickedProj(!clickedProj)

      
    }

    function exitProj(event)
    {
      setIsExitMainVisible(false);
      setIsUOLVisible(false);
      setIsBackToMainVisible(false);
      setClickedExitProj(true)
      
      event.stopPropagation()

    }

    function openUOL(event)
    {
      if (UOLmaterial) {
        setCurrentMaterial(UOLmaterial);
        setIsBackToMainVisible(true);
        setIsExitMainVisible(false);
        setIsUOLVisible(false);
        
      } 
      event.stopPropagation()
    }

    function openTrain(event)
    {
      if (SpaceTrainmaterial) {
        setCurrentMaterial(SpaceTrainmaterial);
        setIsBackToMainVisible(true);
        setIsExitMainVisible(false);
        setIsUOLVisible(false);
        
      } 
      event.stopPropagation()
    }

    function openDato(event)
    {
      if (Datodosmaterial) {
        setCurrentMaterial(Datodosmaterial);
        setIsBackToMainVisible(true);
        setIsExitMainVisible(false);
        setIsUOLVisible(false);
        
      } 
      event.stopPropagation()
    }

    function openBackToMain(event)
    {
      if (materials.MainScreen) {
        setCurrentMaterial(materials.MainScreen);

        setIsBackToMainVisible(false);
        setIsExitMainVisible(true);
        setIsUOLVisible(true);
        
      } 
      event.stopPropagation()
    }


    //CAMERA MANIPULATION
    function cameraChange(state)
    {
      state.controls.maxAzimuthAngle = Infinity
      state.controls.minAzimuthAngle = Infinity
      state.controls.maxPolarAngle = Math.PI
      state.controls.minPolarAngle = 0
      state.controls.enableZoom = false

      state.controls.enableRotate = true
      state.controls.enablePan = true
    }

    function cameraChangeScreen(state)
    {
      state.controls.enableRotate = false
      state.controls.enablePan = false
    }

    
    if (!materials || !nodes) {
      return <div>Loading...</div>;
    }

    const [subscribeKeys, getKeys] = useKeyboardControls()

    const { actions } = useAnimations(animations, group)

    const [vec] = useState(() => new THREE.Vector3())

    //USEFRAME LOOP
    useFrame(state => {
        const { forward, backward} = getKeys()

        //DOOR OPEN
        if(clicked && !inTrain)
        {
            actions.DoorOpen.setLoop(THREE.LoopOnce)

            actions.DoorOpen.play()

            var targetDoor = new THREE.Vector3();

            door.current.updateMatrixWorld()

            door.current.getWorldPosition( targetDoor );

            state.controls.minDistance = 0

            gsap.to(state.camera.position, {duration:1, x: targetDoor.x - 1.5 , z: targetDoor.z, y: targetDoor.y + 0.11 })
            gsap.to(state.controls.target, {duration:1, x: targetDoor.x   , z: targetDoor.z , y: targetDoor.y + 0.11 })

            gsap.to(state.camera.position, {duration:1, delay:1, x: targetDoor.x + 0.2 , z: targetDoor.z , y: targetDoor.y + 0.11})
            gsap.to(state.controls.target, {duration:1, delay:1, x: targetDoor.x + 0.21 , z: targetDoor.z  , y: targetDoor.y + 0.11})

            gsap.to(state.camera.position, {duration:1, delay:1.5, x: targetDoor.x + 0.2 , z: targetDoor.z  , y: targetDoor.y + 0.11})
            gsap.to(state.controls.target, {duration:1, delay:1.5, x: targetDoor.x + 0.21 , z: targetDoor.z + 0.025 , y: targetDoor.y + 0.11})

            cameraChange(state)

            actions.DoorOpen.reset()

            setClicked(!clicked)
            setInTrain(!inTrain)
        }

        
        //TERMINAL
        if(clickedTer)
        {
          var targetTer = new THREE.Vector3(); 

          state.camera.getWorldPosition(lastPos.current)

          terminal.current.getWorldPosition( targetTer );

          vec.set(targetTer.x, targetTer.y, targetTer.z - 0.15)

          console.log(targetTer)

          gsap.to(state.camera.position, {duration:4,  x:targetTer.x, z: targetTer.z - 0.15, y: targetTer.y })
          gsap.to(state.controls.target, {duration:3,  x:targetTer.x, z: targetTer.z, y: targetTer.y })

          setIframeVisible(true)
          
          setClickedTer(false)

          cameraChangeScreen(state)

        }


        if(inTer)
        {
          console.log(state.pointer.x)
          
          //state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05)

          if(clickedExitTer )
          {
            gsap.to(state.camera.position, {duration:2, x: lastPos.current.x, z:lastPos.current.z, y: lastPos.current.y})
            gsap.to(state.controls.target, {duration:2, x: lastPos.current.x, z: lastPos.current.z + 0.025, y: lastPos.current.y})

            setIframeVisible(false)

            cameraChange(state)

            setClickedExitTer(!clickedExitTer)

            setInTer(false)
          }
        }
        


        //PROJECT
        if(clickedProj)
        {
          if (!inProj){
            var targetProj = new THREE.Vector3();

            state.camera.getWorldPosition(lastPos.current)

            projectScreen.current.getWorldPosition( targetProj );

            vec.set(targetProj.x - 0.3, targetProj.y - 0.015, targetProj.z -0.07)

            gsap.to(state.camera.position, {duration:2,  x:targetProj.x - 0.3, z: targetProj.z  -0.07, y: targetProj.y - 0.015 })
            gsap.to(state.controls.target, {duration:1.5,  x:targetProj.x, z: targetProj.z  -0.07, y: targetProj.y - 0.015 })

            cameraChangeScreen(state)

            turnOnProj()


            setIsExitMainVisible(true);

            setIsUOLVisible(true);

            setTimeout(() => {
              setInProj(true);
            }, 2000);

          }

          setClickedProj(false)

        }

        if (inProj)
        {
          console.log("InProj")
          gsap.to(state.camera.position, {duration:0.05, x:vec.x  , z: vec.z - state.pointer.x * 0.03, y: vec.y- state.pointer.y * 0.03 })

          if(clickedExitProj)
          {

            gsap.to(state.camera.position, {duration:2, x: lastPos.current.x, z:lastPos.current.z, y: lastPos.current.y})
            gsap.to(state.controls.target, {duration:2, x: lastPos.current.x, z: lastPos.current.z + 0.025, y: lastPos.current.y})

            cameraChange(state)

            revertToOriginalMaterial()

            setClickedExitProj(false)

            setInProj(false)
            console.log("Outofproj")

          }
        }
        
        //MOVEMENT
        if(!inProj && !inTer && inTrain)
        {
          //FORWARD
          if(forward && group.current.position.z > -3.3 )
          {
            gsap.to(group.current.position, {duration:0.1, x:group.current.position.x , z:group.current.position.z - 0.02 , y:group.current.position.y })
          }
          
          if (forward && group.current.position.z <= -2 && group.current.position.z >= -3  )
          {
            gsap.to(group.current.position, {duration:0.1, x:group.current.position.x , z:group.current.position.z - 0.02, y: group.current.position.y - 0.008 })
          }
          //BACKWARD
          if(backward && group.current.position.z < 0.1)
          {
            gsap.to(group.current.position, {duration:0.1, x:group.current.position.x , z:group.current.position.z + 0.02 , y:group.current.position.y })
          }
  
          if(backward && group.current.position.z <= -2 && group.current.position.z >= -3 )
          {
            gsap.to(group.current.position, {duration:0.1, x:group.current.position.x , z:group.current.position.z + 0.02, y: group.current.position.y + 0.008 })
          }
        }
    })

  
    return (

    <group ref={group} {...props}  dispose={null} >
      <group name="Scene">


        {/* INTERACTABLES */}
        
          <Selection>
            <EffectComposer autoClear={false}>
              <Outline visibleEdgeColor="white" hiddenEdgeColor="white" blur width={1000} edgeStrength={100} />
            </EffectComposer>
            <group name="Interactables" onPointerOver={(e) => hover(e.object.parent.name)} onPointerOut={(e) => hover(null)}>
              
              {inTrain && (
              <group name="inside">
                  {/* PROJECT SCREEN */}
                  <Select name="ProjectsScreen" enabled={hovered === "ProjectsScreen"}>
                      <mesh
                          ref={projectScreen}
                          name="ProjectsScreen"
                          castShadow
                          receiveShadow
                          geometry={nodes.ProjectsScreen.geometry}
                          material={currentMaterial}
                          position={[5.884, 6, 16]}
                          rotation={[0, 0, -Math.PI / 2]}
                          onPointerOver={() => hover(true)}
                          onPointerOut={() => handleHover(false)}

                          onClick={ (event) =>
                              {
                              goProj(event)
                              }
                          }
                      />
                  </Select>
                  {/* TERMINAL DISPLAY */}
                  <Select name="Cube062_1" enabled={hovered === "Cube062_1"}>
                      <mesh
                          ref = { terminal }
                          name="Cube062_1"
                          castShadow
                          receiveShadow
                          geometry={nodes.Cube062_1.geometry}
                          material={materials.Terminal}
                          position={[-4.146, 9.523, 74.462]}
                          scale={0.191}
                          onPointerOver={() => hover(true)}
                          onPointerOut={() => handleHover(false)}
                          onClick={ (event) =>
                          {
                              goTerminal(event)
                          }
                          }
                      />
                  </Select>       
                  <Select name="End_Cap_1_Coating_-_Black_Oxide_0_3" enabled={hovered === "End_Cap_1_Coating_-_Black_Oxide_0_3" }>
                      <mesh
                          name="End_Cap_1_Coating_-_Black_Oxide_0_3"
                          castShadow
                          receiveShadow
                          position={[-0.095, 8.895, -37.094]}
                          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                          scale={0.189}
                          geometry={nodes["End_Cap_1_Coating_-_Black_Oxide_0_3"].geometry}
                          material={materials.FilmScreen}
                          onPointerOver={() => hover(true)}
                          onPointerOut={() => handleHover(false)}
                      />
                  </Select>
              </group>
              )}

              <group
                name="DoorRight"
                position={[-6.375, 3.081, 3.337]}
                rotation={[Math.PI / 2, 0, -Math.PI]}
              >
                <Select name="Cube007" enabled={hovered === "Cube007" } >
                  <mesh
                    ref ={door}
                    name="Cube007"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube007.geometry}
                    material={materials.DoorMetal}
                    onPointerOver={() => handleHover(true)}
                    onPointerOut={() => handleHover(false)}

                    onClick={ (event) =>
                      {
                          goTrain(event)
                      }
                    }
                  />
                </Select>
    
                <mesh
                  name="Cube007_1"
                  castShadow
                  receiveShadow
                  geometry={nodes.Cube007_1.geometry}
                  material={materials["Material.004"]}
                />
              </group>

            </group>
          </Selection>
        
          

        {/* PROJECTS SCREEN HITBOXES*/}
        {inProj && (
          <group name="Hitboxes">
            {isExitMainVisible && (
              <mesh
                ref={exitMain}
                name="ExitMain"
                
                geometry={new THREE.BoxGeometry(0.6,0.6,0.6)}
                material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                position={[5.884, 4, 11.25]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={ (event) =>
                  {
                    exitProj(event)
                  }
                }
              />
            )}

            {isUOLVisible && (
              <group>
                <mesh
                  ref={UOL}
                  name="UOL"
                  
                  geometry={new THREE.BoxGeometry(0.9,0.9,0.9)}
                  material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                  position={[5.884, 6, 12.2]}
                  onPointerOver={() => setHovered(true)}
                  onPointerOut={() => setHovered(false)}
                  onClick={ (event) =>
                    {
                      openUOL(event)
                    }
                  }
                />
                <mesh
                  ref={TrainProj}
                  name="UOL"
                  
                  geometry={new THREE.BoxGeometry(1,1,1)}
                  material={new THREE.MeshBasicMaterial({opacity: 0, transparent: true  })}
                  position={[5.884, 6, 14.3]}
                  onPointerOver={() => setHovered(true)}
                  onPointerOut={() => setHovered(false)}
                  onClick={ (event) =>
                    {
                      openTrain(event)
                    }
                  }
                />
                <mesh
                  ref={Datos}
                  name="Datos"
                  
                  geometry={new THREE.BoxGeometry(0.9,0.9,0.9)}
                  material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                  position={[5.884, 6, 16.2]}
                  onPointerOver={() => setHovered(true)}
                  onPointerOut={() => setHovered(false)}
                  onClick={ (event) =>
                    {
                      openDato(event)
                    }
                  }
                />
              </group>
            )}

            
            
            {isBackToMainVisible && (
              <mesh
                ref={backToMain}
                name="BackToMain"
                
                geometry={new THREE.BoxGeometry(0.7,0.7,0.7)}
                material={new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })}
                position={[5.884, 7, 16]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={ (event) =>
                  {
                    openBackToMain(event)
                  }
                }
              />
            )}

          </group>
        )}

        {/* TERMINAL BODY AND IFRAME */}
        <group name="Terminal" position={[-4.146, 9.523, 74.462]} scale={0.191}>
          <mesh
            name="Cube062"
            castShadow
            receiveShadow
            geometry={nodes.Cube062.geometry}
            material={materials.ButtonMetal}
          />
          <group position={[-0.8, 0.5, -3.5]} rotation={[0, 180 * (Math.PI / 180), 0]}
            style={{ overflow: 'hidden' }}>
              {iframeVisible && (
                <Html 
                        occlude="blending"
                        transform 
                        scale={0.32}
                        fullscreen='true'> 
                        
                    <iframe 
                        style={{
                            width: '900px', 
                            height: '900px', 
                            border: 'none',
                            borderRadius: '100px'
                        }}
                
                        src='https://terminal-inner-website.vercel.app/'/> 
                </Html>
              )}
          </group>
        </group>

        <group name="Button" position={[-5.484, 8.568, 73.507]} scale={0.191}>
          <mesh
            name="Cube063"
            castShadow
            receiveShadow
            geometry={nodes.Cube063.geometry}
            material={materials.ButtonOutside}
          />
          <mesh
            name="Cube063_1"
            castShadow
            receiveShadow
            geometry={nodes.Cube063_1.geometry}
            material={materials.Button}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={ (event) =>
              {
                  exitTerminal(event)
              }
            }

          />
        </group>

        {/* MESCREEN */}
        <group
          name="ProjectorScreen"
          position={[-0.095, 8.895, -37.094]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          scale={0.189}
        >
          <mesh
            name="End_Cap_1_Coating_-_Black_Oxide_0"
            castShadow
            receiveShadow
            geometry={nodes["End_Cap_1_Coating_-_Black_Oxide_0"].geometry}
            material={materials.FilmScreenCaps}
          />
          <mesh
            name="End_Cap_1_Coating_-_Black_Oxide_0_1"
            castShadow
            receiveShadow
            geometry={nodes["End_Cap_1_Coating_-_Black_Oxide_0_1"].geometry}
            material={materials.Hooks}
          />
          <mesh
            name="End_Cap_1_Coating_-_Black_Oxide_0_2"
            castShadow
            receiveShadow
            geometry={nodes["End_Cap_1_Coating_-_Black_Oxide_0_2"].geometry}
            material={materials.FilmRod}
          />
          <mesh
            name="End_Cap_1_Coating_-_Black_Oxide_0_4"
            castShadow
            receiveShadow
            geometry={nodes["End_Cap_1_Coating_-_Black_Oxide_0_4"].geometry}
            material={materials.CarpetControl}
          />
        </group>

        {/* DOORS */}
        <mesh
          name="DoorLeft"
          castShadow
          receiveShadow
          geometry={nodes.DoorLeft.geometry}
          material={materials.DoorMetal}
          position={[-6.375, 3.081, 7.222]}
          rotation={[Math.PI / 2, 0, -Math.PI]}
          onClick={ (event) =>
            {
                goTrain(event)
            }
          }
        />

        {/* LIGHTS */}
        <group name="Lights">
          <group name="Spot001" position={[0.411, 10.828, -14.902]} scale={0.191}>
            <pointLight
              name="Spot001_Orientation"
              intensity={0.2}
              decay={2}
              color="#d3ceb9"
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
              shadow-normalBias={ 0.04 }
            />
          </group>
          <group name="Spot002" position={[0.411, 10.828, 5.098]} scale={0.191}>
            <pointLight
              name="Spot002_Orientation"
              intensity={0.2}
              decay={2}
              color="#d3ceb9"
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
              shadow-normalBias={ 0.04 }
            />
          </group>
          <group
            name="Spot008_1"
            position={[-4.589, 2.828, 74.098]}
            scale={0.191}
          >
            <pointLight
              name="Spot008_Orientation"
              intensity={0.2}
              decay={2}
              color="#d3ceb9"
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
              shadow-normalBias={ 0.04 }
            />
          </group>
          <group name="Spot" position={[-1.589, 14.828, 71.098]} scale={0.191}>
            <pointLight
              name="Spot_Orientation"
              intensity={0.2}
              decay={2}
              color="#d3ceb9"
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
              shadow-normalBias={ 0.04 }
            />
          </group>
          <group name="Spot003" position={[0.411, 10.828, 23.098]} scale={0.191}>
            <pointLight
              name="Spot003_Orientation"
              intensity={0.2}
              decay={2}
              color="#d3ceb9"
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
              shadow-normalBias={ 0.04 }
            />
          </group>
          <group name="Spot004" position={[0.411, 9.828, 39.098]} scale={0.191}>
            <pointLight
              name="Spot004_Orientation"
              intensity={0.2}
              decay={2}
              color="#d3ceb9"
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
              shadow-normalBias={ 0.04 }
            />
          </group>
          <group name="Spot005" position={[0.411, 8.828, -32.902]} scale={0.191}>
            <pointLight
              name="Spot005_Orientation"
              intensity={0.2}
              decay={2}
              color="#d3ceb9"
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
              shadow-normalBias={ 0.04 }
            />
          </group>
        </group>

        {/* EXTERIROR */}
        <group name="Exterior">
          <group
            name="Antena"
            position={[0.267, 8.297, 13.498]}
            rotation={[1.157, 0.057, 0.031]}
            scale={5.217}
          >
            <mesh
              name="clamppost001"
              castShadow
              receiveShadow
              geometry={nodes.clamppost001.geometry}
              material={materials.Material}
            />
            <mesh
              name="clamppost001_1"
              castShadow
              receiveShadow
              geometry={nodes.clamppost001_1.geometry}
              material={materials.AntenaMesh}
            />
          </group>
          <mesh
            name="Cables"
            castShadow
            receiveShadow
            geometry={nodes.Cables.geometry}
            material={materials.Cables}
            position={[-6.61, 2.019, -15.194]}
            rotation={[-1.37, 0.07, 0.694]}
            scale={0.783}
          />
          <group
            name="Control"
            position={[-10.432, 5.094, 69.078]}
            rotation={[Math.PI / 2, 0, 1.571]}
            scale={0.499}
          >
            <mesh
              name="Cube001"
              castShadow
              receiveShadow
              geometry={nodes.Cube001.geometry}
              material={materials.MetalOutside}
            />
            <mesh
              name="Cube001_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube001_1.geometry}
              material={materials.GlowTriangle}
            />
          </group>
          <group
            name="Boosters"
            position={[0.116, 0.796, -53.998]}
            rotation={[-1.571, 0, 0]}
            scale={32.078}
          >
            <mesh
              name="Cylinder003"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder003.geometry}
              material={materials.Material}
            />
            <mesh
              name="Cylinder003_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder003_1.geometry}
              material={materials.Tanks}
            />
            <mesh
              name="Cylinder003_2"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder003_2.geometry}
              material={materials.Turbine}
            />
            <mesh
              name="Cylinder003_3"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder003_3.geometry}
              material={materials.PointTurbine}
            />
          </group>
          <group
            name="Panel"
            position={[0.276, 17.189, 43.572]}
            rotation={[0, 0, 0.001]}
            scale={32.078}
          >
            <mesh
              name="Cube012"
              castShadow
              receiveShadow
              geometry={nodes.Cube012.geometry}
              material={materials.MetalOutside}
            />
            <mesh
              name="Cube012_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube012_1.geometry}
              material={materials.GlowRoof}
            />
          </group>
          <mesh
            name="Pipe"
            castShadow
            receiveShadow
            geometry={nodes.Pipe.geometry}
            material={materials.Pipe}
            position={[-7.16, 2.558, -44.969]}
            rotation={[0.052, 0.07, 0.694]}
            scale={7.758}
          />
          <mesh
            name="Rims"
            castShadow
            receiveShadow
            geometry={nodes.Rims.geometry}
            material={materials.MetalWall}
            position={[-10.084, -1.117, 26.013]}
            rotation={[Math.PI / 2, -0.001, 1.571]}
            scale={0.499}
          />
          <mesh
            name="Spheres"
            castShadow
            receiveShadow
            geometry={nodes.Spheres.geometry}
            material={materials.GlowCentre}
            position={[-9.993, 4.861, 62.485]}
            scale={0.242}
          />
          <group name="Train" position={[0.208, -29.945, 9.104]} scale={0.453}>
            <mesh
              name="Cube037"
              castShadow
              receiveShadow
              geometry={nodes.Cube037.geometry}
              material={materials.TrainWalls}
            />
            <mesh
              name="Cube037_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_1.geometry}
              material={materials.under}
            />
            <mesh
              name="Cube037_2"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_2.geometry}
              material={materials.windowsTrain}
            />
            <mesh
              name="Cube037_3"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_3.geometry}
              material={materials.windowSeal}
            />
            <mesh
              name="Cube037_4"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_4.geometry}
              material={materials.TrainLight}
            />
            <mesh
              name="Cube037_5"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_5.geometry}
              material={materials.windowWipers}
            />
            <mesh
              name="Cube037_6"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_6.geometry}
              material={materials.CubeMetal}
            />
            <mesh
              name="Cube037_7"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_7.geometry}
              material={materials.CubeMetal}
            />
            <mesh
              name="Cube037_8"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_8.geometry}
              material={materials.rails}
            />
            <mesh
              name="Cube037_9"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_9.geometry}
              material={materials.PaintOutsideWhite}
            />
            <mesh
              name="Cube037_10"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_10.geometry}
              material={materials.TrainWalls}
            />
            <mesh
              name="Cube037_11"
              castShadow
              receiveShadow
              geometry={nodes.Cube037_11.geometry}
              material={materials.GreyPaint}
            />
          </group>
        </group>

        {/* INTERIOR */}
        <group name="Interior"> 
          <group
            name="PorjectsTV"
            position={[5.9, 5.334, 8.3]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={0.191}
          >
            <mesh
              name="Cube023"
              castShadow
              receiveShadow
              geometry={nodes.Cube023.geometry}
              material={materials.FrameProject}
            />
            <mesh
              name="Cube023_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube023_1.geometry}
              material={materials.ButtonProject}
            />
          </group>
            
          <mesh
            name="Papers"
            castShadow
            receiveShadow
            geometry={nodes.Papers.geometry}
            material={materials.Papers}
            position={[5.931, 6.044, 19.92]}
            rotation={[-2.885, 0, -Math.PI / 2]}
            scale={0.191}
          />
          <group name="Table" position={[-0.503, -1.639, -31.016]} scale={0.191}>
            <mesh
              name="Cylinder"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder.geometry}
              material={materials.Table}
            />
            <mesh
              name="Cylinder_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder_1.geometry}
              material={materials.TableTop}
            />
          </group>
          <group
            name="Window"
            position={[3.446, 5.474, 5.005]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={0.191}
          >
            <mesh
              name="Cube038"
              castShadow
              receiveShadow
              geometry={nodes.Cube038.geometry}
              material={materials.FrameWindow}
            />
            <mesh
              name="Cube038_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube038_1.geometry}
              material={materials.windowsTrain}
            />
          </group>
          <mesh
            name="Vent"
            castShadow
            receiveShadow
            geometry={nodes.Vent.geometry}
            material={materials.MetalVent}
            position={[4.179, 7.481, 29.373]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={0.191}
          />
          <group
            name="Painting"
            position={[-5.615, 5.302, 15.512]}
            rotation={[1.575, 0, Math.PI / 2]}
            scale={0.191}
          >
            <mesh
              name="Plane006"
              castShadow
              receiveShadow
              geometry={nodes.Plane006.geometry}
              material={materials.FramePainting}
            />
            <mesh
              name="Plane006_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane006_1.geometry}
              material={materials.PaintingBorder}
            />
            <mesh
              name="Plane006_2"
              castShadow
              receiveShadow
              geometry={nodes.Plane006_2.geometry}
              material={materials.Painting2}
            />
          </group>
          <group
            name="Painting3"
            position={[-5.543, 3.97, 22.676]}
            rotation={[Math.PI, 0, Math.PI / 2]}
            scale={0.191}
          >
            <mesh
              name="Plane010"
              castShadow
              receiveShadow
              geometry={nodes.Plane010.geometry}
              material={materials.PaintingBorder}
            />
            <mesh
              name="Plane010_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane010_1.geometry}
              material={materials.Painting1}
            />
            <mesh
              name="Plane010_2"
              castShadow
              receiveShadow
              geometry={nodes.Plane010_2.geometry}
              material={materials.FramePainting}
            />
          </group>
          <group
            name="Painting2"
            position={[-5.371, 4.37, -8.594]}
            rotation={[Math.PI, 0, Math.PI / 2]}
            scale={0.192}
          >
            <mesh
              name="Plane032"
              castShadow
              receiveShadow
              geometry={nodes.Plane032.geometry}
              material={materials.PaintingBorder}
            />
            <mesh
              name="Plane032_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane032_1.geometry}
              material={materials.Painting3}
            />
            <mesh
              name="Plane032_2"
              castShadow
              receiveShadow
              geometry={nodes.Plane032_2.geometry}
              material={materials.FramePainting}
            />
          </group>
          <mesh
            name="BookShelves"
            castShadow
            receiveShadow
            geometry={nodes.BookShelves.geometry}
            material={materials.Wood}
            position={[-5.056, -0.582, 29.217]}
            rotation={[Math.PI / 2, 0, -Math.PI / 2]}
            scale={0.191}
          >
            <mesh
              name="BookShelf"
              castShadow
              receiveShadow
              geometry={nodes.BookShelf.geometry}
              material={materials.Wood}
              position={[-4.491, 4.55, 3.26]}
              rotation={[-Math.PI / 2, -Math.PI / 2, 0]}
            />
          </mesh>
          <mesh
            name="Books"
            castShadow
            receiveShadow
            geometry={nodes.Books.geometry}
            material={materials.Books}
            position={[-5.408, -0.192, 29.217]}
            scale={0.191}
          />
          <group name="Command" position={[0.176, 2.482, 71.192]} scale={0.191}>
            <mesh
              name="Cube061"
              castShadow
              receiveShadow
              geometry={nodes.Cube061.geometry}
              material={materials.ControlDesk}
            />
            <mesh
              name="Cube061_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube061_1.geometry}
              material={materials.GlowCentre}
            />
            <mesh
              name="Cube061_2"
              castShadow
              receiveShadow
              geometry={nodes.Cube061_2.geometry}
              material={materials.CubeMetal}
            />
          </group>
          <mesh
            name="Bed"
            castShadow
            receiveShadow
            geometry={nodes.Bed.geometry}
            material={materials.BedControl}
            position={[9.231, 3.408, 77.138]}
            scale={0.191}
          />
          <group
            name="CubeDecor"
            position={[1.777, 5.139, 71.49]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.191}
          >
            <mesh
              name="Cylinder001"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder001.geometry}
              material={materials.CubeMetal}
            />
            <mesh
              name="Cylinder001_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder001_1.geometry}
              material={materials.GlowCentre}
            />
          </group>
          <group name="BigDesk" position={[3.585, -0.501, -8.795]} scale={0.191}>
            <mesh
              name="Cube035"
              castShadow
              receiveShadow
              geometry={nodes.Cube035.geometry}
              material={materials.BigDesk}
            />
            <mesh
              name="Cube035_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube035_1.geometry}
              material={materials.DeskGlow}
            />
            <mesh
              name="Cube035_2"
              castShadow
              receiveShadow
              geometry={nodes.Cube035_2.geometry}
              material={materials.Stove}
            />
          </group>
          <group name="Couch" position={[5.897, 0.09, -25.303]} scale={0.191}>
            <mesh
              name="Cube024"
              castShadow
              receiveShadow
              geometry={nodes.Cube024.geometry}
              material={materials.Couch}
            />
            <mesh
              name="Cube024_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube024_1.geometry}
              material={materials.CouchCushion}
            />
          </group>
          <mesh
            name="Door"
            castShadow
            receiveShadow
            geometry={nodes.Door.geometry}
            material={materials.DoorInsideMetal}
            position={[0.146, 0.75, -38.15]}
            rotation={[Math.PI / 2, 1.571, 0]}
            scale={0.191}
          />
          <group
            name="Server"
            position={[3.4, 1.7, 32]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={2.873}
          >
            <mesh
              name="Cube002"
              castShadow
              receiveShadow
              geometry={nodes.Cube002.geometry}
              material={materials["server.001"]}
            />
            <mesh
              name="Cube002_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube002_1.geometry}
              material={materials.metalServer}
            />
          </group>
          <group
            name="Server2"
            position={[3.4, 1.7, 27]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={2.873}
          >
            <mesh
              name="Cube003"
              castShadow
              receiveShadow
              geometry={nodes.Cube003.geometry}
              material={materials["server.001"]}
            />
            <mesh
              name="Cube003_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube003_1.geometry}
              material={materials.metalServer}
            />
          </group>
          <mesh
            name="Roof"
            castShadow
            receiveShadow
            geometry={nodes.Roof.geometry}
            material={materials.Roof}
            position={[0.085, 10.934, 1.241]}
            scale={0.191}
          />
          <mesh
            name="Doorframe"
            castShadow
            receiveShadow
            geometry={nodes.Doorframe.geometry}
            material={materials.MetalWall}
            position={[-5.45, 9.36, -37.084]}
            rotation={[0, 0, Math.PI]}
            scale={0.191}
          />
          <group
            name="PanelsLeft"
            position={[0.846, 11.712, -3.497]}
            rotation={[-Math.PI / 2, 0.917, -Math.PI / 2]}
            scale={0.191}
          >
            <mesh
              name="Plane026"
              castShadow
              receiveShadow
              geometry={nodes.Plane026.geometry}
              material={materials.MetalWall}
            />
            <mesh
              name="Plane026_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane026_1.geometry}
              material={materials.GlowRoof}
            />
            <mesh
              name="Plane026_2"
              castShadow
              receiveShadow
              geometry={nodes.Plane026_2.geometry}
              material={materials.GlowTriangle}
            />
          </group>
          <group
            name="PanelsRight"
            position={[-0.601, 11.712, 4.797]}
            rotation={[-Math.PI / 2, -0.917, Math.PI / 2]}
            scale={0.191}
          >
            <mesh
              name="Plane027"
              castShadow
              receiveShadow
              geometry={nodes.Plane027.geometry}
              material={materials.MetalWall}
            />
            <mesh
              name="Plane027_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane027_1.geometry}
              material={materials.GlowRoof}
            />
            <mesh
              name="Plane027_2"
              castShadow
              receiveShadow
              geometry={nodes.Plane027_2.geometry}
              material={materials.GlowTriangle}
            />
          </group>
          <mesh
            name="WallLeft"
            castShadow
            receiveShadow
            geometry={nodes.WallLeft.geometry}
            material={materials.Walls}
            position={[-4.908, 2.863, 22.664]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            scale={0.191}
          />
          <mesh
            name="Beams"
            castShadow
            receiveShadow
            geometry={nodes.Beams.geometry}
            material={materials.MetalWall}
            position={[6.198, 9.532, 14.995]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            scale={0.191}
          />
          <mesh
            name="Arch"
            castShadow
            receiveShadow
            geometry={nodes.Arch.geometry}
            material={materials.MetalWall}
            position={[-5.921, 1.84, 47.227]}
            rotation={[Math.PI / 2, -1.571, 0]}
            scale={0.191}
          />
          <mesh
            name="WallComfy2"
            castShadow
            receiveShadow
            geometry={nodes.WallComfy2.geometry}
            material={materials.ComfyWalls}
            position={[6.132, 4.623, -24.574]}
            rotation={[-Math.PI, 0, 0]}
            scale={0.191}
          />
          <group
            name="TopLight"
            position={[0.122, 11.838, 30.221]}
            rotation={[0, -1.571, 0]}
            scale={0.191}
          >
            <mesh
              name="Cube039"
              castShadow
              receiveShadow
              geometry={nodes.Cube039.geometry}
              material={materials.RoofCentre}
            />
            <mesh
              name="Cube039_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube039_1.geometry}
              material={materials.GlowCentre}
            />
          </group>

          <mesh
            name="ScreenHolder"
            castShadow
            receiveShadow
            geometry={nodes.ScreenHolder.geometry}
            material={materials.MetalWall}
            position={[0.048, 10.716, -36.504]}
            rotation={[Math.PI / 2, 1.571, 0]}
            scale={0.191}
          />
          <group name="Floor" position={[1.037, -2.621, 39.311]} scale={0.191}>
            <mesh
              name="Plane031"
              castShadow
              receiveShadow
              geometry={nodes.Plane031.geometry}
              material={materials.Floor}
            />
            <mesh
              name="Plane031_1"
              castShadow
              receiveShadow
              geometry={nodes.Plane031_1.geometry}
              material={materials.RUG}
            />
            <mesh
              name="Plane031_2"
              castShadow
              receiveShadow
              geometry={nodes.Plane031_2.geometry}
              material={materials.RugComfy}
            />
            <mesh
              name="Plane031_3"
              castShadow
              receiveShadow
              geometry={nodes.Plane031_3.geometry}
              material={materials.Wood}
            />
          </group>
          <mesh
            name="StairHallway"
            castShadow
            receiveShadow
            geometry={nodes.StairHallway.geometry}
            material={materials.Hallway}
            position={[4.859, 11.712, 37.591]}
            scale={0.191}
          />
          <group
            name="WallRight"
            position={[6.313, 2.525, 8.009]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={0.191}
          >
            <mesh
              name="Cube032"
              castShadow
              receiveShadow
              geometry={nodes.Cube032.geometry}
              material={materials.Walls}
            />
            <mesh
              name="Cube032_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube032_1.geometry}
              material={materials.DeskGlow}
            />
            <mesh
              name="Cube032_2"
              castShadow
              receiveShadow
              geometry={nodes.Cube032_2.geometry}
              material={materials.VentHole}
            />
          </group>
          <mesh
            name="WoodBeam"
            castShadow
            receiveShadow
            geometry={nodes.WoodBeam.geometry}
            material={materials.Wood}
            position={[10.187, 2.204, 58.295]}
            scale={0.191}
          />
          <mesh
            name="Rug"
            castShadow
            receiveShadow
            geometry={nodes.Rug.geometry}
            material={materials.CarpetControl}
            position={[0.188, 2.053, 69.486]}
            scale={0.191}
          />
          <mesh
            name="DoorFloor"
            castShadow
            receiveShadow
            geometry={nodes.DoorFloor.geometry}
            material={materials.Wood}
            position={[-5.578, -2.776, 7.938]}
            rotation={[-Math.PI / 2, Math.PI / 2, 0]}
          />


        </group>

      </group>
    </group>
  );

}
