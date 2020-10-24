import React, { useEffect, useState } from "react";
import Axios from "axios";
import URL from "../../Static/Backend.url.static";
import ClassNavbar from "../Navbar/class.navbar";

const Class = (params) => {
    const [classInfo, setClassInfo] = useState({});

    useEffect(() => {
        const classId = params.match.params.classId;
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
    }, [params.match.params.classId])

    return(
        <div className = "container-fluid">
            <ClassNavbar classInfo={classInfo} />
            <div className="container">
                <div className="margin-top-bottom box box-shadow">
                    <h1 className="box-title">{classInfo.title}</h1>
                    <p className="box-text">{classInfo.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Class;