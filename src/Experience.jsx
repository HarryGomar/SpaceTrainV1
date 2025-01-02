// Experience.jsx
import React from 'react';
import { OrbitControls } from '@react-three/drei';
import Train from './Train.jsx';
import SpaceBox from './SpaceBox.jsx';

export default function Experience({ started }) {
    return (
        <>
            {started && (
                <OrbitControls
                    makeDefault
                    panSpeed={0.1}
                    minAzimuthAngle={-2.3}  // Corrected from array to number
                    maxAzimuthAngle={0}      // Corrected from array to number
                    maxDistance={9}
                    minDistance={3}
                    maxPolarAngle={1.7}      // Corrected from array to number
                />
            )}

            <SpaceBox />

            <ambientLight intensity={1} />

            <Train scale={0.04} position={[0, 0, -1]} />
        </>
    );
}
