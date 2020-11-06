import React, { useEffect, useState } from "react";
import UserInfo from "../../Library/UserInfo";
import Cookies from "universal-cookie";
import HomeNavbar from "../Navbar/home.navbar";
import DefaultProfilePicture from "../../Icons/profile.png";
import Axios from "axios";
import { NavLink } from "react-router-dom";

const URL = process.env.REACT_APP_BACKEND_URL;
const Profile = () => {
    const [userInfo, setUserInfo] = useState('');
    const [profile, setProfile] = useState(null);
    const [info, setInfo] = useState('');

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then((res) =>{if(res) setUserInfo(res); else window.location = "/"})
    }, [])

    useEffect(() => {
        if(userInfo){
            if(userInfo.profile_picture) setProfile(`${URL}/${userInfo.profile_picture.filename}`)
        }
    }, [userInfo])

    const ChangeProfilePicture = (e) => {
        const token = new Cookies().get('token');
        setInfo("Uploading image...");
        const formData = new FormData();
        if(e.target.files[0]){
            formData.append('myfile', e.target.files[0]);
            formData.append('token', token);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                }
            };
            Axios.post(`${URL}/users/profile_picture`, formData, config)
            .then((res) => {
                setProfile(`${URL}/${res.data}`);
                setInfo("");
            })
        }
    }

    return(
        <div className="container-fluid">
            <HomeNavbar />
            <div className="container">
                <div className="margin-top-bottom box box-shadow text-dark">
                <h1 className="box-title">Your account information:</h1>
                <h4>{info}</h4>
                    <div className="center">
                        <label htmlFor = "upload-profile-picture">
                            {profile === null
                            ?<img src={DefaultProfilePicture} className="profile-pp" alt="Default Profile Logo" title="Click to change" />
                            :<img src={profile} className="profile-pp" alt="Profile Logo" title="Click to change" />
                            }
                        </label>
                    <input type = "file" id="upload-profile-picture" accept = "image/*" onChange = {ChangeProfilePicture} />
                    </div>
                    <p className="text-label">Username: {userInfo.username}</p>
                    <p className="text-label">Email: {userInfo.email}</p>
                    <p className="text-label">Password: Your password</p>
                    <h4><NavLink to="/profile/edit" className = "link">Edit Profile</NavLink></h4>
                    <h4><NavLink to="/logout" className = "link text-danger">Logout</NavLink></h4>
                </div>
            </div>
        </div>
    )
}

export default Profile;