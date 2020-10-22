import React, { useEffect } from "react";
import UserInfo from "../Library/UserInfo";
import Cookies from "universal-cookie";
import DefaultProfile from "../Icons/profile.png";

const Home = () => {
    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then((res) => console.log(res))
    }, [])

    return(
        <div className="container-fluid">
            <nav className='bg-white text-dark topnav'>
                <p className="nav-logo">Classroom</p>
                <img src = {DefaultProfile} alt="Profile Logo" className="nav-right pp"></img>
                <span className="nav-right">+</span>
            </nav>
            <div className = "container">
        
            </div>
        </div>
    )
}

export default Home;