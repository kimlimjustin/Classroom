import Axios from "axios";
const URL = process.env.REACT_APP_BACKEND_URL;
const SECURITY_KEY = process.env.REACT_APP_SECURITY_KEY;

const UserInfo = async (token) => {
    if (token){
        let _userinfo = false;
        await Axios.get(`${URL}/users?key=${SECURITY_KEY}`)
        .then(users => {
            users.data.forEach(user => {
                if(user.token === token) _userinfo = user
            })
        })
        return _userinfo

    }else return undefined
}

export default UserInfo;