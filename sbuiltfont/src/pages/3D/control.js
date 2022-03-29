import React, { useRef } from "react"
import * as THREE from "three"
import { useThree, useFrame, extend } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { animated, useSpring } from "@react-spring/three";

extend({ OrbitControls })
const Control = ({ type, setAngle, lookAt, setCurrentCamera, setCurrentScene }) => {
    const orbitRef = useRef(null);
    const { camera, gl, scene } = useThree()

    const { targetSpringX, targetSpringY, targetSpringZ } = useSpring({
        /* Irrelevant, always reads last value */
        /* from: { targetSpring: focusPosition.prev }, */
        targetSpringX: lookAt[0],
        targetSpringY: lookAt[1],
        targetSpringZ: lookAt[2],


    });
    // console.log(targetSpringX.animation.values[0].lastPosition);

    setCurrentCamera(camera)
    setCurrentScene(scene)
    useFrame(() => {

        if (
            orbitRef.current.target.x !== lookAt[0]
        ) {
            if (targetSpringX.animation.values[0]) {
                orbitRef.current.target.x = targetSpringX.animation.values[0].lastPosition
                orbitRef.current.target.y = targetSpringY.animation.values[0].lastPosition
                orbitRef.current.target.z = targetSpringZ.animation.values[0].lastPosition


            }
        }
        orbitRef.current.update()

    })


    return (
        <>
            <orbitControls

                mouseButtons={{ LEFT: 0, MIDDLE: 0, RIGHT: 0 }}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
                // target={lookAt}
                minDistance={1}
                maxDistance={15}
                args={[camera, gl.domElement]}
                ref={orbitRef}
                enabled={!type}
            />

        </>
    )
}
export default Control