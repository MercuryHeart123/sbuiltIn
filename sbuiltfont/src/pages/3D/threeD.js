import React, { useState, Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
import * as THREE from "three"
import './style.css'
import Plane from './plane'
import Control from './control'
import ImportModel from './importmodel'
import Wall from './wall'

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
            fontFamily: 'Prompt'
        }}>
            {/* <button style={{ position: "fixed", zIndex: '10' }} onClick={
                () => {
                    setActiveWall(!activeWall)
                    setLookAt([0, 0, 0])
                }
            }>Wall</button> */}
            {/* <div style={{
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
                <div style={{ margin: "0 auto", borderBottom: '1px solid black', height: '35px', width: '95%', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', }}>Models</h1>
                </div>

                <div className='modelType' style={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                    <div className='HeaderTopic'>
                        <h5 style={{ textDecoration: 'underline' }}>โครงตู้:</h5>
                    </div>
                    <div className='ItemList'>
                        Model
                    </div>
                </div>

                <div className='modelType' style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                    <div className='HeaderTopic'>
                        <h5 style={{ textDecoration: 'underline' }}>ภายในตู้:</h5>
                    </div>
                    <div className='ItemList'>
                        Model
                    </div>
                </div>


            </div> */}

            <Suspense fallback={null} style={{ display: 'block' }}>
                <Canvas style={{ zIndex: '0' }}>
                    <Control setAngle={setAngle} type={isDrag} lookAt={lookAt} />
                    <ambientLight />
                    <Plane dimension={planeD} />
                    <spotLight position={[0, 5, 10]} />
                    <ImportModel
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
                    <ImportModel
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
                    <ImportModel
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