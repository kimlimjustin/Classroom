const { default: Axios } = require("axios");
const { default: URL } = require("../Static/Backend.url.static");
const { default: SECURITY_KEY } = require('../Static/SecretKey.static');

const InfoById = async (userId) => {
    if(userId){
        let _userinfo = null;
        await Axios.get(`${URL}/users/get/by/${userId}?key=${SECURITY_KEY}`)
        .then(user => _userinfo = user.data)
        return _userinfo
    }else return undefined
}

module.exports = InfoById