import React, { useEffect, useState } from "react";
import Axios from "axios";
import ClassNavbar from "../Navbar/class.navbar";
import InfoById from "../../Library/InfoById";
import DefaultProfile from "../../Icons/profile.png";
const URL = process.env.REACT_APP_BACKEND_URL;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


const Class = (params) => {
    const [classInfo, setClassInfo] = useState({});
    const [classworks, setClassworks] = useState([]);
    const [authorInfo, setAuthorInfo] = useState({});

    useEffect(() => {
        const classId = params.match.params.classId;
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
    }, [params.match.params.classId])

    useEffect(() => document.title = classInfo.title, [classInfo])

    useEffect(() => {
        if(classInfo._id){
            Axios.get(`${URL}/classwork/class/get/${classInfo._id}`)
            .then(res => setClassworks(res.data))
        }
    }, [classInfo])

    useEffect(() => {
        if(classworks.length > 0){
            classworks.forEach(classwork => {
                InfoById(classwork.author)
                .then(result => setAuthorInfo(prev => ({...prev, [classwork.author]: result})))
            })
        }
    }, [classworks])

    return(
        <div className = "container-fluid">
            <ClassNavbar classInfo={classInfo} />
            <div className="container">
                <div className="margin-top-bottom box box-shadow">
                    <h1 className="box-title">{classInfo.title}</h1>
                    <p className="box-text classinfo-description">{classInfo.description}</p>
                    <h4>Class code: {classInfo.code}</h4>
                </div>
                {Object.size(authorInfo) > 0? classworks.map(classwork => {
                    if(authorInfo[classwork.author]){
                    return <div className="margin-top-bottom box box-shadow classwork" key = {classwork._id} onClick = {() => {
                        if(classwork.types === "material") window.location = `/class/${classInfo._id}/m/${classwork._id}`
                        else if(classwork.types === "short answer") window.location = `/class/${classInfo._id}/sa/${classwork._id}`
                        else if(classwork.types === "long answer") window.location = `/class/${classInfo._id}/la/${classwork._id}`
                        else if(classwork.types === "multiple choice") window.location = `/class/${classInfo._id}/mc/${classwork._id}`
                        else if(classwork.types === "checkbox") window.location = `/class/${classInfo._id}/c/${classwork._id}`
                        }}>
                        <h3 className="classwork-title">
                        {authorInfo[classwork.author].profile_picture?
                        <img src = { `${URL}/${authorInfo[classwork.author].profile_picture.filename}`} alt = "Author" className="pp" />
                        :<img src = { DefaultProfile} alt = "Author" className="pp" />}
                        &nbsp;{authorInfo[classwork.author].username} posted a new {classwork.types === "material"? <span>material</span>:<span>Assignment</span>}: 
                        &nbsp;{classwork.title}</h3>
                        <p>{classwork.description}</p>
                    </div>} else return null;
                }): null}
            </div>
        </div>
    )
}

export default Class;