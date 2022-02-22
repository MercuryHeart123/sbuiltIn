import React, { Fragment, useCallback, useMemo, useState, useRef, useEffect, Suspense } from 'react'
import { Canvas, useThree, useFrame, extend } from 'react-three-fiber'
import { useSpring, a } from '@react-spring/three'
import { useDrag } from "@use-gesture/react"
import * as THREE from "three"
import { useGLTF } from '@react-three/drei'
import { Text } from "troika-three-text";
import { useHelper } from "@react-three/drei";
import './style.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


extend({ OrbitControls })
extend({ Text });

const Control = ({ type, setAngle, lookAt }) => {
    const orbitRef = useRef(null);
    const { camera, gl, scene } = useThree()

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
function Line({ defaultStart, defaultEnd }) {
    const [start, setStart] = useState(defaultStart)
    const [end, setEnd] = useState(defaultEnd)
    const vertices = useMemo(() => [start, end].map((v) => new THREE.Vector3(...v)), [start, end])
    const lineRef = useRef()

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices)
    return (
        <>
            <line ref={lineRef} geometry={lineGeometry}>
                <lineBasicMaterial color="red" />
            </line>
        </>
    )
}



const BoxImport = ({ modelName, dimension, setIsDrag, plane, setObj, currentObj, setLookAt, objGroup, setObjGroup }) => {
    const dragObjectRef = useRef();
    const [pos, setPos] = useState([0, 0, 0]);
    const [turn, setTurn] = useState(0)
    const [opts, setOpts] = useState({
        // font: "Philosopher",
        fontSize: 0.1,
        color: "#000000",
        maxWidth: 100,
        lineHeight: 1,
        letterSpacing: 0,
        textAlign: "justify",
        materialType: "MeshPhongMaterial"
    });
    const [firstCome, setFirstCome] = useState(true)
    const [lock, setLock] = useState(false)
    const [model, setModel] = useState(null)
    const [modelSize, setModelSize] = useState({ x: 0, y: 0, z: 0 })
    const [savePos, setSavePos] = useState([0, 1, 0])
    let planeIntersectPoint = new THREE.Vector3();
    const [planePoint, setPlanePoint] = useState()
    const [spring, api] = useSpring(() => ({}));
    const { scene, camera } = useThree()

    const isInPlane = (planeIntersectPoint) => {
        if ((Math.abs(planeIntersectPoint.x) + modelSize.x <= dimension.x / 2
            && Math.abs(planeIntersectPoint.z) + modelSize.z <= dimension.z / 2)
        ) {
            return true
        }
        // return true if object in plane area
    }
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.random() * (max - min + 1) + min
    }

    function createBegin() {
        let index = searchByUuid(modelName)
        let storeLine = []
        if (model && objGroup) {
            if (index.selfIndex == 0) {

                storeLine.push(<Line
                    defaultStart={[-modelSize.x, modelSize.y, 0]}
                    defaultEnd={[-modelSize.x, modelSize.y + 0.2, 0]}
                />)
            }
            return storeLine
        }

    }

    function createEnd() {
        let index = searchByUuid(modelName)
        let storeLine = []
        if (model && objGroup) {
            if (index.selfIndex == (objGroup[index.parentIndex].length - 1)) {
                storeLine.push(<Line
                    defaultStart={[modelSize.x, modelSize.y, 0]}
                    defaultEnd={[modelSize.x, modelSize.y + 0.2, 0]}
                />)
            }
            return storeLine
        }

    }

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
        setObjGroup(tmpObjGroup)
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
    }

    useEffect(async () => {
        if (!model) {
            const loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
            loader.load(`model/${modelName}.gltf`, async function (gltf) {

                gltf.scene.traverse((obj) => {
                    obj.userData.name = modelName
                })
                var box = new THREE.Box3().setFromObject(gltf.scene);
                box.center(gltf.scene.position); // this re-sets the mesh position
                gltf.scene.position.multiplyScalar(- 1)
                var pivot = new THREE.Group();
                pivot.add(gltf.scene);
                var box = new THREE.Box3().setFromObject(gltf.scene);
                setModelSize(box.max)
                if (box.min.y < 0) {
                    let x = randomIntFromInterval(-2.5, 2.5)
                    let z = randomIntFromInterval(-2.5, 2.5)
                    setPos([x, box.max.y, z])
                    setSavePos([x, box.max.y, z])
                }
                let arrGroup = objGroup
                arrGroup.push([modelName])
                setObjGroup(arrGroup)
                setModel(pivot)
            })
        }

    }, [])

    useFrame(() => {
        if ((model && currentObj == model.uuid)) {
            if (planePoint) {

                let arr = scene.children.filter((obj) => {
                    if (obj.type == "Mesh" && obj.userData.name !== modelName && !obj.userData.ground) {
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
                        let indexOfThisBox = searchByUuid(modelName)
                        computeGroup(indexOfThisBox, indexOfOtherBox, "RIGHT")
                        setSavePos([otherBox3.min.x - modelSize.x, planePoint[1], otherBox3.max.z - modelSize.z])
                    }
                    else if (otherBox3.containsPoint(vecNW)) {
                        let indexOfOtherBox = searchByUuid(arr[i].userData.name)
                        let indexOfThisBox = searchByUuid(modelName)
                        computeGroup(indexOfThisBox, indexOfOtherBox, "LEFT")
                        setSavePos([otherBox3.max.x + modelSize.x, planePoint[1], otherBox3.max.z - modelSize.z])
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
                    let indexOfThisBox = searchByUuid(modelName)
                    computeSeparate(indexOfThisBox)
                    setSavePos(state.planePoint)
                }
                setPos(savePos)

            }
        }


    })
    const bind = useDrag(
        ({ active, movement: [x, y], timeStamp, event }) => {

            if (active && !lock) {
                setObj(model.uuid)
                event.ray.intersectPlane(plane, planeIntersectPoint);
                if (isInPlane(planeIntersectPoint) || firstCome
                ) {
                    setPlanePoint([planeIntersectPoint.x, pos[1], planeIntersectPoint.z])
                    setPos(savePos)

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
        },
    );



    // useHelper(dragObjectRef, (model && currentObj == model.uuid) ? THREE.BoxHelper : null, "blue")

    return (model ?

        <a.mesh

            // onClick={(e) => {

            //     if (e.altKey) {
            //         setTurn(turn + Math.PI / 2)
            //         setModelSize({
            //             x: modelSize.z,
            //             y: pos[1],
            //             z: modelSize.x
            //         })
            //     }
            //     else if (e.ctrlKey) {
            //         setLock(!lock)
            //     }
            // }}
            userData={{ name: modelName }}

            castShadow>
            <primitive
                position={pos}
                rotation={[0, turn, 0]}
                // scale={[1.5,1,1]}
                ref={dragObjectRef}
                object={model}
                opacity={0}
                {...spring} {...bind()}
            >
                <text
                    position-z={0}
                    position-y={modelSize.y + 0.15}
                    {...opts}
                    // text={`${Math.round(modelSize.x * 100) / 100}`}
                    text={modelName}
                    anchorX="center"
                    anchorY="middle"
                >
                </text>
                <Line defaultStart={[-modelSize.x, modelSize.y + 0.1, 0]} defaultEnd={[modelSize.x, modelSize.y + 0.1, 0]} />
                {createBegin()}
                {createEnd()}
            </primitive>


        </a.mesh>
        :
        null



    )
}

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

const Wall = ({ dimension, angle, face }) => {
    const wallRef = useRef()
    const [active, setActive] = useState(false)
    const parentRot = new THREE.Euler(0, face * Math.PI / 2, 0, 'XYZ')
    const parentPos = new THREE.Vector3(0, 0, 0)
    const wallArgs = [5, 4, 0.2]
    const WallPos = parentPos.clone().add(new THREE.Vector3(0, 1, 2.6).applyEuler(parentRot))


    // const leftWall = useBox(() => ({
    //     type: 'Static',
    //     args: wallArgs,
    //     position: [leftWallPos.x, leftWallPos.y, leftWallPos.z],
    //     rotation: [parentRot.x, parentRot.y, parentRot.z],
    //   }))
    angle = angle + Math.PI
    // console.log(1 * Math.PI/2 + Math.PI/3);
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

const ThreeD = () => {
    const [angle, setAngle] = useState(0)
    const [isDrag, setIsDrag] = useState(false)
    const [planeD, setPlaneD] = useState({ x: 5, y: 1, z: 5 })
    const [currentObj, setObj] = useState()
    const [objGroup, setObjGroup] = useState([])
    const [lookAt, setLookAt] = useState([0, 0, 0])
    const [activeWall, setActiveWall] = useState(false)

    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const createWall = [0, 0, 0, 0].map((item, index) => {
        return <Wall angle={angle} dimension={planeD} face={index} />
    })
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row-reverse',
        }}>
            {/* <button style={{ position: "fixed", zIndex: '10' }} onClick={
                () => {
                    setActiveWall(!activeWall)
                    setLookAt([0, 0, 0])
                }
            }>Wall</button> */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                position: "fixed",
                zIndex: '10',
                margin: '20px',
                background: 'rgba(201, 208, 210, .4)',
                minWidth: '20vw',
                minHeight: '70vh'
            }}>
                <h1 style={{ margin: "0 auto" }}>3D Model</h1>
            </div>

            <Suspense fallback={null} style={{ display: 'block' }}>
                <Canvas style={{ zIndex: '0' }}>
                    <Control setAngle={setAngle} type={isDrag} lookAt={lookAt} />
                    <ambientLight />
                    <Plane dimension={planeD} />
                    <spotLight position={[0, 5, 10]} />
                    <BoxImport
                        modelName='3dyabyab'
                        dimension={planeD}
                        setIsDrag={setIsDrag}
                        plane={floorPlane}
                        currentObj={currentObj}
                        setObj={setObj}
                        setLookAt={setLookAt}
                        objGroup={objGroup}
                        setObjGroup={setObjGroup}
                    />
                    <BoxImport
                        modelName='model2'
                        dimension={planeD}
                        setIsDrag={setIsDrag}
                        plane={floorPlane}
                        currentObj={currentObj}
                        setObj={setObj}
                        setLookAt={setLookAt}
                        objGroup={objGroup}
                        setObjGroup={setObjGroup}
                    />
                    <BoxImport
                        modelName='model3'
                        dimension={planeD}
                        setIsDrag={setIsDrag}
                        plane={floorPlane}
                        currentObj={currentObj}
                        setObj={setObj}
                        setLookAt={setLookAt}
                        objGroup={objGroup}
                        setObjGroup={setObjGroup}
                    />
                    {activeWall && createWall}

                </Canvas>
            </Suspense>
        </div>

    )
}

export default ThreeD