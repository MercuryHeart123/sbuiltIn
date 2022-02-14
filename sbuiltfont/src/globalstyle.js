import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing:border-box;
    margin: 0;
    padding: 0;
    font-family: 'Prompt', sans-serif;
  }
`
export const Container = styled.div`

z-index:1;
width:80%;
/* max-width:1300px; */
margin-right:auto;
margin-left:auto;
padding-left:40px;
padding-right:40px;
font-family: 'Prompt';
@media screen and (max-width: 960px){
    padding-left:30px;
    padding-right:30px;
}
`

export default GlobalStyle;