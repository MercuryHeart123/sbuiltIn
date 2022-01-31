import React, {Component} from 'react'
import {InfoSection} from '../../components'
import { HomeObj1,HomeObj2,HomeObj3,HomeObj4 } from './data'

const Home = () => {
    return(
        <>
        <InfoSection {...HomeObj1}></InfoSection>
        <InfoSection {...HomeObj2}></InfoSection>
        <InfoSection {...HomeObj3}></InfoSection>
        <InfoSection {...HomeObj4}></InfoSection>
        </>
    )
}
export default Home