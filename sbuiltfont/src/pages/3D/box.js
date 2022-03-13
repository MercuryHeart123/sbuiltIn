import React, { useRef, useState } from "react"
import { useSpring, a } from '@react-spring/three'
import * as THREE from "three"
import { useHelper } from "@react-three/drei";

const Box = () => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const props = useSpring({
        // scale: active ? [2, 1.5, 1.5] : [1, 3, 2],
        color: hovered ? 'red' : 'grey'
    })


    // useHelper(meshRef, THREE.BoxHelper, 'blue')
    return (
        <a.mesh
            ref={meshRef}
            onPointerOver={() => {
                setHovered(true)
            }}
            onPointerOut={() => {
                setHovered(false)
            }}
            onClick={() => {
                setActive(!active)
            }}
            // scale={props.scale}
            castShadow={true}
            receiveShadow={true}
        >
            <boxBufferGeometry
                attach="geometry"

            />

            <a.meshPhysicalMaterial
                attach='material'
                color={props.color} />
            {meshRef && <boxHelper args={[meshRef.current, 0xffff00]} />}

        </a.mesh>

    )
}
export default Box