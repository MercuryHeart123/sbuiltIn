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

    const createMenuModel = (dummyModel) => {
        return dummyModel.map((item, index) => {
            return <img
                src={item.previewPath}
                style={{ maxHeight: '6vw', maxWidth: '6vw', padding: '5px' }}
                onClick={() => {
                    item.modelUuid = uuidv4()
                    item.create = true
                    if (!allModel) {
                        setAllModel([item])
                    }
                    else {

                        // const tm = allModel;
                        // tm.push(item)
                        // allModel.push(item)
                        // console.log(allModel);
                        setAllModel([...allModel, item])
                    }

                }}
            />
        })
    }

    const createMenu = () => {
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
            }}>
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
                        {dummyModel && createMenuModel(dummyModel)}
                    </div>
                </div>

                <div className='modelType' style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                    <div className='HeaderTopic'>
                        <h5 style={{ textDecoration: 'underline' }}>ภายในตู้:</h5>
                    </div>
                    <div className='ItemList'>
                        {allModel && allModel.map((item, index) => {
                            return (<>
                                {item.create && <div onClick={() => {
                                    allModel[index].create = false
                                    setAllModel([...allModel])
                                }} >
                                    <span style={{ color: item.modelUuid == currentObj ? 'red' : 'green' }}>
                                        {item.modelName}
                                    </span>
                                </div>}


                            </>)
                        })}
                        {/* {allModel && console.log(allModel)} */}
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
                    dimension={planeD}
                    setIsDrag={setIsDrag}
                    plane={floorPlane}
                    currentObj={currentObj}
                    setObj={setObj}
                    setLookAt={setLookAt}
                    objGroup={objGroup}
                    setObjGroup={setObjGroup}
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
        <div style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            fontFamily: 'Prompt'
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
            {showMenu && createMenu()}
            <Suspense fallback={null} style={{ display: 'block' }}>
                <Canvas style={{ zIndex: '0' }}>
                    <Control setAngle={setAngle} type={isDrag} lookAt={lookAt} />
                    <ambientLight />
                    <Plane dimension={planeD} />
                    <spotLight position={[0, 5, 10]} />
                    {allModel && createAllModel()}
                    {activeWall && createWall}

                </Canvas>
            </Suspense>
        </div>

    )
}

export default ThreeD