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
        previewPath: 'model/wardrobe_0.5m.png'
    },
    {
        title: '70x240',
        modelName: '70cm',
        modelPath: 'model/70cm.gltf',
        previewPath: 'model/wardrobe_0.75m.png'
    },
    {
        title: '100x240',
        modelName: '100cm',
        modelPath: 'model/100cm.gltf',
        previewPath: 'model/wardrobe_1m.png'
    },
    {
        title: '100x240',
        modelName: '100cm',
        modelPath: 'model/100cm.gltf',
        previewPath: 'model/wardrobe_1m.png'
    },

    ]


    const createAllModel = () => {
        return allModel.map((item, index) => {
            if (item.create) {
                return (<ImportModel
                    modelUuid={`${item.modelUuid}`}
                    modelPath={`${item.modelPath}`}
                    modelName={`${item.modelName}`}
                    setAllModel={setAllModel}
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
                    cursor: 'pointer'
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
                        <Canvas
                            colorManagement
                            shadowMap
                            style={{ zIndex: '0' }}>
                            <Control
                                setAngle={setAngle}
                                type={isDrag}
                                lookAt={lookAt}
                                setCurrentCamera={setCurrentCamera}
                                setCurrentScene={setCurrentScene}
                            />
                            <ambientLight intensity={0.2} />
                            {/* <directionalLight
                                intensity={1}
                                castShadow
                                shadow-mapSize-height={512}
                                shadow-mapSize-width={512}
                            /> */}
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