import React, { useRef, useState, useEffect } from "react"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"
import { useDrag } from "@use-gesture/react"
import { useThree } from '@react-three/fiber'
import useWindowDimensions from "./useWindowDimensions "

const Inside = ({ parentUuid, modelUuid, currentObj, setCanMove, parentModelSize, startPosition, modelPath }) => {
    const meshRef = useRef()
    const [model, setModel] = useState(null)
    const [pos, setPos] = useState([0, startPosition.y - parentModelSize.y, 0])
    const [savePos, setSavePos] = useState([0, startPosition.y - parentModelSize.y, 0])
    const raycaster = new THREE.Raycaster(); // create once
    const { camera, scene } = useThree()
    const { height, width } = useWindowDimensions()
    const [modelSize, setModelSize] = useState()
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
                        let landingPoint = target.y - parentModelSize.y
                        let arr = [];
                        let down = landingPoint - modelSize.y + parentModelSize.y
                        let up = landingPoint + modelSize.y + parentModelSize.y
                        if (down > 0 && up < parentModelSize.y * 2) {
                            for (let j = 0; j < scene.children.length; j++) {
                                if (parentUuid !== scene.children[j].userData.name) {
                                    continue
                                }
                                scene.children[j].traverse((obj) => {
                                    if (obj.userData.isCustomize && obj.userData.name != modelUuid) {
                                        arr.push(obj)

                                    }
                                })
                                break
                            }
                            let state = {
                                active: true
                            }
                            if (arr.length > 0) {
                                for (let j = 0; j < arr.length; j++) {
                                    let tmpActive = false
                                    let otherBox3 = new THREE.Box3().setFromObject(arr[j])
                                    if (down <= otherBox3.max.y && up >= otherBox3.min.y) {

                                    }
                                    else {
                                        tmpActive = true
                                    }
                                    state.active = state.active && tmpActive
                                }

                            }
                            if (state.active) {
                                setSavePos([0, landingPoint, 0])
                            }
                            setPos(savePos)
                        }
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
                gltf.scene.traverse((obj) => {
                    obj.userData.name = modelUuid
                    obj.userData.isCustomize = true
                })
                var box = new THREE.Box3().setFromObject(gltf.scene);
                box.center(gltf.scene.position); // this re-sets the mesh position
                gltf.scene.position.multiplyScalar(- 1)
                var pivot = new THREE.Group();
                pivot.add(gltf.scene);
                box = new THREE.Box3().setFromObject(gltf.scene);
                setModelSize(box.max)
                setModel(pivot)
            })
        }


    }, [])
    return (model ?

        <>
            <mesh
                userData={{
                    name: modelUuid,
                    isCustomize: true
                }}
                castShadow receiveShadow>
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