// App.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Experience from './Experience.jsx';
import { LoadingScreen } from './LoadingScreen';
import './style.css';

const App = () => {
    const [start, setStart] = useState(false);

    useEffect(() => {
        if (start) {
            // Disable scrolling when the experience starts
            document.body.style.overflow = 'hidden';
        } else {
            // Enable scrolling on the loading screen
            document.body.style.overflow = 'auto';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [start]);

    return (
        <KeyboardControls
            map={[
                { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
                { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
            ]}
        >
            <Canvas
                shadows
                camera={{
                    fov: 40,
                    near: 0.05,
                    far: 200,
                    position: [-3, 1, 4],
                }}
            >
                <Suspense fallback={null}>
                    <Experience started={start} />
                </Suspense>
            </Canvas>

            <LoadingScreen started={start} onStarted={() => setStart(true)} />
        </KeyboardControls>
    );
};

export default App;
