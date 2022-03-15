import React, { useState, Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import * as THREE from "three"
import './style.css'
import Plane from './plane'
import Control from './control'
import ImportModel from './importmodel'
import Wall from './wall'
import * as fi from 'react-icons/fi'
import { Link } from 'react-router-dom';
import CreateMenu from './createMenu'
import EachCustomize from './eachCustomize'



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
        title: '50x240',
        modelName: '50cm',
        modelPath: 'model/50cm.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979445_960_720.jpg'
    },
    {
        title: '70x24',
        modelName: '70cm',
        modelPath: 'model/70cm.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2019/06/12/15/07/cat-4269479_960_720.jpg'
    },
    {
        title: '100x240',
        modelName: '100cm',
        modelPath: 'model/100cm.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2016/12/04/21/58/rabbit-1882699_960_720.jpg'
    },
    ]


    const createAllModel = () => {
        return allModel.map((item, index) => {
            if (item.create) {
                return (<ImportModel
                    modelUuid={`${item.modelUuid}`}
                    modelPath={`${item.modelPath}`}
                    modelName={`${item.modelName}`}
                    customize={item.customize}
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
                {showMenu && !currentObj && <CreateMenu
                    objGroup={objGroup}
                    setObjGroup={setObjGroup}
                    allModel={allModel}
                    setAllModel={setAllModel}
                    setShowMenu={setShowMenu}
                    dummyModel={dummyModel}
                    currentCamera={currentCamera}
                    currentScene={currentScene}

                />}
                {currentObj && <EachCustomize
                    setObj={setObj}
                    currentObj={currentObj}
                    setLookAt={setLookAt}
                    allModel={allModel}
                    setAllModel={setAllModel}
                    currentCamera={currentCamera}
                    currentScene={currentScene}
                />}
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