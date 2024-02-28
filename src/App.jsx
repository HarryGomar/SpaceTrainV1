import './style.css';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Experience from './Experience.jsx';
import { Suspense, useState } from 'react';
import { LoadingScreen } from './LoadingScreen';

const App = () => {
    const [start, setStart] = useState(false);

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
                     <Experience />
                </Suspense>

            </Canvas>
            
            <LoadingScreen started={start} onStarted={() => setStart(true)} />
        </KeyboardControls>
    );
};
export default App;