import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import DefaultProfile from "../../Icons/profile.png";
import UserInfo from '../../Library/UserInfo';
import URL from '../../Static/Backend.url.static';
import {NavLink} from "react-router-dom";

const HomeNavbar = () => {
    const [Profile, setProfile] = useState(null);
    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then(res => {
            if(res){
                if(res.profile_picture) setProfile(`${URL}/${res.profile_picture.filename}`)
            }
        });
    })

    const openNav = () => document.getElementById("sidenav").style.width = "250px";

    const CloseNav = () => document.getElementById("sidenav").style.width = "0px";

    return(
        <nav className='bg-white text-dark topnav'>
            <div id = "sidenav" className="sidenav">
                <span className="closebtn nav-ham" onClick={CloseNav}>&times;</span>
                <NavLink to="/">Classes</NavLink>
            </div>
            <span className="nav-logo  nav-ham" onClick = {openNav}>☰</span>
            <p className="nav-logo" onClick = {() => window.location = "/"}>Classroom</p>
            {Profile === null
            ?<img src = {DefaultProfile} alt="Default Profile Logo" className="nav-right pp" onClick = {() => window.location = "/profile"}></img>
            :<img src = {Profile} alt="Profile Logo" className="nav-right pp" onClick = {() => window.location = "/profile"}></img>
            }
            <span className="nav-right nav-ham">+</span>
        </nav>
    )
}

export default HomeNavbar;