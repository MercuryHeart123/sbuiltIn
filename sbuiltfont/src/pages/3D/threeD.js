import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from "three"
import './style.css'
import Plane from './plane'
import Control from './control'
import ImportModel from './importmodel'
import * as fi from 'react-icons/fi'
import { Link } from 'react-router-dom';
import CreateMenu from './createMenu'
import EachCustomize from './eachCustomize'
import { IoChevronBack } from 'react-icons/io5';
import { useEffect } from 'react'
import axios from 'axios'
import callBase64 from './callBase64'

const ThreeD = () => {
    const [isDrag, setIsDrag] = useState(false)
    const [planeD, setPlaneD] = useState({ x: 5, y: 1, z: 5 })
    const [currentObj, setObj] = useState()
    const [lookAt, setLookAt] = useState([0, 0, 0])
    const [showMenu, setShowMenu] = useState(true)
    const [allModel, setAllModel] = useState()
    const [groupModel, setGroupModel] = useState()
    const [currentCamera, setCurrentCamera] = useState()
    const [currentScene, setCurrentScene] = useState()
    const [fetchData, setFetchData] = useState()
    const dummyModel = [{
        title: '50x240',
        modelName: '50cm',
        modelWidth: 0.5,
        modelPath: 'model/50cm.gltf',
        previewPath: 'model/wardrobe_0.5m.png'
    },
    {
        title: '70x240',
        modelName: '70cm',
        modelWidth: 0.7,
        modelPath: 'model/70cm.gltf',
        previewPath: 'model/wardrobe_0.75m.png'
    },
    {
        title: '100x240',
        modelName: '100cm',
        modelWidth: 1,
        modelPath: 'model/100cm.gltf',
        previewPath: 'model/wardrobe_1m.png'
    },
    {
        title: '100x240',
        modelName: '100cm',
        modelWidth: 1,
        modelPath: 'model/100cm.gltf',
        previewPath: 'model/wardrobe_1m.png'
    },
    {
        title: '100x240',
        modelName: '100cm',
        modelWidth: 1,
        modelPath: 'model/100cm.gltf',
        previewPath: 'model/wardrobe_1m.png'
    },
    {
        title: '100x240',
        modelName: '100cm',
        modelWidth: 1,
        modelPath: 'model/100cm.gltf',
        previewPath: 'model/wardrobe_1m.png'
    },

    ]


    const createAllModel = () => {

        return allModel.map((item, index) => {
            if (item.create) {
                return (<ImportModel
                    modelUuid={`${item.modelUuid}`}
                    modelPath={`${item.pathimg}`}
                    modelName={`${item.title}`}
                    startPosition={item.startPosition}
                    customize={item.customize}
                    dimension={planeD}
                    setIsDrag={setIsDrag}
                    currentObj={currentObj}
                    setObj={setObj}
                    setLookAt={setLookAt}
                    groupModel={groupModel}
                    setGroupModel={setGroupModel}
                    key={index}
                />)
            }
            return null

        })
    }
    useEffect(async () => {
        const url = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;
        const urlData = url + "/" + 'listmodel';
        let data = await axios.get(urlData)
        if (data.status == 200) {
            let arr = []
            data.data.map(async (item, index) => {
                item.base64 = await callBase64(item.imgforpreview);
                arr.push(item)

                if (index == data.data.length - 1) {
                    setFetchData(arr)
                }

            })

        }

    }, [])

    return (
        <div>
            <Link to='/' >
                <div className="Backbtn">
                    <IoChevronBack />
                </div>
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
                {!showMenu && !currentObj && <fi.FiMenu style={{
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
                    groupModel={groupModel}
                    setGroupModel={setGroupModel}
                    fetchData={fetchData}
                    allModel={allModel}
                    setAllModel={setAllModel}
                    setShowMenu={setShowMenu}
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
                    <div style={{ width: '100vw' }}
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
                            {/* <Box /> */}
                            {allModel && createAllModel()}


                        </Canvas>
                    </div>
                </Suspense>
            </div>
        </div >

    )
}

export default ThreeD