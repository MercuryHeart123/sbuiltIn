import React, {useState, useRef, useEffect, Suspense} from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import { useSpring, a } from '@react-spring/three'
import { useDrag } from "@use-gesture/react"
import * as THREE from "three"
import { OrbitControls, useHelper } from '@react-three/drei'
import './style.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const Control= (props) => {
    const orbitRef = useRef(null);
    const { camera, gl } = useThree()

    useFrame(() => {
        orbitRef.current.update()
    })


    return(
        <>
        <OrbitControls
        
            maxPolarAngle={Math.PI/3}
            minPolarAngle={Math.PI/3}
            args={[camera, gl.domElement]}
            ref={orbitRef}
            enabled={!props.type}
        />

        </>
        
    )
}

const BoxImport = ({ dimension, setIsDrag, plane }) => {
    const dragObjectRef  = useRef();
    
    const [pos, setPos] = useState([0, 0, 0]);
    const { size, viewport } = useThree();
    const [ turn, setTurn] = useState(0)
    const [model, setModel] = useState(null)
    const [ modelSize, setModelSize] =  useState({x:0,y:0,z:0})
    const aspect = size.width / viewport.width;
    let planeIntersectPoint = new THREE.Vector3();
    const [spring, api] = useSpring(() => ({}));
    
      const bind = useDrag(
        ({ active, movement: [x, y], timeStamp, event }) => {
          if (active) {
            event.ray.intersectPlane(plane, planeIntersectPoint);
            if(Math.abs(planeIntersectPoint.x) + modelSize.x  <= dimension.x/2 
                && Math.abs(planeIntersectPoint.z) + modelSize.z <= dimension.z/2)
            {
                setPos([planeIntersectPoint.x, pos[1], planeIntersectPoint.z]);
            }
            
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
            loader.load('model/box.gltf', async function(gltf){
                
                gltf.scene.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.material.color.set( 0xFF9021 );
                        child.geometry.center(); // center here
                    }
                });
                var box = new THREE.Box3().setFromObject( gltf.scene );
                setModelSize(box.max)
                if(box.min.y < 0){
                    setPos([0,box.max.y,0])
                }
                setModel(gltf)
            })
        }
        
    })
     
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
            }}
            

            {...spring} {...bind()} castShadow>
                <primitive
                position={pos}
                rotation={[0,turn,0]}
                
                ref={dragObjectRef}
                object={model.scene}
                >

                </primitive>
            </a.mesh>
            :
            null
        

        
    )
}

const Plane = ({dimension}) => {
    const planeRef = useRef()

    useHelper(planeRef, THREE.BoxHelper, 'red')
    return (
        <mesh ref={planeRef} position={[0, dimension.y/(-2), 0]} scale={[dimension.x,dimension.y,dimension.z]} userData={{ground:true}} >
            <boxBufferGeometry
                attach="geometry"

            />
                <meshPhysicalMaterial attach="material" color="green" />
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
                setHovered(true)
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
    
const ThreeD = () =>{
        const [isDrag, setIsDrag] = useState(false)
        const [ planeD, setPlaneD] = useState({x:5,y:1,z:5})
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        
        return(
            <div>
                <button onClick={()=>{setPlaneD(
                    {x:planeD.x+1,
                    y:1,
                    z:planeD.z+1,}

                )}}>change</button>
            <Suspense fallback={null} style={{display:'block'}}>
                <Canvas>
                    <Control type={isDrag}/>
                    <ambientLight/>
                    <Plane dimension={planeD}/>
                    <spotLight position={[0, 5, 10]} />
                    <BoxImport dimension={planeD} setIsDrag={setIsDrag} plane={floorPlane}/>
                    {/* <Box/> */}
                </Canvas>
            </Suspense>
            </div>
            
        )
    }

export default ThreeD