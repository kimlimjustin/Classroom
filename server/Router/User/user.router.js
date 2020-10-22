const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../../models/user.model');

//Get Security key for token generating in .env file
require('dotenv').config();
const SECURITY_KEY = process.env.SECURITY_KEY;

//generate token for user
const generateToken = () => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(50);
}
//register user
router.post('/register', jsonParser, (req, res) => {
    const {username, password, email} = req.body;
    //checking if username exist
    User.findOne({email}, (err, user) => {
        if(err) res.status(500).json("Error has occured.")
        else if(user) res.status(400).json("Username has been token.")
        else{
            //create the user account
            const token = generateToken();
            const newUser = new User({username, password, email, token});
            newUser.save()
            .then(() => {
                res.json({"Message": "Success", token});
            })
            .catch(err => res.status(500).json("Error has occured."));
        }
    })
})

//login user
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    //find the user
    User.findOne({email}, (err, user) => {
        if(err) res.status(500).json("Error has occured.");
        else if(!user) res.status(400).json("User not found");
        else{
            //check the password is correct
            user.comparePassword(password, (err, isMatch)=> {
                if(err) res.status(500).json("Error is occured.")
                if(isMatch){
                    const token = generateToken();
                    user.token = token;
                    res.cookie('token', token, {httpOnly: true, maxAge: 604800000, path: '/'});
                    res.json({"message": "Success", token});
                }
                else res.status(400).json("Password doesn't match")
            })
        }
    })
})

//logout the user
router.post('/logout', (req, res) => {
    res.cookie("token", {expires: Date.now()});
    res.json({"mesage": "Success"})
})

module.exports = router;