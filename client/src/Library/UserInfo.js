const { default: Axios } = require("axios");
const { default: URL } = require("../Static/Backend.url.static");
const { default: SECURITY_KEY } = require('../Static/SecretKey.static');

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

module.exports = UserInfo;