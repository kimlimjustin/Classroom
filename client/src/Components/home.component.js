import React, { useEffect } from "react";
import UserInfo from "../Library/UserInfo";
import Cookies from "universal-cookie";

const Home = () => {
    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then((res) => console.log(res))
    }, [])
    return(
        <div></div>
    )
}

export default Home;