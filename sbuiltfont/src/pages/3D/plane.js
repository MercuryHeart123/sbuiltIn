import React, { useRef } from "react"

const Plane = ({ dimension }) => {
    const planeRef = useRef()

    // useHelper(planeRef, THREE.BoxHelper, "blue")
    return (
        <mesh
            ref={planeRef}
            position={[0, dimension.y / (-2), 0]}
            scale={[dimension.x, dimension.y, dimension.z]}
            userData={{ ground: true }}
            castShadow
            receiveShadow >
            <boxBufferGeometry
                attach="geometry"

            />
            <meshPhysicalMaterial attach="material" color={0xFF5757} />
        </mesh>
    )
}
export default Plane