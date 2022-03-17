import React, { useRef, useState } from "react"
// import { useSpring, a } from '@react-spring/three'
import * as THREE from "three"
import { useHelper } from "@react-three/drei";
import { useSpring, animated } from '@react-spring/three'
import { useThree, useFrame, extend } from '@react-three/fiber'

const Box = () => {

    const mesh = useRef()

    useFrame(() => {
        if (scale.animation.values[0]) {
            console.log(scale.animation.values[0].lastPosition)

        }
        mesh.current.rotation.x += 0.01
    })
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    const { scale } = useSpring({ scale: active ? 1.5 : 1 })

    return (
        <animated.mesh ref={mesh}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
            onClick={(event) => setActive(!active)}
            scale={scale}
            position={[-2.2, 0, 0]}
        >
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />

        </animated.mesh>

    )
}
export default Box