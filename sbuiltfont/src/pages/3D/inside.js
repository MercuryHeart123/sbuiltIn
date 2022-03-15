import React, { useRef, useState, useEffect } from "react"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"
import { useDrag } from "@use-gesture/react"
import { useThree } from 'react-three-fiber'
import useWindowDimensions from "./useWindowDimensions "

const Inside = ({ currentObj, setCanMove, parentModelSize, startPosition, modelPath }) => {
    const meshRef = useRef()
    const [model, setModel] = useState(null)
    const [pos, setPos] = useState([0, startPosition.y - parentModelSize.y, 0])
    const raycaster = new THREE.Raycaster(); // create once
    const { camera, scene } = useThree()
    const { height, width } = useWindowDimensions()

    function intersect(pos) {
        raycaster.setFromCamera(pos, camera);
        return raycaster.intersectObjects(scene.children);
    }

    const bind = useDrag(
        ({ active, movement: [x, y], timeStamp, event }) => {

            if (active) {
                setCanMove(false)
                const clickMouse = new THREE.Vector2();
                clickMouse.x = (event.clientX / width) * 2 - 1;
                clickMouse.y = -(event.clientY / height) * 2 + 1;
                let found = intersect(clickMouse)

                if (found.length > 0) {
                    for (let i = 0; i < found.length; i++) {
                        if (found[i].object.userData.name != currentObj) {
                            continue
                        }
                        let target = found[i].point;
                        setPos([0, target.y - parentModelSize.y, 0])
                        break
                    }
                }
            }
            if (!active) {
                setCanMove(true)
            }
            return timeStamp
        },
    );

    useEffect(() => {
        if (!model) {
            const loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
            loader.load(`${modelPath}`, async function (gltf) {
                var box = new THREE.Box3().setFromObject(gltf.scene);
                box.center(gltf.scene.position); // this re-sets the mesh position
                gltf.scene.position.multiplyScalar(- 1)
                var pivot = new THREE.Group();
                pivot.add(gltf.scene);
                box = new THREE.Box3().setFromObject(gltf.scene);
                setModel(pivot)
            })
        }

    }, [])
    return (model ?

        <>
            <mesh
                castShadow>
                <primitive
                    ref={meshRef}
                    object={model}
                    scale={[parentModelSize.x * 2 - 0.01, 1, 1]}
                    position={pos}
                    {...bind()}
                >

                </primitive>
            </mesh>
        </>

        :
        null



    )
}

export default Inside