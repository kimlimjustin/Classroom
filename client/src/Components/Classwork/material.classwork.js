import Axios from "axios";
import React, { useEffect, useState } from "react";
import ClassNavbar from "../Navbar/class.navbar";
import moment from "moment";
import InfoById from "../../Library/InfoById";
import UserInfo from "../../Library/UserInfo";
import Cookies from "universal-cookie";
const URL = process.env.REACT_APP_BACKEND_URL;

const Material = (params) => {
    const [classInfo, setClassInfo] = useState({});
    const [material, setMaterial] = useState({});
    const [author, setAuthor] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const classId = params.match.params.classId;
    const materialId = params.match.params.materialId;
    
    useEffect(() => {
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
        .then(() => {
            Axios.get(`${URL}/classwork/get/${materialId}`)
            .then(res => {
                if(res.data.types === "material"){
                    setMaterial(() => res.data);
                    setInputTitle(res.data.title);
                    setInputDescription(res.data.description);
                }else window.location = `/class/${classId}`
            })
            .catch(() => window.location = `/class/${classId}`)
        })
        const token = new Cookies().get('token');
        UserInfo(token)
        .then(result => setUserInfo(result))
    }, [classId, materialId])
    
    useEffect(() => {
        if(material.author){
            InfoById(material.author)
            .then(result => setAuthor(result.username))
        }
    }, [material])

    const openMaterial = () => {
        const classwork = document.getElementById("classwork")
        classwork.style.display = "block";
    }

    const closeClasswork = () => {
        const classwork = document.getElementById("classwork")
        classwork.style.display = "none";
    }

    const updateClasswork = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        Axios.post(`${URL}/classwork/update/${material._id}`, {title: inputTitle, description: inputDescription, token})
        .then(res => {
            setMaterial(res.data.classwork);
            const classwork = document.getElementById("classwork");
            classwork.style.display = "none";
        })
    }

    const deleteMaterial = () => {
        if(window.confirm("Are you sure?")){
            const token = new Cookies().get('token');
            Axios.post(`${URL}/classwork/delete/${material._id}`, {author: userInfo._id, token})
            .then(() => window.location = `/class/${classId}`)
        }
    }

    return(
        <div className="container-fluid">
            <ClassNavbar classInfo = {classInfo} />
            <div className="container">
                <div className="margin-top-bottom box box-shadow">
                    <h1 className="box-title">{material.title}</h1>
                    <p className="box-text material-description">{material.description}</p>
                    <p>posted {moment(material.createdAt).fromNow()} 
                    {material.createdAt !== material.updatedAt? <span>(updated {moment(material.updatedAt).fromNow()})</span>: null} by {author}</p>
                    {material.author === userInfo._id? <div><h3><span className="link" onClick = {openMaterial}>Update</span></h3>
                    <h3><span className="link text-danger" onClick = {deleteMaterial}>Delete</span></h3></div>:null}
                </div>
            </div>
            <div className="classwork-modal" id="classwork">
                <div className="classwork-content container">
                    <span className="classwork-close" onClick = {closeClasswork}>&times;</span>
                    <h1 className="box-title">Update classwork</h1>
                    <form onSubmit = {updateClasswork}>
                        <div className="form-group">
                            <p className="form-label">Title:</p>
                            <input type = "text" className = "form-control" value ={inputTitle} onChange = {({target: {value}}) => setInputTitle(value)} required />
                        </div>
                        <div className="form-group">
                            <p className="form-label">Description:</p>
                            <textarea rows="5" type = "text" className="form-control" value={inputDescription} 
                            onChange = {({target: {value}}) => setInputDescription(value)} required />
                        </div>
                        <div className="form-group">
                            <input type = "submit" className="form-control btn btn-dark" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Material;