import Axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../../Static/Backend.url.static";
import ClassNavbar from "../Navbar/class.navbar";
import moment from "moment";

const Material = (params) => {
    const [classInfo, setClassInfo] = useState({});
    const [material, setMaterial] = useState({});
    
    useEffect(() => {
        const classId = params.match.params.classId;
        const materialId = params.match.params.materialId;
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
        Axios.get(`${URL}/classwork/get/${materialId}`)
        .then(res => setMaterial(() => res.data))
    }, [params.match.params])

    useEffect(() => {

    }, [material])

    return(
        <div className="container-fluid">
            <ClassNavbar classInfo = {classInfo} />
            <div className="container">
                <h1 className="box-title">{material.title}</h1>
                <p className="box-text">{material.description}</p>
                <h4>posted {moment(material.createdAt).fromNow()}</h4>
            </div>
        </div>
    )
}

export default Material;