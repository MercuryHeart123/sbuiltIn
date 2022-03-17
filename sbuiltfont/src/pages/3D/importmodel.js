import React, { useRef, useState, useEffect } from "react"
import { useDrag } from "@use-gesture/react"
import * as THREE from "three"
import { useThree, useFrame, extend } from '@react-three/fiber'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useSpring, a } from '@react-spring/three'
import { Text } from "troika-three-text";
import Line from "./line"
import Inside from './inside'


extend({ Text });
const ImportModel = ({ allModel, setAllModel, customize, startPosition, modelUuid, modelPath, modelName, dimension, setIsDrag, plane, setObj, currentObj, setLookAt, objGroup, setObjGroup }) => {
    const dragObjectRef = useRef();
    const [pos, setPos] = useState([0, 0, 0]);
    const [turn, setTurn] = useState(0)
    const [lock, setLock] = useState(false)
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
    const [firstCome, setFirstCome] = useState(true)
    const [model, setModel] = useState(null)
    const [modelSize, setModelSize] = useState({ x: 0, y: 0, z: 0 })
    const [savePos, setSavePos] = useState([0, 1, 0])
    let planeIntersectPoint = new THREE.Vector3();
    const [planePoint, setPlanePoint] = useState()
    const [spring, api] = useSpring(() => ({}));
    const { scene } = useThree()

    const isInPlane = (planeIntersectPoint) => {
        if ((Math.abs(planeIntersectPoint.x) + modelSize.x <= dimension.x / 2
            && Math.abs(planeIntersectPoint.z) + modelSize.z <= dimension.z / 2)
        ) {
            return true
        }
        // return true if object in plane area
    }

    function createBegin() {
        let index = searchByUuid(objUuid)
        if (index.parentIndex == -1) {
            return null
        }
        if (model && objGroup) {
            if (index.selfIndex === 0) {

                return (<Line
                    position={pos}
                    defaultStart={[-modelSize.x, modelSize.y, 0]}
                    defaultEnd={[-modelSize.x, modelSize.y + 0.2, 0]}
                />)
            }

        }

    }

    function createEnd() {
        let index = searchByUuid(objUuid)
        if (index.parentIndex == -1) {
            return null
        }
        if (model && objGroup) {
            if (index.selfIndex == (objGroup[index.parentIndex].length - 1)) {
                return (<Line
                    position={pos}
                    defaultStart={[modelSize.x, modelSize.y, 0]}
                    defaultEnd={[modelSize.x, modelSize.y + 0.2, 0]}
                />)
            }
        }

    }

    // return index of given uuid store
    const searchByUuid = (uuid) => {
        for (let i = 0; i < objGroup.length; i++) {
            let finding = objGroup[i]
            let index = finding.indexOf(uuid)
            if (index > -1) {
                return {
                    parentIndex: i,
                    selfIndex: index
                }
            }
        }
        return {
            parentIndex: -1,
            selfIndex: -1
        }
    }

    // check where are given index is (head,tail,both)
    const isHeadOrTail = (uuid, indexInObjGroup) => {

        let index = objGroup[indexInObjGroup.parentIndex].indexOf(uuid)

        if (index == 0 && objGroup[indexInObjGroup.parentIndex].length == 1) {
            return 2 // if both
        }
        if (index == 0) {
            return 0 // if head
        }
        if (index == objGroup[indexInObjGroup.parentIndex].length - 1) {
            return 1 // if tail
        }
        return -1
        // return -1

    }

    const computeGroup = (moveBox, StayBox, side) => {
        let tmpObjGroup = objGroup
        let lenOfMoveBoxGroup = objGroup[moveBox.parentIndex].length
        if (moveBox.selfIndex > 0 && moveBox.selfIndex < lenOfMoveBoxGroup) {
            return
        }

        let uuid = objGroup[moveBox.parentIndex][moveBox.selfIndex]
        if (side == "LEFT") {
            tmpObjGroup[StayBox.parentIndex].push(uuid)
        }
        else if (side == "RIGHT") {
            tmpObjGroup[StayBox.parentIndex].unshift(uuid)
        }
        if (lenOfMoveBoxGroup <= 1) {
            tmpObjGroup.splice(moveBox.parentIndex, 1)
        }
        else {
            tmpObjGroup[moveBox.parentIndex].splice(moveBox.selfIndex, 1)
        }
        setObjGroup([...tmpObjGroup])
    }

    const computeSeparate = (moveBox) => {
        let lenOfMoveBox = objGroup[moveBox.parentIndex].length
        if (lenOfMoveBox <= 1) {
            return
        }
        let tmpArr = objGroup[moveBox.parentIndex]
        let tmpValue = objGroup[moveBox.parentIndex][moveBox.selfIndex]
        let leftArray = tmpArr.slice(0, moveBox.selfIndex)
        let rightArray = tmpArr.slice(moveBox.selfIndex + 1, lenOfMoveBox)
        let separateGroup = objGroup
        separateGroup.splice(moveBox.parentIndex, 1)
        if (leftArray.length > 0) {
            separateGroup.push(leftArray)
        }
        if (rightArray.length > 0) {
            separateGroup.push(rightArray)
        }
        separateGroup.push([tmpValue])
        setObjGroup([...separateGroup])
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
                let arrGroup = objGroup
                arrGroup.push([modelUuid])
                setObjGroup(arrGroup)
                setModel(pivot)
            })
        }

    }, [])

    useFrame(() => {
        if ((model && currentObj == modelUuid)) {
            if (planePoint) {
                let arr = scene.children.filter((obj) => {
                    if (obj.type == "BoxHelper") {
                        obj.update()
                    }
                    if (obj.type == "Mesh" && obj.userData.name !== objUuid && !obj.userData.ground) {
                        return obj
                    }

                })
                let snap = 0.2
                let vecSE = new THREE.Vector3(
                    planePoint[0] + modelSize.x,
                    0,
                    planePoint[2] + modelSize.z)
                let vecNE = new THREE.Vector3(
                    planePoint[0] + modelSize.x + snap,
                    0,
                    planePoint[2] - modelSize.z)
                let vecNW = new THREE.Vector3(
                    planePoint[0] - modelSize.x - snap,
                    0,
                    planePoint[2] - modelSize.z)
                let vecSW = new THREE.Vector3(
                    planePoint[0] - modelSize.x,
                    0,
                    planePoint[2] + modelSize.z)

                let vecN = new THREE.Vector3(
                    planePoint[0],
                    0,
                    planePoint[2] - modelSize.z)
                let vecW = new THREE.Vector3(
                    planePoint[0] - modelSize.x,
                    0,
                    planePoint[2])
                let vecS = new THREE.Vector3(
                    planePoint[0],
                    0,
                    planePoint[2] + modelSize.z)
                let vecE = new THREE.Vector3(
                    planePoint[0] + modelSize.x,
                    0,
                    planePoint[2])
                let vecC = new THREE.Vector3(
                    planePoint[0],
                    0,
                    planePoint[2])
                let state = {
                    planePoint,
                    active: true
                }

                for (let i = 0; i < arr.length; i++) {
                    let otherBox3 = new THREE.Box3().setFromObject(arr[i])
                    let tmpActive = false

                    if (otherBox3.containsPoint(vecSE)) {
                        console.log("SE");
                    }
                    else if (otherBox3.containsPoint(vecNE)) {
                        let indexOfOtherBox = searchByUuid(arr[i].userData.name)
                        let result = isHeadOrTail(arr[i].userData.name, indexOfOtherBox)
                        if (result == 2 || result == 0) {
                            let indexOfThisBox = searchByUuid(objUuid)
                            computeGroup(indexOfThisBox, indexOfOtherBox, "RIGHT")
                            setSavePos([otherBox3.min.x - modelSize.x, planePoint[1], otherBox3.max.z - modelSize.z])
                        }

                    }
                    else if (otherBox3.containsPoint(vecNW)) {
                        let indexOfOtherBox = searchByUuid(arr[i].userData.name)
                        let result = isHeadOrTail(arr[i].userData.name, indexOfOtherBox)
                        if (result == 2 || result == 1) {
                            let indexOfThisBox = searchByUuid(objUuid)
                            computeGroup(indexOfThisBox, indexOfOtherBox, "LEFT")
                            setSavePos([otherBox3.max.x + modelSize.x, planePoint[1], otherBox3.max.z - modelSize.z])
                        }
                    }
                    else if (otherBox3.containsPoint(vecSW)) {
                        console.log("SW");
                    }
                    else if (otherBox3.containsPoint(vecN)) {
                        console.log("N");
                    }
                    else if (otherBox3.containsPoint(vecW)) {
                        console.log("W");
                    }
                    else if (otherBox3.containsPoint(vecS)) {
                        console.log("S");
                    }
                    else if (otherBox3.containsPoint(vecE)) {
                        console.log("E");
                    }
                    else if (otherBox3.containsPoint(vecC)) {
                        console.log("C");
                    }
                    else {
                        tmpActive = true
                    }
                    state = {
                        ...state,
                        active: state.active && tmpActive
                    }
                }

                if (state.active) {
                    let indexOfThisBox = searchByUuid(objUuid)
                    computeSeparate(indexOfThisBox)
                    setSavePos(state.planePoint)
                }
                setPos(savePos)

            }
        }


    })
    const bind = useDrag(
        ({ active, movement: [x, y], timeStamp, event }) => {

            if (active && !lock && canMove) {
                if (currentObj !== modelUuid) {
                    setObj(modelUuid)
                }

                event.ray.intersectPlane(plane, planeIntersectPoint);
                if (isInPlane(planeIntersectPoint) || firstCome
                ) {
                    setPlanePoint([planeIntersectPoint.x, pos[1], planeIntersectPoint.z])
                    // setPos(savePos)

                }

                // if((Math.abs(planeIntersectPoint.x) + modelSize.x  > dimension.x/2 && 
                // Math.abs(planeIntersectPoint.z) + modelSize.z <= dimension.z/2)
                // ){
                //     setPos([planeIntersectPoint.x/Math.abs(planeIntersectPoint.x)*dimension.x/2 -
                //         modelSize.x * planeIntersectPoint.x/Math.abs(planeIntersectPoint.x), 
                //         pos[1], 
                //         planeIntersectPoint.z]);
                // }
                // if((Math.abs(planeIntersectPoint.z) + modelSize.z  > dimension.z/2 && 
                // Math.abs(planeIntersectPoint.x) + modelSize.x <= dimension.x/2)
                // ){
                //     setPos([planeIntersectPoint.x, 
                //         pos[1], 
                //         planeIntersectPoint.z/Math.abs(planeIntersectPoint.z)*dimension.z/2 -
                //         modelSize.z * planeIntersectPoint.z/Math.abs(planeIntersectPoint.z)]);
                // }
                // if((Math.abs(planeIntersectPoint.z) + modelSize.z  > dimension.z/2 && 
                // Math.abs(planeIntersectPoint.x) + modelSize.x > dimension.x/2)
                // ){
                //     setPos([-
                //         modelSize.x * planeIntersectPoint.x/Math.abs(planeIntersectPoint.x)], 
                //         pos[1], 
                //         - modelSize.z * planeIntersectPoint.z/Math.abs(planeIntersectPoint.z));
                // }
                if (isInPlane(planeIntersectPoint)) {
                    setFirstCome(false)
                }

            }
            if (!active) {
                setLookAt(pos)
            }

            setIsDrag(active);


            return timeStamp;
        }, { delay: 250 }
    );



    // useHelper(dragObjectRef.current, (model && currentObj == modelUuid) ? THREE.BoxHelper : null, "blue")

    return (model ?

        <>
            <a.mesh

                onClick={(e) => {
                    if (currentObj !== modelUuid) {
                        setObj(modelUuid)
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
                    {...spring} {...bind()}
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
                            setAllModel={setAllModel}
                            allModel={allModel}
                            key={index}
                        />
                    })}
                </primitive>


            </a.mesh>
            {dragObjectRef && currentObj == modelUuid &&
                <boxHelper args={[dragObjectRef.current, "blue"]} />
            }
            <text
                position-z={pos[2]}
                position-x={pos[0]}
                position-y={modelSize.y + 0.15 + pos[1]}
                {...opts}
                // text={`${Math.round(modelSize.x * 100) / 100}`}
                text={modelName}
                anchorX="center"
                anchorY="middle"
            >
            </text>
            <Line position={pos} defaultStart={[-modelSize.x, modelSize.y + 0.1, 0]} defaultEnd={[modelSize.x, modelSize.y + 0.1, 0]} />
            {createBegin()}
            {createEnd()}
        </>

        :
        null



    )
}

export default ImportModel