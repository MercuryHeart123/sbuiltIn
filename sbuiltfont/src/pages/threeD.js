import React, {useState, useRef, useEffect, Suspense} from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import { useSpring, a } from '@react-spring/three'
import { useDrag } from "@use-gesture/react"
import * as THREE from "three"
import { OrbitControls, useHelper } from '@react-three/drei'
import './style.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


const Control= ({type, setAngle, lookAt}) => {
    const orbitRef = useRef(null);
    const { camera, gl } = useThree()
    console.log(lookAt);
    useFrame(() => {
        // orbitRef.current.target = props.lookAt;
        orbitRef.current.update()
        // var vector = new THREE.Vector3(0, 0, -1);
        // vector.applyEuler(camera.rotation, camera.rotation.order);
        // console.log(vector);
        var vector = new THREE.Vector3( 0, 0, - 1 );
        let v = camera.getWorldDirection( vector )
        let theta = Math.atan2(v.x,v.z);
        setAngle(theta)

        // vector.applyQuaternion( camera.quaternion );
        // console.log(vector);
        // console.log(camera.rotation);

    })


    return(
        <>
        <OrbitControls

            mouseButtons={{LEFT:0,MIDDLE:0,RIGHT:0}}
            maxPolarAngle={Math.PI/2}
            minPolarAngle={Math.PI/3}
            target={lookAt}
            // minDistance={ 3 }
            maxDistance ={ 15 }
            args={[camera, gl.domElement]}
            ref={orbitRef}
            enabled={!type}
        />

        </>
        
    )
}

const BoxImport = ({ modelName, dimension, setIsDrag, plane, setObj, currentObj, setLookAt }) => {
    const dragObjectRef  = useRef();
    const [pos, setPos] = useState([0, 0, 0]);
    const { size, viewport } = useThree();
    const [ turn, setTurn] = useState(0)
    const [ firstCome, setFirstCome] = useState(true)
    const [ lock, setLock] = useState(false)
    const [ model, setModel] = useState(null)
    const [ modelSize, setModelSize] =  useState({x:0,y:0,z:0})
    const aspect = size.width / viewport.width;
    let planeIntersectPoint = new THREE.Vector3();
    const [spring, api] = useSpring(() => ({}));
    
    const isInPlane = (planeIntersectPoint) => {
        if((Math.abs(planeIntersectPoint.x) + modelSize.x  <= dimension.x/2 
                && Math.abs(planeIntersectPoint.z) + modelSize.z <= dimension.z/2)
            ){
                return true
            }
        // return true if object in plane area
    }
    
      const bind = useDrag(
        ({ active, movement: [x, y], timeStamp, event }) => {
            console.log(active);
          if (active && !lock) {
            setObj(model.uuid)
            event.ray.intersectPlane(plane, planeIntersectPoint);

            if(isInPlane(planeIntersectPoint) || firstCome
                )
            {

                setPos([planeIntersectPoint.x, pos[1], planeIntersectPoint.z]);
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
            if(isInPlane(planeIntersectPoint)){
                setFirstCome(false)
            }

          }
          if(!active){
            setLookAt(pos)
          }
          
          setIsDrag(active);
          
          
          return timeStamp;
        },
      );

    
    useEffect(async() => {
        if(!model){
            const loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/' );
            loader.setDRACOLoader( dracoLoader );
            loader.load(`model/${modelName}.gltf`, async function(gltf){
                var box = new THREE.Box3().setFromObject( gltf.scene );
                box.center( gltf.scene.position ); // this re-sets the mesh position
                gltf.scene.position.multiplyScalar( - 1 )
                var pivot = new THREE.Group();
                pivot.add( gltf.scene );
                var box = new THREE.Box3().setFromObject( gltf.scene );

                setModelSize(box.max)
                if(box.min.y < 0){
                    setPos([5,box.max.y,0])
                }
                setModel(pivot)
            })
        }
        
    })
    // useFrame(() => {

    //     console.log(model);

    // })

    useHelper(dragObjectRef , (model && currentObj == model.uuid) ? THREE.BoxHelper : null, "blue")

    return ( model ?
            
            <a.mesh 
            
            onClick={(e) => {
                if(e.altKey){
                    setTurn(turn + Math.PI/2)
                    setModelSize({
                        x:modelSize.z,
                        y:pos[1],
                        z:modelSize.x
                    })
                }
                else if(e.ctrlKey){
                    setLock(!lock)
                }
            }}
            

            {...spring} {...bind()} castShadow>
                <primitive
                position={pos}
                rotation={[0,turn,0]}
                scale={[1.5,1,1]}
                ref={dragObjectRef}
                object={model}
                >

                </primitive>
                {/* <boxHelper ref={dragObjectRef.current} args={[dragObjectRef.current, 0xffff00]} update={true}/> */}

            </a.mesh>
            :
            null
        

        
    )
}

const Plane = ({dimension}) => {
    const planeRef = useRef()
    
    // useHelper(planeRef, THREE.BoxHelper, "blue")
    return (
        <mesh 
            ref={planeRef} 
            position={[0, dimension.y/(-2), 0]} 
            scale={[dimension.x,dimension.y,dimension.z]} 
            userData={{ground:true}}
            castShadow
            receiveShadow >
            <boxBufferGeometry
                attach="geometry"

            />
                <meshPhysicalMaterial attach="material" color={0xFF5757} />
        </mesh>
    )
}

const Box = () =>{
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const props = useSpring({
        scale: active ? [2, 1.5, 1.5] : [1, 3, 2],
        color: hovered ? 'red' : 'grey'
    })

    

    return(<a.mesh
            ref={meshRef}
            onPointerOver={()=> {
                console.log(meshRef);
            }}
            onPointerOut={()=> {
                setHovered(false)
            }}
            onClick={() => {
                setActive(!active)
            }}
            scale={props.scale}
            castShadow ={true}
            receiveShadow={true}
    >
        <boxBufferGeometry
            attach="geometry"

        />
        
            <a.meshPhysicalMaterial
                attach='material' 
                color={props.color}/>
    </a.mesh>)
}

const Wall = ({dimension, angle, face}) => {
    const wallRef = useRef()
    const [active, setActive] = useState(false)
    const parentRot = new THREE.Euler( 0, face * Math.PI/2, 0, 'XYZ' )
    const parentPos = new THREE.Vector3(0,0,0)
    const wallArgs = [5, 4, 0.2]
    const leftWallPos = parentPos.clone().add(new THREE.Vector3(0, 1, 2.6).applyEuler(parentRot))


    // const leftWall = useBox(() => ({
    //     type: 'Static',
    //     args: wallArgs,
    //     position: [leftWallPos.x, leftWallPos.y, leftWallPos.z],
    //     rotation: [parentRot.x, parentRot.y, parentRot.z],
    //   }))
    angle = angle + Math.PI
    // console.log(1 * Math.PI/2 + Math.PI/3);
    if( face == 0) {
        if( (angle <   Math.PI/3 || angle > 3*Math.PI/2 + Math.PI/6) && active == false){
                setActive(true)


            }
        if(((angle > Math.PI/3) && ( angle < 3*Math.PI/2 + Math.PI/6)) && active == true){
            setActive(false)
            }
    }
    else{
        if( (angle > (face-1) * Math.PI/2 + Math.PI/6 && angle < face * Math.PI/2 + Math.PI/3 ) && active == false){
            setActive(true)
    
    
        }
        if((angle < (face-1) * Math.PI/2 + Math.PI/6 || angle > face * Math.PI/2 + Math.PI/3 ) && active == true){
            setActive(false)
        }
    }
    

    

    const props = useSpring({
        opacity: active ? 0 :1
    })

    return (
        <a.mesh 
            ref={wallRef} 
            rotation={ [parentRot.x, parentRot.y, parentRot.z]}
            position={[leftWallPos.x, leftWallPos.y, leftWallPos.z]}
            castShadow
            receiveShadow
            // userData={{go:123}}
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

const ThreeD = () =>{
        const [ angle, setAngle] = useState(0)
        const [ isDrag, setIsDrag] = useState(false)
        const [ planeD, setPlaneD] = useState({x:5,y:1,z:5})
        const [ currentObj, setObj] = useState()
        const [ lookAt, setLookAt] = useState([0,0,0])
        const [ activeWall, setActiveWall] = useState(true)
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const createWall = [0,0,0,0].map(( item, index) => {
            return <Wall angle={angle} dimension={planeD} face={index}/>
        })
        return(
            <div>
            <button style={{position:"fixed",zIndex:'10'}} onClick={() => {setActiveWall(!activeWall)}}>123</button>
            <Suspense fallback={null} style={{display:'block'}}>
                <Canvas style={{zIndex:'0'}}>
                    <Control setAngle={setAngle} type={isDrag} lookAt={lookAt}/>
                    <ambientLight/>
                    <Plane dimension={planeD}/>
                    <spotLight position={[0, 5, 10]} />
                    <BoxImport 
                        modelName='3dyabyab' 
                        dimension={planeD} 
                        setIsDrag={setIsDrag} 
                        plane={floorPlane} 
                        currentObj={currentObj} 
                        setObj={setObj}
                        setLookAt={setLookAt}/>
                    <BoxImport 
                        modelName='box' 
                        dimension={planeD} 
                        setIsDrag={setIsDrag} 
                        plane={floorPlane} 
                        currentObj={currentObj} 
                        setObj={setObj}
                        setLookAt={setLookAt}/>
                    {activeWall && createWall}
                </Canvas>
            </Suspense>
            </div>
            
        )
    }

export default ThreeD