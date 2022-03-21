import { useHover } from '@use-gesture/react';
import React, { useState } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import StackGrid from "react-stack-grid";
import './style.css'

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
    key: '6',
    src: 'https://cdn.pixabay.com/photo/2017/01/14/12/59/iceland-1979445_960_720.jpg'
  },
  {
    key: '7',
    src: 'https://cdn.pixabay.com/photo/2019/06/12/15/07/cat-4269479_960_720.jpg'
  },
  {
    key: '8',
    src: 'https://cdn.pixabay.com/photo/2016/12/04/21/58/rabbit-1882699_960_720.jpg'
  },
  {
    key: '9',
    src: 'https://cdn.pixabay.com/photo/2014/07/08/12/36/bird-386725_960_720.jpg'
  },
  {
    key: '10',
    src: 'https://cdn.pixabay.com/photo/2015/10/12/15/46/fallow-deer-984573_960_720.jpg'
  },
  {
    key: '11',
    src: 'https://cdn.pixabay.com/photo/2014/10/01/10/44/hedgehog-468228_960_720.jpg'
  }
];





const Catalog = ()=>{
  const style = {
    Imgstyle:{
      width:'100%', 
      borderRadius:'15px', 
      margin:'5px 0 5px 0',
    }
  }
  for (let i = 0 ; i < images.length; i++)
  {
    return(
    <div style={{minHeight:'80vh'}}>
      <StackGrid columnWidth={150} duration={450} monitorImagesLoaded={true} style={{cursor:'pointer',width:'100%'}}>
        {images.map((img , index) => {
          return(
            <Link to={`/desc/${index}`}>
            <div key = {`${index}`}><img className='Images' src = {img.src}></img></div>
            </Link>
          )
  })}
      </StackGrid>
    </div>
    )
  }
}

export default Catalog