const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../../models/user.model');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');

//Get Security key for token generating in .env file
require('dotenv').config();
const SECURITY_KEY = process.env.SECURITY_KEY;

//generate token for user
const generateToken = () => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(50);
}

//get all users info(require security key)
router.get('/', (req, res) => {
    if(!req.query.key) res.status(403).json("Permisison denied.")
    else{
        const key = req.query.key;
        if(key !== SECURITY_KEY) res.status(403).json("Permission denied.")
        else{
            User.find({})
            .then(users => {
                res.json(users)
            })
            .catch(err => res.status(500).json("Error: "+err))
        }
    }
})
//get a user info(require security key)
router.get('/get/by/:id', (req, res) => {
    if(!req.query.key) res.status(403).json("Permisison denied.")
    else{
        const key = req.query.key;
        if(key !== SECURITY_KEY) res.status(403).json("Permission denied.")
        else{
            User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => res.status(500).json("Error: "+err))
        }
    }
})

//register user
router.post('/register', jsonParser, (req, res) => {
    const {username, password, email} = req.body;
    //checking if username exist
    User.findOne({email}, (err, user) => {
        if(err) res.status(500).json("Error has occured. Please refresh page")
        else if(user) res.status(400).json("Email has been token.")
        else{
            User.findOne({username}, (err, user) => {
                if(err) res.status(500).json("Error has occured. Please refresh page")
                else if(user) res.status(400).json("Username has been token.")
                else{
                    //create the user account
                    const token = generateToken();
                    const newUser = new User({username, password, email, token});
                    newUser.save()
                    .then(() => {
                        res.json({"Message": "Success", token});
                    })
                    .catch(err => res.status(500).json("Error has occured. Please refresh page"));
                }
            })
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
                    user.save();
                    res.json({"message": "Success", token});
                }
                else res.status(400).json("Password doesn't match")
            })
        }
    })
})


//Update profile picture
router.post('/profile_picture', jsonParser, (req, res)=> {
    const storage = multer.diskStorage({
        destination: "./public/",
        filename: function(req, file, cb){
           cb(null,"PROFILE-PICTURE-" + Date.now() + path.extname(file.originalname));
        }
    });

    //Save user profile picture
    const upload = multer({
        storage: storage,
        limits: {fileSize: 1000000},
    }).single("myfile")

    upload(req, res, () => {
        if(!req.body.token) res.status(403);
        User.findOne({token: req.body.token}, (err, user)=> {
            if(user.profile_picture) {
                fs.unlink(user.profile_picture.destination + user.profile_picture.filename,  (err)=> {if(err)console.log(err)})
            }
            if(err) res.status(400).json("Error: "+err);
            const resize = async function(){
                await sharp(req.file.destination + req.file.filename)
                .resize(900, 900)
                .toBuffer((err, buffer) => fs.writeFile(req.file.destination + req.file.filename, buffer, (e) => {}))
            }
            resize()
            .then(result => user.profile_picture = req.file)
            .then(result => user.save())
            .then(result => res.json(req.file.filename))
        }).catch(err => res.status(400).json("Error: "+err));
    });
})

//Update user info
router.post('/update', jsonParser, (req, res) => {
    const token = req.body.token
    if(!token) res.status(403).json("Permission denied.")
    else{
        User.findOne({token: token, email: req.body.email}, (err, user) => {
            if(err) res.status(500).json("Something went wrong.")
            else if(!user) res.status(404).json("User not found.")
            else{
                const token = generateToken();
                user.token = token;
                user.email = req.body.email;
                user.username = req.body.username;
                user.save()
                .then(() => res.json({message:"Updated", token: token}))
                .catch(err => res.status(500).json(err));
            }
        })
    }
})

//update user password
router.post('/password/update', jsonParser, (req, res) => {
    const token = req.body.token;
    if(!token) res.status(403).json("Permission denied.")
    else{
        User.findOne({token: token, email: req.body.email}, (err, user) => {
            if(err) res.status(500).json("Something went wrong.")
            else if(!user) res.status(404).json("User not found.")
            else{
                user.comparePassword(req.body.oldpassword, (err, isMatch) => {
                    if(err) res.status(500).json("Error is occured.")
                    if(isMatch){
                        const token = generateToken();
                        user.token = token;
                        user.password = req.body.password;
                        user.save()
                        .then(() => res.json({message: "Success", token}))
                        .catch(err => res.status(400).json(err))
                    }else res.status(400).json("Wrong password.")
                })
            }
        })
    }
})

module.exports = router;