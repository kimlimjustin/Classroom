import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import URL from "../../Static/Backend.url.static";
import ClassNavbar from "../Navbar/class.navbar";

const ClassSetting = (params) => {
    const [classInfo, setClassInfo] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');

    useEffect(() => {
        const classId = params.match.params.classId;
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => {
            setClassInfo(() => res.data);
            setInputTitle(res.data.title);
            setInputDescription(res.data.description);
        })
    }, [params.match.params.classId])

    useEffect(() => {
        if(classInfo.owner){
            const token = new Cookies().get('token');
            UserInfo(token).then(result => {
                if(result._id === classInfo.owner) setUserInfo(result)
                else window.location = "/"
            })
        }
    }, [classInfo])

    const updateClassInfo = e => {
        e.preventDefault();
        Axios.post(`${URL}/class/update`, {title: inputTitle, description: inputDescription, _class: classInfo._id, token: userInfo.token, owner: userInfo._id})
        .then(res => console.log(res))
    }
    
    return(
        <div className="container-fluid">
            <ClassNavbar classInfo = {classInfo} />
            <div className="container">
                <form className="margin-top-bottom box box-shadow" onSubmit = {updateClassInfo}>
                    <h1 className="box-title">Class Information:</h1>
                    <div className="form-group">
                        <p className="form-label">Title:</p>
                        <input className="form-control" type = "text" value = {inputTitle} onChange = {({target: {value}}) => setInputTitle(value)} />
                    </div>
                    <div className="form-group">
                        <p className="form-label">Description:</p>
                        <textarea className='form-control' value = {inputDescription} onChange = {({target: {value}}) => setInputDescription(value)}></textarea>
                    </div>
                    <div className="form-group">
                        <input type = "submit" className="form-control btn btn-dark" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClassSetting;