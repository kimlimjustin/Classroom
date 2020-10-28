import Axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../../Static/Backend.url.static";
import ClassNavbar from "../Navbar/class.navbar";
import moment from "moment";
import InfoById from "../../Library/InfoById";

const Material = (params) => {
    const [classInfo, setClassInfo] = useState({});
    const [material, setMaterial] = useState({});
    const [author, setAuthor] = useState('');
    
    useEffect(() => {
        const classId = params.match.params.classId;
        const materialId = params.match.params.materialId;
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
        .then(() => {
            Axios.get(`${URL}/classwork/get/${materialId}`)
            .then(res => setMaterial(() => res.data))
            .catch(() => window.location = `/class/${classInfo._id}`)
        })
    }, [params.match.params, classInfo])

    useEffect(() => {
        if(material.author){
            InfoById(material.author)
            .then(result => setAuthor(result.username))
        }
    }, [material])

    return(
        <div className="container-fluid">
            <ClassNavbar classInfo = {classInfo} />
            <div className="container">
                <div className="margin-top-bottom box box-shadow">
                    <h1 className="box-title">{material.title}</h1>
                    <p className="box-text">{material.description}</p>
                    <h4>posted {moment(material.createdAt).fromNow()} 
                    {material.createdAt !== material.updatedAt? <span>(updated {moment(material.updatedAt).fromNow()})</span>: null} by {author}</h4>
                </div>
            </div>
        </div>
    )
}

export default Material;