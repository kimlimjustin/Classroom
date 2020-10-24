import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import DefaultProfile from "../../Icons/profile.png";
import URL from "../../Static/Backend.url.static";
import {NavLink} from "react-router-dom"

const ClassNavbar = ({classInfo}) => {
    const [userInfo, setUserInfo] = useState('');
    const [classes, setClasses] = useState([]);
    const [Profile, setProfile] = useState(null);

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then(result => {
            setUserInfo(result);
            if(result.profile_picture) setProfile(`${URL}/${result.profile_picture.filename}`)
        });
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

    const openNav = () => document.getElementById("sidenav").style.width = "250px";

    const CloseNav = () => document.getElementById("sidenav").style.width = "0px";

    return(
        <nav>
            <nav className='bg-white text-dark topnav'>
                <div id = "sidenav" className="sidenav">
                    <span className="closebtn nav-ham" onClick={CloseNav}>&times;</span>
                    <NavLink to="/" className="sidenav-title">Classes</NavLink>
                    {classes.map(_class => {
                        return <NavLink to = {`/class/${_class._id}`} key={_class._id} className="sidenav-item">{_class.title}</NavLink>
                    })}
                </div>
                <span className="nav-logo  nav-ham" onClick = {openNav}>☰</span>
                <p className="nav-logo nav-ham nav-class-title" onClick = {() => window.location = `/class/${classInfo._id}`}>{classInfo.title}</p>
                {Profile === null
                ?<img src = {DefaultProfile} alt="Default Profile Logo" className="nav-right pp nav-ham" onClick = {() => window.location = "/profile"}></img>
                :<img src = {Profile} alt="Profile Logo" className="nav-right pp nav-ham" onClick = {() => window.location = "/profile"}></img>
                }
            </nav>
            {Object.keys(classInfo).length > 0 &&(classInfo.teacher.includes(userInfo._id) || classInfo.owner === userInfo._id)?
                <nav className="center bg-white text-dark topnav">
                    <p className="col-3 option nav-ham"><NavLink to = {`/class/${classInfo._id}`} className=" link">Stream</NavLink></p>
                    <p className="col-3 option nav-ham">Classwork</p>
                    <p className="col-3 option nav-ham"><NavLink to = {`/class/${classInfo._id}/people`} className="link">People</NavLink></p>
                    <p className="col-3 option nav-ham">Setting</p>
                </nav>
            : <nav className="center bg-white text-dark topnav">
                <p className="col-4 nav-ham optc"><NavLink to = {`/class/${classInfo._id}`} className=" link">Stream</NavLink></p>
                <p className="col-4 nav-ham optc">Classwork</p>
                <p className="col-3 option nav-ham"><NavLink to = {`/class/${classInfo._id}/people`} className="link">People</NavLink></p>
            </nav>}
        </nav>
    )
}

export default ClassNavbar;