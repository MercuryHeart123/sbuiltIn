import React from 'react'
import './Home.css';

function Home() {
    return (
        <div className="home wrapper">
            <h2>Welcome to react project</h2>
            <br/>
            <h2>DCM viewer and CSV viewer</h2>
            <a href="https://www.kaggle.com/c/siim-covid19-detection/data" target="_blank" rel="noreferrer">DCM image and CSV file from Kaggle</a>
            <br/>
            <a href="https://www.youtube.com/watch?v=qx7pSLjLNQA" target="_blank" rel="noreferrer">Extra: Animate background using CSS</a>
            <div className="box">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className="triangle">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className="circle">
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Home;
