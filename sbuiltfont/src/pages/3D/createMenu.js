import React from 'react'
import * as ri from 'react-icons/ri'
import { v4 as uuidv4 } from 'uuid';
import useWindowDimensions from './useWindowDimensions '
import * as THREE from "three"


const CreateMenu = ({ fetchData, setGroupModel, groupModel, setShowMenu, setAllModel, allModel, currentCamera, currentScene }) => {
    function intersect(pos, camera, scene) {
        const raycaster = new THREE.Raycaster(); // create once
        raycaster.setFromCamera(pos, camera);
        return raycaster.intersectObjects(scene.children);
    }

    const checkCustomCreate = (customize) => {
        let active = false
        for (let i = 0; i < customize.length; i++) {
            active = active || customize[i].create
        }
        return active
    }


    const CreateMenuModel = ({ fetchData }) => {
        const { height, width } = useWindowDimensions()
        if (!fetchData) {
            return <>
                loading...
            </>
        }
        console.log(fetchData.length);

        return fetchData.map((item, index) => {
            let container = []
            if (index % 2 == 0 && index != 0) {
                container.push(<br />)
            }
            container.push(
                <div
                    className='eachCustom'
                    draggable={true}
                    style={{ display: 'flex', flexDirection: 'column' }}
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
                                let uuid4 = uuidv4()
                                let tmpObj = JSON.parse(JSON.stringify(item));
                                tmpObj.modelUuid = uuid4
                                tmpObj.create = true
                                tmpObj.startPosition = target
                                tmpObj.showDetail = true
                                tmpObj.customize = []
                                let connection = {
                                    modelUuid: tmpObj.modelUuid,
                                    modelWidth: tmpObj.widthDimension,
                                    left: false,
                                    right: false,
                                    create: true
                                }
                                if (!allModel) {
                                    setGroupModel([connection])
                                    setAllModel([tmpObj])
                                }
                                else {
                                    setGroupModel([...groupModel, connection])
                                    setAllModel([...allModel, tmpObj])
                                }
                            }
                        }

                    }}
                >
                    <div>
                        <img
                            draggable={false}
                            src={`data:image/png;base64,${item.base64}`}
                            style={{ maxHeight: '10vw', maxWidth: '10vw', margin: '2px' }}
                        />
                    </div>
                    <div>
                        {item.title}
                    </div>

                </div>
            )
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
            minWidth: '25vw',
            maxWidth: '25vw',
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
                <ri.RiCloseFill style={{ cursor: 'pointer' }} onClick={() => {
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
                <div className='ItemList' style={{ textAlign: 'center', justifyContent: 'center', display: 'flex', flexFlow: 'wrap' }}>

                    {<CreateMenuModel fetchData={fetchData} />}
                </div>
            </div>

            <div className='modelType' style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                <div className='HeaderTopic'>
                    <h5 style={{ textDecoration: 'underline' }}>รายการที่เลือก:</h5>
                </div>
                <div className='ItemList'>
                    {allModel && allModel.map((item, index) => {
                        console.log(item);
                        return (<>
                            {item.create && <div style={{ borderBottom: '1px solid #CECECE', width: '100%', borderRadius: '7px', paddingLeft: '15px', marginBottom: '2px' }}>
                                <span style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <span>
                                        {item.title}
                                    </span>
                                    <span>
                                        {checkCustomCreate(item.customize) > 0 && (item.showDetail ?
                                            <ri.RiArrowDownSLine style={{ marginRight: '20px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    allModel[index].showDetail = false
                                                    setAllModel([...allModel])
                                                }}
                                            />
                                            : <ri.RiArrowDownSFill style={{ marginRight: '20px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    allModel[index].showDetail = true
                                                    setAllModel([...allModel])

                                                }}
                                            />)}

                                        <ri.RiCloseFill
                                            style={{ marginRight: '20px', cursor: 'pointer' }}
                                            onClick={() => {
                                                allModel[index].create = false
                                                for (let i = 0; i < groupModel.length; i++) {
                                                    if (index == i) {
                                                        continue
                                                    }
                                                    if (groupModel[i].left == groupModel[index].modelUuid) {
                                                        groupModel[i].left = false
                                                        groupModel[index].right = false
                                                        continue
                                                    }
                                                    if (groupModel[i].right == groupModel[index].modelUuid) {
                                                        groupModel[i].right = false
                                                        groupModel[index].left = false
                                                    }
                                                }
                                                groupModel[index].create = false
                                                setGroupModel([...groupModel])
                                                setAllModel([...allModel])
                                            }} />
                                    </span>

                                </span>
                                {item.showDetail && <div style={{ paddingLeft: '20px' }}>
                                    {item.customize.map((item, index) => {
                                        return <>
                                            {item.create && <div key={index}>
                                                - {item.title}
                                            </div>}
                                        </>
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