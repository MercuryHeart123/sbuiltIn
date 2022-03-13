import React, { useState, useRef } from 'react'
import { useSpring, a } from '@react-spring/three'
import * as THREE from "three"

const Wall = ({ dimension, angle, face }) => {
    const wallRef = useRef()
    const [active, setActive] = useState(false)
    const parentRot = new THREE.Euler(0, face * Math.PI / 2, 0, 'XYZ')
    const parentPos = new THREE.Vector3(0, 0, 0)
    const wallArgs = [5, 4, 0.2]
    const WallPos = parentPos.clone().add(new THREE.Vector3(0, 1, 2.6).applyEuler(parentRot))
    angle = angle + Math.PI
    if (face == 0) {
        if ((angle < Math.PI / 3 || angle > 3 * Math.PI / 2 + Math.PI / 6) && active == false) {
            setActive(true)


        }
        if (((angle > Math.PI / 3) && (angle < 3 * Math.PI / 2 + Math.PI / 6)) && active == true) {
            setActive(false)
        }
    }
    else {
        if ((angle > (face - 1) * Math.PI / 2 + Math.PI / 6 && angle < face * Math.PI / 2 + Math.PI / 3) && active == false) {
            setActive(true)


        }
        if ((angle < (face - 1) * Math.PI / 2 + Math.PI / 6 || angle > face * Math.PI / 2 + Math.PI / 3) && active == true) {
            setActive(false)
        }
    }

    const props = useSpring({
        opacity: active ? 0 : 1
    })

    return (
        <a.mesh
            ref={wallRef}
            rotation={[parentRot.x, parentRot.y, parentRot.z]}
            position={[WallPos.x, WallPos.y, WallPos.z]}
            castShadow
            receiveShadow
        // scale={[5,5,0.2]}

        >
            <boxBufferGeometry
                attach="geometry"
                args={wallArgs}
            />

            <a.meshPhysicalMaterial attach="material"
                opacity={props.opacity}
                transparent={true} color={0xFF5757} />
        </a.mesh>
    )
}

export default Wall