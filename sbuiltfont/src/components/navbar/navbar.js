import React, { useState } from 'react'
import { Button, Nav, Navbarcontainer, Navlogo, Navicon, HambergerIcon, NavMenu, NavItem, NavLink, NavBtn } from './navbar.element'
import { FaBars, FaTimes, } from "react-icons/fa"
import { IconContext } from "react-icons";
import mainLogo from '../../../src/Logos.png';
import axios from 'axios'
import { connect } from "react-redux";
import { useLocation } from 'react-router-dom';

const Navbar = (props) => {
    const [click, setclick] = useState(false)
    const clickedHandler = () => {
        setclick(!click)
    }
    const LogOut = () => {
        axios.defaults.withCredentials = true;
        axios.post(`${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/logout`).then(() => {
            props.dispatch({
                type: 'logout',
                data: false,
            })
        })
    }
    let location = useLocation();
    if (location.pathname == '/3d') {
        return null
    }

    return (
        <>
            <IconContext.Provider value={{ color: "black", }}>
                <Nav>
                    <Navbarcontainer>
                        <Navlogo to='/'>
                            <img src={mainLogo} style={{ width: '80px' }} alt='' />
                        </Navlogo>
                        <HambergerIcon onClick={clickedHandler}>{click ? <FaTimes /> : <FaBars />}</HambergerIcon>
                        <NavMenu onClick={clickedHandler} click={click}>
                            <NavItem >
                                <NavLink to='/'>หน้าหลัก</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to='/catalog'>แคตตาล้อก</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to='/3d'>ออกแบบ</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to='/contact'>ติดต่อเรา</NavLink>
                            </NavItem>
                            {props.username &&
                                <>
                                    <NavItem>
                                        <NavLink to='/edit'>ปรับแต่ง</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink to='/' onClick={LogOut}>ออกจากระบบ</NavLink>
                                    </NavItem>
                                </>

                            }
                        </NavMenu>
                    </Navbarcontainer>
                </Nav>
            </IconContext.Provider>
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        username: state.username,
    };
};
export default connect(mapStateToProps)(Navbar);
