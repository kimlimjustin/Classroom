import React, { useEffect, useState } from "react";
import UserInfo from "../Library/UserInfo";
import Cookies from "universal-cookie";
import HomeNavbar from "./Navbar/home.navbar";
import Axios from "axios";
import URL from "../Static/Backend.url.static";


const Home = () => {
    const [userInfo, setUserInfo] = useState('');
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then((res) =>{if(res) setUserInfo(res); else window.location = "/login"})
    }, [])

    useEffect(() => {
        if(userInfo){
            Axios.get(`${URL}/class/get/created/${userInfo._id}`)
            .then(res => {
                res.data.forEach(_class => {
                    setClasses(classes => [...classes, _class])
                })
            })
            Axios.get(`${URL}/class/get/taught/${userInfo._id}`)
            .then(res => {
                res.data.forEach(_class => {
                    setClasses(classes => [...classes, _class])
                })
            })
            Axios.get(`${URL}/class/get/studied/${userInfo._id}`)
            .then(res => {
                res.data.forEach(_class => {
                    setClasses(classes => [...classes, _class])
                })
            })
        }
    }, [userInfo])

    //useEffect(() => console.log(classes), [classes])

    return(
        <div className="container-fluid">
            <HomeNavbar />
            <div className = "container">
                {classes.map(_class  => {
                    return <div className="class box box-shadow" key = {_class._id} onClick = {() => window.location = `/class/${_class._id}`}>
                        <h1 className="box-title">{_class.title}</h1>
                        <p className="box-text">{_class.description}</p>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Home;