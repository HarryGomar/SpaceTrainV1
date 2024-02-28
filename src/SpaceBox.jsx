import { CubeTextureLoader } from "three";
import {  useThree } from "@react-three/fiber";


export default function SpaceBox()
{
    const { scene } = useThree();
    const loader = new CubeTextureLoader();
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    const texture = loader.load([
        '/SkyboxTextures/right.png', // right
        '/SkyboxTextures/left.png',  // left
        '/SkyboxTextures/top.png',   // top
        '/SkyboxTextures/bottom.png',// bottom
        '/SkyboxTextures/front.png', // front
        '/SkyboxTextures/back.png',  // back
    ]);

    // Set the scene background property to the resulting texture.
    scene.background = texture;

    return null;
}
