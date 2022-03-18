import React from "react";
import SimpleImageSlider from "react-simple-image-slider";
import StackGrid from "react-stack-grid";
import { Column ,Title} from "./Des.element";
import { IoChevronBack } from 'react-icons/io5';
import { Link } from 'react-router-dom'
import './style.css'
const Desc = () => {
    const style = {
        row:{
            display:'flex',
            flexWrap:'wrap',
            // height:'100vh',
            padding:'10px 80px 8px 80px',
            fontFamily:'Prompt'
        },
        Imgstyle:{
            width:'100%', 
            borderRadius:'15px', 
            margin:'5px 0 5px 0',
          }
    }
    const images=[
        {
          key: '0',
          src: 'https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979445_960_720.jpg'
        },
        {
          key: '1',
          src: 'https://cdn.pixabay.com/photo/2019/06/12/15/07/cat-4269479_960_720.jpg'
        },
        {
          key: '2',
          src: 'https://cdn.pixabay.com/photo/2016/12/04/21/58/rabbit-1882699_960_720.jpg'
        },
        {
          key: '3',
          src: 'https://cdn.pixabay.com/photo/2014/07/08/12/36/bird-386725_960_720.jpg'
        },
        {
          key: '4',
          src: 'https://cdn.pixabay.com/photo/2015/10/12/15/46/fallow-deer-984573_960_720.jpg'
        },
        {
          key: '5',
          src: 'https://cdn.pixabay.com/photo/2014/10/01/10/44/hedgehog-468228_960_720.jpg'
        },
        {
          key: '4',
          src: 'https://cdn.pixabay.com/photo/2015/10/12/15/46/fallow-deer-984573_960_720.jpg'
        },
      ];
    
    for (let i = 0 ; i < images.length; i++){
    
    return(
        <>
        <Link to={'/catalog'}>
            <div className="Backbtn">
                <IoChevronBack />
            </div>
        </Link>
        <div className="Descpage" style={style.row}>
                <Column className="column">
                    <img src="https://cdn.pixabay.com/photo/2014/10/01/10/44/hedgehog-468228_960_720.jpg" style={{width:'100%', borderRadius:'18px'}}></img>
                </Column>
                <Column>
                <Title>
                <h3>Title</h3>
                <span style={{fontSize:'10px'}}>@18/3/2022</span>
                </Title>
                <br />
                <span style={{fontSize:'13px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap</span>
                </Column>
        </div>

        <div style={{marginBottom:'27px'}}>
            <StackGrid columnWidth={180} duration={450} monitorImagesLoaded={true} style={{cursor:'zoom-in'}}>
                {images.map((img , index) => {
                return(
                    <div key = {`${index}`}><img style = {style.Imgstyle} src = {img.src}></img></div>
                )
                })}
            </StackGrid>
        </div>

        </>
    )

    }
}

export default Desc;