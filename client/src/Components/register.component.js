import Axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { NavLink } from "react-router-dom";

const URL = process.env.REACT_APP_BACKEND_URL;
const Register = () => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputPasswordConfirmation, setInputPasswordConfirmation] = useState('');
    const [inputUsername, setInputUsername] = useState('');
    const [error, setError] = useState([]);

    //Register the user
    const Submit = async (e) => {
        e.preventDefault();

        if(error === ""){
            await Axios.post(`${URL}/users/register`, {email: inputEmail, username: inputUsername, password: inputPassword})
            .then(res => {
                const token = new Cookies();
                token.set('token', res.data.token, {path: '/', maxAge:604800 })
                //return to home page
                window.location = "/";
            })
            .catch(err => setError(err.response.data.message));
        }
    }

    useEffect(() => {
        if(inputEmail.length > 0) setError('');
    }, [inputEmail])

    //validating users' input
    useEffect(() => {
        if(inputPassword !== inputPasswordConfirmation) setError("Password and confirmation must match.")
        else {
            if(inputUsername.length < 3 && inputUsername.length !== 0) setError("Username length should be more than or equal to three");
            else if(inputUsername.length > 50) setError('Username length should be less or equal to 50');
            else setError('');
        }
    }, [inputPassword, inputPasswordConfirmation, inputUsername])

    return (
        <div className="container">
            <form className="margin box box-shadow text-dark" onSubmit={Submit}>
                <h1 className="box-title">Register user</h1>
                <h4 className="form-error">{error}</h4>
                <div className="form-group">
                    <p className="form-label">Username:</p>
                    <input type="text" className="form-control" value={inputUsername} onChange={({target: {value}}) => setInputUsername(value)} />
                </div>
                <div className="form-group">
                    <p className="form-label">Email:</p>
                    <input type="email" className="form-control" value={inputEmail} onChange = {({target: {value}}) => setInputEmail(value)} />
                </div>
                <div className="form-group">
                    <p className="form-label">Password:</p>
                    <input type="password" className="form-control" value={inputPassword} onChange= {({target: {value}}) => setInputPassword(value)} />
                </div>
                <div className="form-group">
                    <p className="form-label">Password Confirmation:</p>
                    <input type="password" className="form-control" value={inputPasswordConfirmation} onChange= {({target: {value}}) => setInputPasswordConfirmation(value)} />
                </div>
                <div className="form-group">
                    <p className = "form-label">Already have account? <NavLink to="/login" className="link">Login</NavLink></p>
                </div>
                <div className="form-group">
                    <input type="submit"  className="form-control btn btn-dark" />
                </div>
            </form>
        </div>
    )
}

export default Register;