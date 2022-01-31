import React,{ useState }  from 'react'
import {Button,Nav,Navbarcontainer,Navlogo,Navicon,HambergerIcon,NavMenu,NavItem,NavLink, NavBtn} from './navbar.element'
import { FaBars, FaTimes,  } from "react-icons/fa"
import { IconContext } from "react-icons";
import mainLogo from'../../../src/Logos.png';

const Navbar = () => {
    const [click, setclick] = useState(false)
    const clickedHandler = () => {
        setclick(!click)
    }
    return (
        <>
            <IconContext.Provider value={{ color: "black",}}>
                <Nav>
                <Navbarcontainer>
                    <Navlogo to='/'>
                    <img  src={mainLogo} style={{width:'100px'}}/>
                    </Navlogo>
                    <HambergerIcon onClick={clickedHandler}>{click ? <FaTimes /> : <FaBars />}</HambergerIcon>
                    <NavMenu onClick={clickedHandler} click={click}>
                        <NavItem >
                            <NavLink to='/'>หน้าหลัก</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to='/About'>แคตตาล้อก</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to='/3d'>ออกแบบ</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to='/Contact'>ติดต่อเรา</NavLink>
                        </NavItem>                     
                    </NavMenu>
                    </Navbarcontainer>
                </Nav>
            </IconContext.Provider>
        </>
    )
}

export default Navbar