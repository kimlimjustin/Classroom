import React, { useState } from "react";
import Axios from "axios";
import URL from "./backend.url.component";
import Cookies from "universal-cookie";

const Login = () => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const Submit = (e) => {
        e.preventDefault();

        Axios.post(`${URL}/users/login`, {email: inputEmail, password: inputPassword})
        .then(res => {
            const token = new Cookies();
            token.set('token', res.data.token, {path: '/', maxAge:604800 })
            //return to home page
            window.location = "/";
        })
    }

    return(
        <div className="container">
            <form className="margin box box-shadow text-dark" onSubmit={Submit}>
                <h1 className="box-title">Login user</h1>
                <div className="form-group">
                    <p className="form-label">Email:</p>
                    <input type="email" className="form-control" value={inputEmail} onChange = {({target: {value}}) => setInputEmail(value)} />
                </div>
                <div className="form-group">
                    <p className="form-label">Password:</p>
                    <input type="password" className="form-control" value={inputPassword} onChange= {({target: {value}}) => setInputPassword(value)} />
                </div>
                <div className="form-group">
                    <input type="submit"  className="form-control btn btn-dark" />
                </div>
            </form>
        </div>
    )
}

export default Login;