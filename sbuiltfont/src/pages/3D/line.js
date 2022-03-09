import React, { useMemo, useState, useRef } from 'react'
import * as THREE from "three"
import { useHelper } from "@react-three/drei";


function Line({ position, defaultStart, defaultEnd }) {
    const Ds = defaultStart.map((item, index) => {
        return item + position[index]
    })
    const De = defaultEnd.map((item, index) => {
        return item + position[index]
    })
    // const [start, setStart] = useState(Ds)
    // const [end, setEnd] = useState(De)
    // setStart(Ds)
    // setEnd(De)


    const vertices = useMemo(() => [Ds, De].map((v) => new THREE.Vector3(...v)), [Ds, De])
    const lineRef = useRef()
    // vertices.map((item, index) => {
    //     return item.add(shiftVector)
    // })
    // console.log("before", position);

    // vertices[0].add(shiftVector)
    // vertices[1].add(shiftVector)

    // console.log("after", vertices);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices)
    // useHelper(lineRef, THREE.BoxHelper, "blue")

    return (
        <>
            <line ref={lineRef} geometry={lineGeometry}>
                <lineBasicMaterial color="red" />
            </line>
        </>
    )
}

export default Line