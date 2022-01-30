import React, {Component} from 'react'
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
import { scroller } from "react-scroll";

const NavLink = styled(Link)`

    color: white;

    padding: 2vh 2vw 2vh 2vw;
    text-decoration: none;

    cursor: pointer;

`;
const NavMenu = styled.div`
  justify-content: space-between;
  display: flex;
  background-color: black;

  text-align: center;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const NavJump = styled.div`

    color: white;
    cursor: pointer;
    padding: 2vh 2vw 2vh 2vw;


`;

class Navbar extends Component{
    constructor(props){
        super(props);
        this.state = {
            jumpTo : null
        }
    }
    scrollToSection = () => {
        // console.log(section);
        if(this.state.jumpTo){
            scroller.scrollTo(this.state.jumpTo, {
                duration: 300,
                delay: 0,
                smooth: "easeInOutQuart",
              });
        }
        
      };
    
    render(){
        return(
            <div style={{textAlign:'center',fontSize:'1vw'}}>
                
                <NavMenu>
                    <NavLink to='/' style={{fontSize:'2vw'}}>
                        Sbuilt
                    </NavLink>
                    <section style={{display:'flex'}}>
                        <NavLink to='/' onClick={() => {
                            this.state.jumpTo = 'landing'
                            this.scrollToSection()
                        }}>Home</NavLink>
                        <NavLink to='/' onClick={() => {
                            this.state.jumpTo = 'about-us'
                            this.scrollToSection()
                        }}>About us</NavLink>
                        <NavLink to='/' onClick={() => {
                            this.state.jumpTo = 'catalog'
                            this.scrollToSection()
                        }}>Catalog</NavLink>
                        <NavLink to='/3d'>
                            3D
                        </NavLink>
                        
                    </section>
                </NavMenu>
            </div>
        )
    }
}
export default Navbar