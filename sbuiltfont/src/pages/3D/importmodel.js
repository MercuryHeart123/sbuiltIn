import React, { useRef, useState, useEffect } from "react"
import { useDrag } from "@use-gesture/react"
import * as THREE from "three"
import { useThree, useFrame, extend } from '@react-three/fiber'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Text } from "troika-three-text";
import Line from "./line"
import Inside from './inside'
import useWindowDimensions from "./useWindowDimensions "


extend({ Text });
const ImportModel = ({ customize, startPosition, modelUuid, modelPath, modelName, dimension, setIsDrag, setObj, currentObj, setLookAt, groupModel, setGroupModel }) => {
    const dragObjectRef = useRef();
    const textRef = useRef();
    const boxHelperRef = useRef();
    const [pos, setPos] = useState([0, 0, 0]);
    const [turn, setTurn] = useState(0)
    const [canMove, setCanMove] = useState(true)
    const [objUuid, setObjUuid] = useState()
    const [opts, setOpts] = useState({
        // font: "Prompt",
        fontSize: 0.1,
        color: "#000000",
        maxWidth: 100,
        lineHeight: 1,
        letterSpacing: 0,
        textAlign: "justify",
        materialType: "MeshPhongMaterial"
    });
    const [model, setModel] = useState(null)
    const [modelSize, setModelSize] = useState({ x: 0, y: 0, z: 0 })
    const [savePos, setSavePos] = useState([0, 1, 0])
    const [firstMeshUuid, setFirstMeshUuid] = useState()
    const [firstText, setFirstText] = useState(true)
    const { camera, scene } = useThree()
    const raycaster = new THREE.Raycaster()
    const { height, width } = useWindowDimensions()


    function createBegin() {
        for (let i = 0; i < groupModel.length; i++) {
            if (groupModel[i].modelUuid == modelUuid &&
                groupModel[i].left == false && groupModel[i].right == false) {
                return (<Line
                    position={pos}
                    defaultStart={[-modelSize.x, modelSize.y, 0]}
                    defaultEnd={[-modelSize.x, modelSize.y + 0.2, 0]}
                />)
            }
            if (groupModel[i].modelUuid == modelUuid &&
                groupModel[i].left == false && groupModel[i].right != false) {
                return (<Line
                    position={pos}
                    defaultStart={[-modelSize.x, modelSize.y, 0]}
                    defaultEnd={[-modelSize.x, modelSize.y + 0.2, 0]}
                />)
            }
        }
        return null

    }

    function createEnd() {
        for (let i = 0; i < groupModel.length; i++) {
            if (groupModel[i].modelUuid == modelUuid &&
                groupModel[i].right == false && groupModel[i].left == false) {
                return (<Line
                    position={pos}
                    defaultStart={[modelSize.x, modelSize.y, 0]}
                    defaultEnd={[modelSize.x, modelSize.y + 0.2, 0]}
                />)
            }
            if (groupModel[i].modelUuid == modelUuid &&
                groupModel[i].right == false && groupModel[i].left != false) {
                return (<Line
                    position={pos}
                    defaultStart={[modelSize.x, modelSize.y, 0]}
                    defaultEnd={[modelSize.x, modelSize.y + 0.2, 0]}
                />)
            }
        }
        return null


    }

    function traverseFindRight(objKey, key) {
        if (key == false) {
            return 0
        }
        let next = objKey[key].right

        return objKey[key].modelWidth + traverseFindRight(objKey, next)
    }
    function createText() {
        let objKey = {}
        for (let i = 0; i < groupModel.length; i++) {
            if (groupModel[i].create) {
                objKey[`${groupModel[i].modelUuid}`] = {
                    left: groupModel[i].left,
                    modelWidth: groupModel[i].modelWidth,
                    right: groupModel[i].right,
                }
            }

        }
        let arr = Object.keys(objKey).filter((item, index) => {
            if (objKey[item].left == false) {
                return item
            }
        })
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == modelUuid) {
                let range = traverseFindRight(objKey, arr[i])
                let avg = (range / 2) - objKey[arr[i]].modelWidth / 2
                return (<text
                    position-z={pos[2]}
                    position-x={pos[0] + avg}
                    position-y={firstText ? 0 : modelSize.y + 0.15 + pos[1]}
                    ref={textRef}
                    userData={{ text: true }}
                    {...opts}
                    text={`${range} m`}
                    // text={modelName}
                    anchorX="center"
                    anchorY="middle"
                />)
            }
        }
    }

    useEffect(() => {
        if (!model) {
            const loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
            loader.load(`${modelPath}`, async function (gltf) {

                gltf.scene.traverse((obj) => {

                    obj.userData.name = modelUuid
                })
                setObjUuid(modelUuid)
                var box = new THREE.Box3().setFromObject(gltf.scene);
                box.center(gltf.scene.position); // this re-sets the mesh position
                gltf.scene.position.multiplyScalar(- 1)
                var pivot = new THREE.Group();
                pivot.add(gltf.scene);
                box = new THREE.Box3().setFromObject(gltf.scene);
                setModelSize(box.max)
                if (box.min.y < 0) {
                    let x = startPosition.x
                    let z = startPosition.z
                    setPos([x, box.max.y, z])
                    setSavePos([x, box.max.y, z])
                }
                setModel(pivot)
            })
        }

    }, [])
    useFrame(() => {
        if ((model && currentObj == modelUuid)) {

            boxHelperRef.current.update()



        }
        if (model && textRef.current) {
            if (firstText) {

                setFirstText(false)

            }

            // textRef.current.position.y = 2.7

        }

        // if (textRef.current) {
        //     if (textRef.current.position.y == 0) {
        //         console.log(12);

        //         // textRef.current.position.y = 2.7

        //     }
        // }
    })

    function intersect(pos) {
        raycaster.setFromCamera(pos, camera);
        return raycaster.intersectObjects(scene.children);
    }

    const bind = useDrag(
        ({ active, movement: [x, y], timeStamp, event }) => {
            if (active && canMove && firstMeshUuid == currentObj) {

                if (currentObj !== modelUuid) {
                    setObj(modelUuid)
                }
                const clickMouse = new THREE.Vector2();
                clickMouse.x = (event.clientX / width) * 2 - 1;
                clickMouse.y = -(event.clientY / height) * 2 + 1;
                let found = intersect(clickMouse)
                if (found.length > 0) {
                    for (let i = 0; i < found.length; i++) {
                        if (!found[i].object.userData.ground) {
                            continue
                        }
                        let target = found[i].point
                        if (Math.abs(target.x) + modelSize.x > dimension.x / 2
                            || Math.abs(target.z) + modelSize.z > dimension.z / 2
                        ) {
                            continue // กันไม่ให้ obj ออกนอก ground
                        }
                        let arr = scene.children.filter((obj) => {
                            if (obj.type == "Mesh" && obj.userData.name && obj.userData.name !== objUuid && !obj.userData.ground) {
                                return obj
                            }
                        })
                        let vecNE = new THREE.Vector3(
                            target.x + modelSize.x + 0.2,
                            0,
                            target.z - modelSize.z)
                        let vecNW = new THREE.Vector3(
                            target.x - modelSize.x - 0.2,
                            0,
                            target.z - modelSize.z)
                        let vecSW = new THREE.Vector3(
                            target.x - modelSize.x - 0.2,
                            0,
                            target.z + modelSize.z)
                        let vecSE = new THREE.Vector3(
                            target.x + modelSize.x + 0.2,
                            0,
                            target.z + modelSize.z)
                        let east = target.x + modelSize.x + 0.2
                        let south = target.z - modelSize.z
                        let west = target.x - modelSize.x - 0.2
                        let north = target.z + modelSize.z
                        let state = {
                            active: true
                        }

                        let thisData
                        for (let j = 0; j < groupModel.length; j++) {
                            if (groupModel[j].modelUuid == objUuid) {
                                thisData = groupModel[j]
                                break
                            }
                        }
                        let modelWithOutThis = groupModel.filter((item, index) => {
                            if (item.modelUuid !== objUuid) {
                                return item
                            }
                        })
                        if (arr.length > 0) {
                            for (let j = 0; j < arr.length; j++) {
                                let tmpActive = false
                                let otherBox3 = new THREE.Box3().setFromObject(arr[j])
                                let otherUuid = arr[j].userData.name
                                let otherData
                                for (let k = 0; k < modelWithOutThis.length; k++) {
                                    if (modelWithOutThis[k].modelUuid == otherUuid) {
                                        otherData = modelWithOutThis[k]
                                        break
                                    }
                                }
                                if ((otherBox3.containsPoint(vecNE) || otherBox3.containsPoint(vecSE))
                                    && !otherData.left
                                ) {
                                    otherData.left = objUuid
                                    thisData.right = otherData.modelUuid
                                    thisData.left = false
                                    for (let k = 0; k < modelWithOutThis.length; k++) {
                                        if (modelWithOutThis[k].right == objUuid) {
                                            modelWithOutThis[k].right = false
                                            break
                                        }
                                    }
                                    setSavePos([otherBox3.min.x - modelSize.x, pos[1], otherBox3.max.z - modelSize.z])
                                }
                                if ((otherBox3.containsPoint(vecNW) || otherBox3.containsPoint(vecSW))
                                    && !otherData.right
                                ) {
                                    otherData.right = objUuid
                                    thisData.left = otherData.modelUuid
                                    thisData.right = false
                                    for (let k = 0; k < modelWithOutThis.length; k++) {
                                        if (modelWithOutThis[k].left == objUuid) {
                                            modelWithOutThis[k].left = false
                                            break
                                        }
                                    }
                                    setSavePos([otherBox3.max.x + modelSize.x, pos[1], otherBox3.max.z - modelSize.z])
                                }
                                if (west <= otherBox3.max.x && east >= otherBox3.min.x
                                    && south <= otherBox3.max.z && north >= otherBox3.min.z
                                ) {

                                }
                                else {
                                    tmpActive = true
                                }
                                state.active = state.active && tmpActive
                            }
                        }

                        // if(landingPoint)
                        if (state.active) {
                            thisData.left = false
                            thisData.right = false
                            for (let k = 0; k < modelWithOutThis.length; k++) {
                                if (modelWithOutThis[k].left == objUuid) {
                                    modelWithOutThis[k].left = false
                                }
                                if (modelWithOutThis[k].right == objUuid) {
                                    modelWithOutThis[k].right = false
                                }
                            }
                            let landingPoint = [target.x, pos[1], target.z]
                            setSavePos(landingPoint)
                        }
                        setPos(savePos)
                        break
                    }
                }
            }
            if (!active) {
                setLookAt(pos)
            }

            setIsDrag(active);


            return timeStamp;
        }, { axis: 'lock' }
    );



    // useHelper(dragObjectRef.current, (model && currentObj == modelUuid) ? THREE.BoxHelper : null, "blue")

    return (model ?

        <>
            <mesh
                onClick={(e) => {
                    const clickMouse = new THREE.Vector2();
                    clickMouse.x = (e.clientX / width) * 2 - 1;
                    clickMouse.y = -(e.clientY / height) * 2 + 1;
                    let found = intersect(clickMouse)
                    let uuid
                    console.log(found);
                    for (let i = 0; i < found.length; i++) {

                        if (found[i].object.type == "Mesh" && !found[i].object.userData.isCustomize) {
                            uuid = found[i].object.userData.name
                            break
                        }
                    }
                    console.log(uuid);
                    if (uuid == modelUuid) {
                        setFirstMeshUuid(uuid)
                        if (currentObj !== modelUuid) {
                            setObj(modelUuid)
                        }
                        setLookAt(pos)

                    }
                    // if (e.altKey) {
                    //     setTurn(turn + Math.PI / 2)
                    //     setModelSize({
                    //         x: modelSize.z,
                    //         y: pos[1],
                    //         z: modelSize.x
                    //     })
                    // }
                    // else if (e.ctrlKey) {
                    //     setLock(!lock)
                    // }
                }}
                userData={{ name: objUuid }}

                castShadow receiveShadow>
                <primitive
                    position={pos}
                    rotation={[0, turn, 0]}
                    // scale={[1.5,1,1]}
                    ref={dragObjectRef}
                    object={model}
                    opacity={0}
                    {...bind()}
                >
                    {customize && customize.map((item, index) => {

                        if (!item.create) {
                            return null
                        }


                        return <Inside
                            setCanMove={setCanMove}
                            parentUuid={objUuid}
                            modelUuid={item.modelUuid}
                            startPosition={item.startPosition}
                            modelPath={item.modelPath}
                            parentModelSize={modelSize}
                            currentObj={currentObj}
                            key={index}
                        />
                    })}
                </primitive>


            </mesh>
            {dragObjectRef && currentObj == modelUuid &&
                <boxHelper ref={boxHelperRef} args={[dragObjectRef.current, "blue"]} />
            }
            {createText()}

            <Line position={pos} defaultStart={[-modelSize.x, modelSize.y + 0.1, 0]} defaultEnd={[modelSize.x, modelSize.y + 0.1, 0]} />
            {createBegin()}
            {createEnd()}
        </>

        :
        null



    )
}

export default ImportModel