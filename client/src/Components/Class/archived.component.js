import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import HomeNavbar from "../Navbar/home.navbar";
const URL = process.env.REACT_APP_BACKEND_URL;
const Archived = () => {
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

    const Unarchive = (classId, owner) => {
        if(userInfo._id === owner){
            Axios.post(`${URL}/class/unarchive`, {owner, _class: classId, token: userInfo.token})
            .then(() => window.location = "/")
        }
        else{
            Axios.post(`${URL}/class/user/unarchive`, {token: userInfo.token, student: userInfo._id, _class: classId})
            .then(() => window.location = "/")
        }
    }

    return(
        <div className="container-fluid">
            <HomeNavbar />
            <div className="container">
                {classes.map(_class => {
                    if(_class.archived || userInfo.archived_class.includes(_class._id)){
                    return <div className="box class box-shadow" key = {_class._id}>
                        <div onClick = {() => window.location = `/class/${_class._id}`}>
                                <h1 className="box-title">{_class.title}</h1>
                                <p className="box-text class-description">{_class.description}</p>
                            </div>
                            {!_class.archived || _class.owner === userInfo._id
                            ?<p className="box-option link" onClick = {() => Unarchive(_class._id, _class.owner)}>Unarchive</p>
                            :null}
                        </div>
                    }else return null;
                })}
            </div>
        </div>
    )
}

export default Archived;