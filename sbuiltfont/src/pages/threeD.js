import React, {useState, useRef} from 'react'
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber'
import { useSpring, a } from '@react-spring/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import './style.css'
extend({OrbitControls})
    const Control= () => {
        const orbitRef = useRef();

        const { camera, gl } = useThree()
        useFrame(() => {
            orbitRef.current.update()
        })
        return(
            <orbitControls
                autoRotate
                maxPolarAngle={Math.PI/3}
                minPolarAngle={Math.PI/3}
                args={[camera, gl.domElement]}
                ref={orbitRef}
            />
        )
    }

const Box = () =>{
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const props = useSpring({
        scale: active ? [2, 1.5, 1.5] : [1, 3, 2],
        color: hovered ? 'red' : 'grey'
    })

    

    return(<a.mesh
            ref={meshRef}
            onPointerOver={()=> {
                setHovered(true)
            }}
            onPointerOut={()=> {
                setHovered(false)
            }}
            onClick={() => {
                setActive(!active)
            }}
            scale={props.scale}
    >
        <boxBufferGeometry
            attach="geometry"

        />
        <ambientLight/>
        <spotLight position={[0, 5, 10]}/>
        <a.meshPhysicalMaterial
            attach='material' 
            color={props.color}/>
    </a.mesh>)
}
    
const ThreeD = () =>{
        return(
            <div style={{display:'block'}}>
                <Canvas>
                    <Control/>
                    <Box/>
                </Canvas>
            </div>
            
        )
    }

export default ThreeD