import React, { useRef, useState } from "react"
import { useSpring, a } from '@react-spring/three'

const Box = () => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const props = useSpring({
        scale: active ? [2, 1.5, 1.5] : [1, 3, 2],
        color: hovered ? 'red' : 'grey'
    })



    return (<a.mesh
        ref={meshRef}
        onPointerOver={() => {
            console.log(meshRef);
        }}
        onPointerOut={() => {
            setHovered(false)
        }}
        onClick={() => {
            setActive(!active)
        }}
        scale={props.scale}
        castShadow={true}
        receiveShadow={true}
    >
        <boxBufferGeometry
            attach="geometry"

        />

        <a.meshPhysicalMaterial
            attach='material'
            color={props.color} />
    </a.mesh>)
}
export default Box