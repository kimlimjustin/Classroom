import React from "react";

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import JoinClass from "./Components/Class/join_class.component";
import ZeroFourZero from "./Components/Error/404.component";
import Home from "./Components/home.component";
import Login from "./Components/login.component";
import Logout from "./Components/logout.component";
import EditProfile from "./Components/Profile/edit_profile.component";
import Profile from "./Components/Profile/profile.component";
import Register from "./Components/register.component";

const App = () => (
    <Router>
        <Switch>
            <Route exact path = "/" component = {Home} />
            <Route path = "/login" component = {Login} />
            <Route path = "/register" component = {Register} />
            <Route path = "/logout" component = {Logout} />
            <Route path = "/profile/edit" component = {EditProfile} />
            <Route path = "/profile" component = {Profile} />
            <Route path = "/class/join" component = {JoinClass} />
            <Route path = "*" component = {ZeroFourZero} />
        </Switch>
    </Router>
)

export default App;