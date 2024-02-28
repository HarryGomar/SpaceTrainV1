import { useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls, useHelper , Html} from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Train from './Train.jsx'
import SpaceBox from './SpaceBox.jsx'


export default function Experience()
{
    const directionalLight1 = useRef()
    const directionalLight2 = useRef()
    
    return <>
    
        {/* <Perf position="top-left"/> */}

        <OrbitControls makeDefault panSpeed={0.1} minAzimuthAngle={[-2.3]}  maxAzimuthAngle={[0]} maxDistance={9} minDistance={3} maxPolarAngle={[1.7]}  />

        <directionalLight ref={directionalLight1} castShadow position={ [ -14, 4, 5 ] } intensity={ 5 } shadow-normalBias={ 0.04 } />
        <directionalLight ref={directionalLight2} castShadow position={ [ 0, 1, 16 ] } intensity={ 5 } shadow-normalBias={ 0.04 } />
        
        <SpaceBox/>

        

        <Train scale={0.04}  position= { [ 0, 0, -1]} />


    </>
}