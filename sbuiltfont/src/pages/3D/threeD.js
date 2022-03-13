import React, { useState, Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import * as THREE from "three"
import './style.css'
import Plane from './plane'
import Control from './control'
import ImportModel from './importmodel'
import Wall from './wall'
import * as fi from 'react-icons/fi'
import * as ri from 'react-icons/ri'
import { v4 as uuidv4 } from 'uuid';
import useWindowDimensions from './useWindowDimensions '
import { Link } from 'react-router-dom';



const ThreeD = () => {
    const [angle, setAngle] = useState(0)
    const [isDrag, setIsDrag] = useState(false)
    const [planeD, setPlaneD] = useState({ x: 5, y: 1, z: 5 })
    const [currentObj, setObj] = useState()
    const [objGroup, setObjGroup] = useState([])
    const [lookAt, setLookAt] = useState([0, 0, 0])
    const [activeWall, setActiveWall] = useState(false)
    const [showMenu, setShowMenu] = useState(true)
    const [allModel, setAllModel] = useState()
    const [currentCamera, setCurrentCamera] = useState()
    const [currentScene, setCurrentScene] = useState()

    const dummyModel = [{
        title: '60x120',
        modelName: '3dyabyab',
        modelPath: 'model/3dyabyab.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979445_960_720.jpg'
    },
    {
        title: '70x120',
        modelName: 'model2',
        modelPath: 'model/model2.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2019/06/12/15/07/cat-4269479_960_720.jpg'
    },
    {
        title: '80x120',
        modelName: 'model3',
        modelPath: 'model/model3.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2016/12/04/21/58/rabbit-1882699_960_720.jpg'
    },
    ]

    function intersect(pos, camera, scene) {
        const raycaster = new THREE.Raycaster(); // create once
        raycaster.setFromCamera(pos, camera);
        return raycaster.intersectObjects(scene.children);
    }

    const CreateMenuModel = ({ dummyModel }) => {
        const { height, width } = useWindowDimensions()
        return dummyModel.map((item, index) => {
            return <img

                draggable={true}
                onDragStart={(ev) => {
                    ev.dataTransfer.effectAllowed = "all";
                }
                }
                onDragOver={(ev) => {
                    ev.preventDefault();
                    // Set the dropEffect to move
                    ev.dataTransfer.dropEffect = "copy"
                }}

                onDragEnd={(ev) => {

                    const clickMouse = new THREE.Vector2();
                    clickMouse.x = (ev.clientX / width) * 2 - 1;
                    clickMouse.y = -(ev.clientY / height) * 2 + 1;
                    let found = intersect(clickMouse, currentCamera, currentScene)
                    console.log(found, currentScene);
                    if (found.length > 0) {
                        for (let i = 0; i < found.length; i++) {
                            if (!found[i].object.userData.ground)
                                continue
                            let target = found[i].point;
                            console.log(target);
                            item.modelUuid = uuidv4()
                            item.create = true
                            item.startPosition = target
                            if (!allModel) {
                                setAllModel([item])
                            }
                            else {
                                setAllModel([...allModel, item])
                            }
                        }
                    }

                }}
                src={item.previewPath}
                style={{ maxHeight: '6vw', maxWidth: '6vw', padding: '5px' }}
            />
        })
    }
    const searchByUuid = (uuid) => {
        for (let i = 0; i < objGroup.length; i++) {
            let finding = objGroup[i]
            let index = finding.indexOf(uuid)
            console.log(index);
            if (index > -1) {
                return {
                    parentIndex: i,
                    selfIndex: index
                }
            }
        }
    }

    const checkIsIsolate = (removeIndex) => {
        if (objGroup[removeIndex.parentIndex].length > 1) {
            return false
        }
        return true

    }


    const CreateMenu = () => {

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                position: "fixed",
                zIndex: '10',
                margin: '20px',
                background: '#F1EDED',
                minWidth: '20vw',
                minHeight: '60vh',
                border: '1px solid #DCDCDC',
                borderRadius: '18px',
                padding: '10px',
            }}
                onDragOver={(ev) => {
                    ev.preventDefault();
                    ev.dataTransfer.dropEffect = "copy"
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                }}>
                    <ri.RiCloseFill onClick={() => {
                        setShowMenu(false)
                    }} />
                </div>
                <div style={{ margin: "0 auto", borderBottom: '1px solid black', height: '35px', width: '95%', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', }}>Models</h1>
                </div>

                <div className='modelType' style={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                    <div className='HeaderTopic'>
                        <h5 style={{ textDecoration: 'underline' }}>โครงตู้:</h5>
                    </div>
                    <div className='ItemList' style={{ textAlign: 'center' }}>
                        {dummyModel && <CreateMenuModel dummyModel={dummyModel} />}
                    </div>
                </div>

                <div className='modelType' style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                    <div className='HeaderTopic'>
                        <h5 style={{ textDecoration: 'underline' }}>รายการที่เลือก:</h5>
                    </div>
                    <div className='ItemList'>
                        {allModel && allModel.map((item, index) => {
                            return (<>
                                {item.create && <div onClick={() => {
                                    allModel[index].create = false
                                    let removeIndex = searchByUuid(item.modelUuid)
                                    if (checkIsIsolate(removeIndex)) {
                                        objGroup.splice(removeIndex.parentIndex, 1)
                                    }
                                    else {
                                        objGroup[removeIndex.parentIndex].splice(removeIndex.selfIndex, 1)
                                    }
                                    setObjGroup([...objGroup])
                                    setAllModel([...allModel])
                                }} >
                                    <span style={{ color: item.modelUuid == currentObj ? 'red' : 'green' }}>
                                        {item.modelName}
                                    </span>
                                </div>}


                            </>)
                        })}
                    </div>
                </div>


            </div>
        )
    }
    const createAllModel = () => {
        return allModel.map((item, index) => {
            if (item.create) {
                return (<ImportModel
                    modelUuid={`${item.modelUuid}`}
                    modelPath={`${item.modelPath}`}
                    modelName={`${item.modelName}`}
                    startPosition={item.startPosition}
                    dimension={planeD}
                    setIsDrag={setIsDrag}
                    plane={floorPlane}
                    currentObj={currentObj}
                    setObj={setObj}
                    setLookAt={setLookAt}
                    objGroup={objGroup}
                    setObjGroup={setObjGroup}
                    key={index}
                />)
            }
            return null

        })
    }
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const createWall = [0, 0, 0, 0].map((item, index) => {
        return <Wall angle={angle} dimension={planeD} face={index} />
    })

    return (
        <div>
            <Link to='/' style={{
                margin: '10px',
                padding: '10px',
                position: 'absolute',
                zIndex: '11',
                fontFamily: 'Prompt',
                textDecoration: 'none',
                color: 'black'
            }}>
                BACK
            </Link>
            <div style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                fontFamily: 'Prompt',
            }}>
                {/* <button style={{ position: "fixed", zIndex: '10' }} onClick={
                () => {
                    setActiveWall(!activeWall)
                    setLookAt([0, 0, 0])
                }
            }>Wall</button> */}
                {!showMenu && <fi.FiMenu style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: "fixed",
                    zIndex: '11',
                    margin: '10px',
                    minWidth: '5vw',
                    minHeight: '5vh',
                    padding: '10px',
                }} onClick={() => {
                    setShowMenu(true)
                }} />}
                {showMenu && <CreateMenu />}
                <Suspense fallback={null} style={{ display: 'block' }}>
                    <div
                        onDragOver={(ev) => {
                            ev.preventDefault();
                            // Set the dropEffect to move
                            ev.dataTransfer.dropEffect = "copy"
                        }}
                    >
                        <Canvas style={{ zIndex: '0' }}>
                            <Control
                                setAngle={setAngle}
                                type={isDrag}
                                lookAt={lookAt}
                                setCurrentCamera={setCurrentCamera}
                                setCurrentScene={setCurrentScene}
                            />
                            <ambientLight />
                            <Plane dimension={planeD} />
                            <spotLight position={[0, 5, 10]} />
                            {allModel && createAllModel()}
                            {activeWall && createWall}

                        </Canvas>
                    </div>
                </Suspense>
            </div>
        </div >

    )
}

export default ThreeD