import styled from 'styled-components'
import { Container } from '../../globalstyle'

export const Info = styled.div`
color:#fff;
padding:60px 0;
margin: 10px;
border-radius: 20px;
background:${'white'};
font-family: 'Prompt', sans-serif;
`

export const Sectionmin = styled.div`
padding: 20px;
background:'blue';
`

export const InfoRow  = styled.div`  //แนวนอน 
display:flex;
margin: 0 -15px -15px -15px;
flex-wrap:wrap;
align-items:center;
flex-direction:${({ imgStart }) => (imgStart ? 'row-reverse' : 'row')};
`
export const InfoColumn = styled.div` //แนวตั้ง
margin-bottom: 15px;
padding-right: 15px;
padding-left: 15px;
flex:1;
max-width:50%; //กว้างสุดได้แค่ 50%
/* flex-basis:50%; //กำหนดความยาวเริ่มต้น //ความยาวของไอเทมใน container  */
@media screen and (max-width:960px){
    max-width:100%;
    flex-basis:100%; //ความยาวของไอเทมใน container พอจอเล็กแล้วก็เป็น 100%
    display:flex;
    justify-content:center;
}
`

export const TextWrapper = styled.div`
max-width:550px;
padding-top:0;
padding-bottom:60px;
@media screen and (max-width:768px){
    padding-bottom:65px;
}
`

export const Topline = styled.div`
color:${({lightTopLine}) => lightTopLine ? '#a9b3c1' : '#1c2237'};
font-size:18px;
line-height:48px;
letter-spacing:1.4px;
margin-bottom:16px;
`

export const Heading = styled.h1`
margin-bottom:24px;
font-size:48px;
line-height:1.1;
color:${({lightText}) => (lightText ? '#f7f8fa' : '#1c2237')};
`

export const Subtitle = styled.p`
color:${({lightTextDesc}) => lightTextDesc ? '#a9b3c1' : '#1c2237'};
font-size:18px;
line-height:24px;
max-width:440px;
margin-bottom:35px;
`

export const  ImageWrapper = styled.div`
max-width:550px;
justify-content:${({start}) => (start ? 'flex-start' : 'flex-end')} ;
`

export const Img = styled.img`
padding-right:0;
border:0;
max-width:100%;
vertical-align:middle;
display:inline-block;
max-height:500px;
border-radius: 20px;
`