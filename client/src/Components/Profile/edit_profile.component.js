import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import UserInfo from '../../Library/UserInfo';
import HomeNavbar from '../Navbar/home.navbar';

const URL = process.env.REACT_APP_BACKEND_URL;

const EditProfile = () => {
    const [inputUsername, setInputUsername] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputOldPassword, setInputOldPassword] = useState('');
    const [inputNewPassword, setInputNewPassword] = useState('');
    const [inputPasswordConfirmation, setInputPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [profileInfo, setProfileInfo] = useState('')
    const [passwordInfo, setPasswordInfo] = useState('');

    useEffect(() => {
        const token = new Cookies().get('token');
        UserInfo(token).then(result => {
            if(result) {
                setInputUsername(result.username)
                setInputEmail(result.email)
            }else window.location = "/"
        })
    }, [])

    useEffect(() => {
        if(inputNewPassword !== inputPasswordConfirmation) setError("Password and confirmation must match.")
        else setError('');
    }, [inputNewPassword, inputPasswordConfirmation])

    const updateProfile = (e) => {
        e.preventDefault();
        const token = new Cookies().get('token');
        Axios.post(`${URL}/users/update`, {token, username: inputUsername, email: inputEmail})
        .then(res => {
            setProfileInfo(res.data.message);
            const token = new Cookies();
            token.set('token', res.data.token, {path: '/', maxAge:604800 })
        })
    }

    const updatePassword = e => {
        e.preventDefault();
        const token = new Cookies().get('token');
        Axios.post(`${URL}/users/password/update`, {token, oldpassword: inputOldPassword, password: inputNewPassword, email: inputEmail})
        .then(res => {
            setPasswordInfo(res.data.message);
            const token = new Cookies();
            token.set('token', res.data.token, {path: '/', maxAge:604800 })
        })
        .catch(() => setError("Something went wrong. Please try again."))
    }

    return(
        <div className="container-fluid">
            <HomeNavbar />
            <div className="container">
                <form className="margin-top-bottom box box-shadow text-dark" onSubmit={updateProfile}>
                    <h1 className = "box-title">Update profile</h1>
                    <h4 className="text-success">{profileInfo}</h4>
                    <div className="form-group">
                       <p className="form-label">Username:</p>
                       <input type = "text" className="form-control" value={inputUsername} onChange = {({target: {value}}) => setInputUsername(value)} />
                    </div>
                    <div className="form-group">
                       <p className="form-label">Email:</p>
                       <input type = "email" className="form-control" value={inputEmail} onChange = {({target: {value}}) => setInputEmail(value)} />
                    </div>
                    <div className="form-group">
                        <input type="submit" className="form-control btn btn-dark" />
                    </div>
                </form>
                <form className="margin-top-bottom box box-shadow text-dark" onSubmit = {updatePassword}>
                    <h1 className="box-title">Update Password</h1>
                    <h4 className="form-error">{error}</h4>
                    <h4 className="text-success">{passwordInfo}</h4>
                    <div className="form-group">
                        <p className = "form-label">Old Password:</p>
                        <input type = "password" className="form-control" value={inputOldPassword} onChange = {({target: {value}}) => setInputOldPassword(value)} />
                    </div>
                    <div className="form-group">
                        <p className = "form-label">New Password:</p>
                        <input type = "password" className="form-control" value={inputNewPassword} onChange = {({target: {value}}) => setInputNewPassword(value)} />
                    </div>
                    <div className="form-group">
                        <p className="form-label">Password Confirmation:</p>
                        <input type ="password" className="form-control" value = {inputPasswordConfirmation} onChange = {({target: {value}}) => setInputPasswordConfirmation(value)} />
                    </div>
                    <div className="form-group">
                        <input type="submit" className="form-control btn btn-dark" />
                    </div>
                </form>
            </div>
        </div>
    )
}
export default EditProfile;