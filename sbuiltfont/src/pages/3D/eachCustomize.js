import React, { useState, useEffect } from 'react'
import * as ri from 'react-icons/ri'
import useWindowDimensions from './useWindowDimensions '
import * as THREE from "three"

const EachCustomize = ({ setObj, currentObj, setLookAt, allModel, setAllModel, currentCamera, currentScene }) => {
    const [thisCustom, setThisCustom] = useState()
    const dummyModel = [{
        title: 'ลิ้นชักชั้นเดียว1ชั้น',
        modelName: 'ลิ้นชักชั้นเดียว1ชั้น',
        modelPath: 'model/inside/ลิ้นชักชั้นเดียว1ชั้น.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979445_960_720.jpg'
    },
    {
        title: 'ชั้นปรับระดับ',
        modelName: 'ชั้นปรับระดับ',
        modelPath: 'model/inside/ชั้นปรับระดับ.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2019/06/12/15/07/cat-4269479_960_720.jpg'
    },
    {
        title: 'ราว',
        modelName: 'ราว',
        modelPath: 'model/inside/ราว.gltf',
        previewPath: 'https://cdn.pixabay.com/photo/2016/12/04/21/58/rabbit-1882699_960_720.jpg'
    },
    ]
    const CreateMenuModel = ({ dummyModel }) => {
        const { height, width } = useWindowDimensions()

        function intersect(pos, camera, scene) {
            const raycaster = new THREE.Raycaster(); // create once
            raycaster.setFromCamera(pos, camera);
            return raycaster.intersectObjects(scene.children);
        }

        return dummyModel.map((item, index) => {
            return <img
                key={index}
                draggable={true}
                onDragStart={(ev) => {
                    ev.dataTransfer.effectAllowed = "all";
                }
                }
                onDragOver={(ev) => {
                    ev.preventDefault();
                    ev.dataTransfer.dropEffect = "copy"
                }}

                onDragEnd={(ev) => {

                    const clickMouse = new THREE.Vector2();
                    clickMouse.x = (ev.clientX / width) * 2 - 1;
                    clickMouse.y = -(ev.clientY / height) * 2 + 1;
                    let found = intersect(clickMouse, currentCamera, currentScene)
                    if (found.length > 0) {
                        for (let i = 0; i < found.length; i++) {
                            if (found[i].object.userData.name != currentObj) {
                                continue
                            }
                            let target = found[i].point;
                            item.startPosition = target
                            item.create = true
                            if (!thisCustom) {
                                setThisCustom([item])
                            }
                            else {
                                setThisCustom([...thisCustom, item])
                            }
                            break
                        }
                    }

                }}
                src={item.previewPath}
                style={{ maxHeight: '6vw', maxWidth: '6vw', padding: '5px' }}
            />
        })
    }

    useEffect(() => {
        for (let i = 0; i < allModel.length; i++) {
            if (!allModel[i].create) {
                continue
            }

            if (currentObj == allModel[i].modelUuid) {
                setThisCustom([...allModel[i].customize])
                break
            }
        }
    }, [currentObj])

    useEffect(() => {
        for (let i = 0; i < allModel.length; i++) {
            if (!allModel[i].create) {
                continue
            }

            if (currentObj == allModel[i].modelUuid) {
                allModel[i].customize = thisCustom
                setAllModel([...allModel])
            }
        }
    }, [thisCustom])

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
            userSelect: 'none'
        }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'row-reverse',
            }}>
                <ri.RiCloseFill onClick={() => {
                    setObj(false)
                    setThisCustom([])
                }} />
            </div>
            <div style={{ margin: "0 auto", borderBottom: '1px solid black', height: '35px', width: '95%', textAlign: 'center' }}>
                <h1 style={{ fontSize: '28px', }}>Models</h1>
            </div>

            <div className='modelType' style={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <div className='HeaderTopic'>
                    <h5 style={{ textDecoration: 'underline' }}>ภายใน:</h5>
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

                    {thisCustom && thisCustom.map((item, index) => {
                        return (<>
                            {item.create && <div key={index}>
                                <span>
                                    {item.title}
                                </span>
                            </div>}
                        </>)
                    })}
                </div>
            </div>


        </div>
    )
}

export default EachCustomize