import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import UserInfo from "../../Library/UserInfo";
import ClassNavbar from "../Navbar/class.navbar";
import moment from "moment";
import InfoById from "../../Library/InfoById";
const URL = process.env.REACT_APP_BACKEND_URL;

const MultipleChoice = (params) => {
    const [answered, setAnswered] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [classInfo, setClassInfo] = useState('');
    const [author, setAuthor] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [classwork, setClasswork] = useState('');
    const classId = params.match.params.classId;
    const classworkId = params.match.params.classworkId;
    const classworkModal = document.getElementById("classwork");
    const answerModal = document.getElementById("answers");
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputDeadline, setInputDeadline] = useState('');
    const [inputChoices, setInputChoices] = useState([]);
    const [inputNewChoices, setInputNewChoices] = useState('');
    const [inputAnswer, setInputAnswer] = useState('');

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token)
        .then(result => setUserInfo(result))
    }, [userInfo])

    useEffect(() => {
        Axios.get(`${URL}/class/get/class/${classId}`)
        .then(res => setClassInfo(() => res.data))
    }, [classId])

    useEffect(() => {
        Axios.get(`${URL}/classwork/get/${classworkId}`)
        .then(res => {
            if(res.data.types === "multiple choice"){
                setClasswork(() => res.data);
                setInputTitle(res.data.title);
                setInputDescription(res.data.description);
                if(res.data.duedate) setInputDeadline(res.data.duedate.substr(0, 16));
                if(res.data.options) setInputChoices(res.data.options);
            }else window.location = `/class/${classId}`
        })
    }, [classworkId, classId])

    useEffect(() => {
        Axios.get(`${URL}/classwork/get/answer/${classworkId}`)
        .then(res => setAnswers(res.data))
    }, [classworkId])

    useEffect(() => {
        if(classwork.author){
            InfoById(classwork.author)
            .then(result => setAuthor(result.username))
        }
    }, [classwork])

    useEffect(() => {
        const scan = (answers, userInfo)=>{
            let _answered = false
            answers.forEach(answer => {
                if(answer.student._id === userInfo._id) _answered = true
            })
            return _answered
        }
        setAnswered(scan(answers, userInfo))
    }, [answers, userInfo])

    const openClasswork = () => classworkModal.style.display = "block";

    const closeClasswork = () => classworkModal.style.display = "none";

    const deleteClasswork = () => {
        if(window.confirm("Are you sure?")){
            const token = new Cookies().get('token');
            Axios.post(`${URL}/classwork/delete/${classwork._id}`, {author: userInfo._id, token})
            .then(() => window.location = `/class/${classId}`)
        }
    }

    const updateClasswork = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        Axios.post(`${URL}/classwork/update/${classwork._id}`, {title: inputTitle, description: inputDescription, duedate: inputDeadline, token, options:inputChoices})
        .then(res => {
            setClasswork(res.data.classwork);
            classworkModal.style.display = "none";
        })
    }
    const addNewChoice = e => {
        e.preventDefault();
        setInputChoices(choices => [...choices, inputNewChoices]);
        setInputNewChoices('');
    }

    const Answer = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        if(!answered){
            Axios.post(`${URL}/classwork/submit/answer`, {token, classwork: classwork._id, answer: inputAnswer, student: userInfo._id})
            .then(res => setAnswers(res.data.answers))
        }
    }

    const showAnswer = () => answerModal.style.display = "block";
    const closeAnswer = () => answerModal.style.display = "none";

    return(
        <div className = "container-fluid">
            <ClassNavbar classInfo = {classInfo} />
            <div className="container margin-top-bottom">
                <div className="col-9">
                    <h1 className="box-title">{classwork.title}</h1>
                    {classwork.duedate?<p>Due: {moment(classwork.duedate).fromNow()}</p>:null}
                    <p className="box-text material-description">{classwork.description}</p>
                    <p>posted {moment(classwork.createdAt).fromNow()} 
                    {classwork.createdAt !== classwork.updatedAt? <span>(updated {moment(classwork.updatedAt).fromNow()})</span>: null} by {author}</p>
                    {classwork.author === userInfo._id? <div><h3><span className="link" onClick = {openClasswork}>Edit</span></h3>
                    <h3><span className="link text-danger" onClick = {deleteClasswork}>Delete</span></h3></div>:null}
                </div>
                {classInfo.teacher && !(classInfo.teacher.includes(userInfo._id) || classInfo.owner === userInfo._id)?
                <div className="col-3">
                    {!answered?
                    <form className="box box-shadow" onSubmit = {Answer}>
                        <h1 className="box-title">Answer:</h1>
                        <div onChange = {({target: {value}}) => setInputAnswer(value)}>
                            {classwork.options && classwork.options.map(option => (
                                <div className="form-group" key = {option}>
                                    <input type = "radio" className="form-control" id={option} name="answer" value={option} />
                                    <label htmlFor ={option}>{option}</label>
                                </div>
                            ))}
                        </div>
                        <div className="form-group">
                            <input className="btn btn-dark form-control" type ="submit" />
                        </div>
                    </form>:
                    <div className="box box-shadow">
                        <p>You have submitted.</p>
                    </div>}
                </div>:
                <div className="col-3">
                    <div className="box box-shadow">
                        <h1 className="box-title">Answers:</h1>
                        <p className="box-text">{classwork.answer?classwork.answer.length:null} answered</p>
                        <button className="form-control btn btn-dark" onClick = {showAnswer}>See answers</button>
                    </div>
                </div>}
            </div>
            {classwork.author === userInfo._id?
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
                            <p className="form-label">Description: (optional)</p>
                            <textarea rows="5" type = "text" className="form-control" value={inputDescription} 
                            onChange = {({target: {value}}) => setInputDescription(value)} />
                        </div>
                        <div className="form-group">
                            <p className="form-label">Due date (optional):</p>
                            <input type = "datetime-local" className="form-control" value={inputDeadline} onChange = {({target: {value}}) => setInputDeadline(value)}
                            min={new Date().toJSON().substr(0, 16)} />
                        </div>
                        <div className="form-group">
                            <p className="form-label">Options:</p>
                            <ul>
                                {inputChoices.map(option => {
                                    return <li key = {option}>{option} (<span className="link" 
                                    onClick = {() => setInputChoices(inputChoices.filter(options => options !== option))}>Delete</span>)</li>
                                })}
                            </ul>
                            <div className="box">
                                <p className="form-label">Input new option:</p>
                                <input type = "text" className="form-control" value={inputNewChoices} onChange = {({target: {value}}) => setInputNewChoices(value)}
                                onKeyPress = {event => event.key === "Enter"? addNewChoice(event): null} />
                            </div>
                        </div>
                        <div className="form-group">
                            <input type = "submit" className="form-control btn btn-dark" />
                        </div>
                    </form>
                </div>
            </div>:null}
            {classInfo.teacher && classwork.author && (classwork.author === userInfo._id || classInfo.teacher.includes(userInfo._id) || classInfo.owner === userInfo._id)?
            <div className = "classwork-modal" id = "answers">
                <div className="classwork-content container">
                    <span className="classwork-close" onClick = {closeAnswer}>&times;</span>
                    <h1 className="box-title">Answers by students:</h1>
                    {answers.map(answer => {
                        return <p key = {answer._id}>{answer.student.username} answered <b>{answer.answer}</b> {moment(answer.answeredOn).fromNow()}
                        {answer.answeredOn > classwork.duedate? <span><b> (Turned in late)</b></span>:null}</p>
                    })}
                </div>
            </div>
            :null}
        </div>
    )
}

export default MultipleChoice;