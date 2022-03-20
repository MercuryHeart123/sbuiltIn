import React, { Component } from 'react'
import { InfoSection } from '../../components'
import { HomeObj1, HomeObj2, HomeObj3, HomeObj4 } from './data'

const Contact = () => {
    return (
        <div style={{ minHeight: '80vh' }}>
            <InfoSection {...HomeObj3}></InfoSection>
        </div>
    )
}
export default Contact