import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import ClassNavbar from "../Navbar/class.navbar";
import InfoById from "../../Library/InfoById";
const URL = process.env.REACT_APP_BACKEND_URL;

const ClassSetting = (params) => {
    const [classInfo, setClassInfo] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [updateInfo, setUpdateInfo] = useState('');

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

    useEffect(() => {
        if(classInfo.teacher){
            classInfo.teacher.forEach(teacher => {
                InfoById(teacher)
                .then(result => setTeachers(teachers => [...teachers, result]))
            })
        }
        if(classInfo.students){
            classInfo.students.forEach(student => {
                InfoById(student)
                .then(result => setStudents(students => [...students, result]))
            })
        }
    }, [classInfo])

    const updateClassInfo = e => {
        e.preventDefault();
        Axios.post(`${URL}/class/update`, {title: inputTitle, description: inputDescription, _class: classInfo._id, token: userInfo.token, owner: userInfo._id})
        .then(() => setUpdateInfo("Class information updated."))
    }

    const ArchiveClass = e => {
        e.preventDefault();
        if(window.confirm("Are you sure?")){
            Axios.post(`${URL}/class/archive`, {owner: userInfo._id, _class: classInfo._id, token: userInfo.token})
            .then(() => window.location = "/")
        }
    }

    const toTeacher = studentId => {
        Axios.post(`${URL}/class/teacher/add`, {owner: classInfo.owner, token: userInfo.token, _class: classInfo._id, teacher: studentId})
        .then(() => {
            InfoById(studentId)
            .then(result => {
                setTeachers(teachers => [...teachers, result]);
                setStudents(students.filter(student => student._id !== result._id))
            })
        })
    }

    const toStudent = teacherId => {
        Axios.post(`${URL}/class/students/add`, {owner: classInfo.owner, student: teacherId, token: userInfo.token, _class: classInfo.code})
        .then(() => {
            InfoById(teacherId)
            .then(result => {
                setStudents(students => [...students, result])
                setTeachers(teachers.filter(teacher => teacher._id !== result._id))
            })
        })
    }

    const removeStudent = studentId => {
        Axios.post(`${URL}/class/students/remove`, {owner: classInfo.owner, student: studentId, token: userInfo.token, _class: classInfo._id})
        .then(() => {
            InfoById(studentId)
            .then(result => {
                setStudents(students.filter(student => student._id !== result._id))
            })
        })
    }

    const removeTeacher = teacherId => {
        Axios.post(`${URL}/class/teacher/delete`, {owner: userInfo._id, teacher: teacherId, _class: classInfo._id, token: userInfo.token})
        .then(() => {
            InfoById(teacherId)
            .then(result => setTeachers(teachers.filter(teacher => teacher._id !== result._id)))
        })
    }
    
    return(
        <div className="container-fluid">
            <ClassNavbar classInfo = {classInfo} />
            <div className="container">
                <form className="margin-top-bottom box box-shadow" onSubmit = {updateClassInfo}>
                    <h1 className="box-title">Update Class Information:</h1>
                    <p className="text-success">{updateInfo}</p>
                    <div className="form-group">
                        <p className="form-label">Title:</p>
                        <input className="form-control" type = "text" value = {inputTitle} onChange = {({target: {value}}) => setInputTitle(value)} />
                    </div>
                    <div className="form-group">
                        <p className="form-label">Description:</p>
                        <textarea rows="5" className='form-control' value = {inputDescription} onChange = {({target: {value}}) => setInputDescription(value)}></textarea>
                    </div>
                    <div className="form-group">
                        <input type = "submit" className="form-control btn btn-dark" />
                    </div>
                </form>
                <div className="margin-top-bottom box box-shadow">
                    <h1 className="box-title">Teachers:</h1>
                    <ul>
                        {teachers.length > 0?
                        teachers.map(teacher => {
                            return <li key = {teacher._id}>{teacher.username} ({teacher.email})
                            <ul>
                                <li><p className="link" onClick = {() => toStudent(teacher._id)}>Demote become a student</p></li>
                                <li><p className="link" onClick = {() => removeTeacher(teacher._id)}>Remove</p></li>
                            </ul></li>
                        })
                        :<h3>There is no teacher yet.</h3>}
                    </ul>
                </div>
                <div className="margin-top-bottom box box-shadow">
                    <h1 className="box-title">Students:</h1>
                    <ul>
                        {students.length > 0?
                        students.map(student => {
                            return <li key = {student._id}>{student.username} ({student.email})
                            <ul>
                                <li><p className = "link" onClick = {() => toTeacher(student._id)}>Promote become a teacher</p></li>    
                                <li><p className = "link" onClick = {() => removeStudent(student._id)}>Remove</p></li>    
                            </ul></li>
                        })
                        :<h3>There is no students yet. Send class code({classInfo.code}) to your student.</h3>}
                    </ul>
                </div>
                <form className="margin-top-bottom box box-shadow" onSubmit = {ArchiveClass}>
                    <h1 className="box-title">Archive Class</h1>
                    <div className="form-group">
                        <input type = "submit" className="form-control btn btn-dark" value="Archive" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClassSetting;