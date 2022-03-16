import React from 'react'
import * as ri from 'react-icons/ri'
import { v4 as uuidv4 } from 'uuid';
import useWindowDimensions from './useWindowDimensions '
import * as THREE from "three"



const CreateMenu = ({ setObjGroup, objGroup, setShowMenu, dummyModel, setAllModel, allModel, currentCamera, currentScene }) => {

    const checkIsIsolate = (removeIndex) => {
        if (objGroup[removeIndex.parentIndex].length > 1) {
            return false
        }
        return true

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

    function intersect(pos, camera, scene) {
        const raycaster = new THREE.Raycaster(); // create once
        raycaster.setFromCamera(pos, camera);
        return raycaster.intersectObjects(scene.children);
    }

    const CreateMenuModel = ({ dummyModel }) => {
        const { height, width } = useWindowDimensions()
        return dummyModel.map((item, index) => {
            let container = []
            if (index % 2 == 0 && index != 0) {
                container.push(<br />)
            }
            container.push(<img

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
                    if (found.length > 0) {
                        for (let i = 0; i < found.length; i++) {
                            if (!found[i].object.userData.ground)
                                continue
                            let target = found[i].point;
                            item.modelUuid = uuidv4()
                            item.create = true
                            item.startPosition = target
                            item.showDetail = true
                            item.customize = []
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
                style={{ maxHeight: '10vw', maxWidth: '10vw', padding: '5px' }}

            />)
            return container
        })
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: "fixed",
            zIndex: '10',
            margin: '20px',
            background: '#F1EDED',
            minWidth: '20vw',
            minHeight: '80vh',
            border: '1px solid #DCDCDC',
            borderRadius: '18px',
            padding: '10px',
            userSelect: 'none'
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
                            {item.create && <div>
                                <span style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <span>
                                        {item.modelName}
                                    </span>
                                    <span>
                                        {item.showDetail ?
                                            <ri.RiArrowDownSLine style={{ marginRight: '20px' }}
                                                onClick={() => {
                                                    allModel[index].showDetail = false
                                                    setAllModel([...allModel])
                                                }}
                                            />
                                            : <ri.RiArrowDownSFill style={{ marginRight: '20px' }}
                                                onClick={() => {
                                                    allModel[index].showDetail = true
                                                    setAllModel([...allModel])

                                                }}
                                            />}

                                        <ri.RiCloseFill
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
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
                                            }} />
                                    </span>

                                </span>
                                {item.showDetail && <div style={{ paddingLeft: '20px' }}>
                                    {item.customize.map((item, index) => {
                                        return <div key={index}>- {item.title}</div>
                                    })}
                                </div>}
                            </div>}


                        </>)
                    })}
                </div>
            </div>


        </div>
    )
}

export default CreateMenu