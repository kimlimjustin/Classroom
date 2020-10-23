import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import DefaultProfile from "../../Icons/profile.png";
import UserInfo from '../../Library/UserInfo';
import URL from '../../Static/Backend.url.static';

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
    return(
        <nav className='bg-white text-dark topnav'>
            <p className="nav-logo" onClick = {() => window.location = "/"}>Classroom</p>
            {Profile === null
            ?<img src = {DefaultProfile} alt="Default Profile Logo" className="nav-right pp" onClick = {() => window.location = "/profile"}></img>
            :<img src = {Profile} alt="Profile Logo" className="nav-right pp" onClick = {() => window.location = "/profile"}></img>
            }
            <span className="nav-right">+</span>
        </nav>
    )
}

export default HomeNavbar;