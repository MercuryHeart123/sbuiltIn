import React, { useRef } from "react"
import * as THREE from "three"
import { useThree, useFrame, extend } from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

extend({ OrbitControls })
const Control = ({ type, setAngle, lookAt }) => {
    const orbitRef = useRef(null);
    const { camera, gl } = useThree()

    useFrame(() => {
        orbitRef.current.update()
        var vector = new THREE.Vector3(0, 0, -1);
        let v = camera.getWorldDirection(vector)
        let theta = Math.atan2(v.x, v.z);
        setAngle(theta)

    })


    return (
        <>
            <orbitControls

                mouseButtons={{ LEFT: 0, MIDDLE: 0, RIGHT: 0 }}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
                target={lookAt}
                // minDistance={ 3 }
                maxDistance={15}
                args={[camera, gl.domElement]}
                ref={orbitRef}
                enabled={!type}
            />

        </>
    )
}
export default Control