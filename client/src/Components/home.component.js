import React, { useEffect, useState } from "react";
import UserInfo from "../Library/UserInfo";
import Cookies from "universal-cookie";
import HomeNavbar from "./Navbar/home.navbar";


const Home = () => {
    const [userInfo, setUserInfo] = useState('');

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then((res) =>{if(res) setUserInfo(res); else window.location = "/login"})
    }, [])

    return(
        <div className="container-fluid">
            <HomeNavbar />
            <div className = "container">
        
            </div>
        </div>
    )
}

export default Home;