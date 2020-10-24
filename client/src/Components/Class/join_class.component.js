import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import HomeNavbar from "../Navbar/home.navbar";

const JoinClass = () => {
    const [inputCode, setInputCode] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = new Cookies().get("token");
        UserInfo(token).then(result => {if(result) setUserInfo(result); else window.location = "/"})
    }, [])

    const openJoinTab = () => {
        document.querySelector("#join-class").style.display = "block";
        document.querySelector("#create-class").style.display = "none";
    }
    const openCreateTab = () => {
        document.querySelector("#join-class").style.display = "none";
        document.querySelector("#create-class").style.display = "block";
    }

    return(
        <div className="container-fluid">
            <HomeNavbar />
            <div className="container">
                <div className="margin-top-bottom box box-shadow">
                    <button className="btn btn-light" onClick = {openJoinTab}>Join class</button>
                    <button className="btn btn-dark" onClick = {openCreateTab}>Create class</button>
                    <div className="box-text">
                        <div id = "join-class">
                            <div className="form-group">
                                <p className="form-label">Input a class code:</p>
                                <input type = "text" className = "form-control" value = {inputCode} onChange = {({target: {value}}) => setInputCode(value)} />
                            </div>
                            <div className="form-group">
                                <input className="form-control btn btn-dark" type = "submit" />
                            </div>
                        </div>
                        <div id = "create-class" className="box bg-dark text-color" style={{display: "none"}}>
                            <h1 className="box-title">Create class</h1>
                            <div className="form-group">
                                <p className="form-label">Class title:</p>
                                <input type ="text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <p className="form-label">Class description:</p>
                                <input type = "text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <input type = "submit" className="form-control btn btn-light" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinClass;