import React from "react";

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Archived from "./Components/Class/archived.component";
import Class from "./Components/Class/class.component";
import JoinClass from "./Components/Class/join_class.component";
import People from "./Components/Class/people.component";
import ClassSetting from "./Components/Class/setting.component";
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
            <Route path = "/archived" component = {Archived} />
            <Route path = "/class/join" component = {JoinClass} />
            <Route path = "/class/:classId/setting" component = {ClassSetting} />
            <Route path = "/class/:classId/people" component = {People} />
            <Route path = "/class/:classId" component = {Class} />
            <Route path = "*" component = {ZeroFourZero} />
        </Switch>
    </Router>
)

export default App;