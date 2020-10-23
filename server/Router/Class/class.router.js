const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../../models/user.model');
const Class = require('../../models/class.model');

router.post("/create", jsonParser, (req, res) => {
    const {title, description, owner, token} = req.body;
    User.findOne({_id: owner, token: token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if (!user) res.status(400).json("User not found")
        else{
            let teacher = [owner]
            const _class = new Class({title, description, teacher})
            _class.save()
            .then(() => res.json("Success"))
            .catch(err => res.status(400).json("Something went wrong."))
        }
    })
})

router.post('/teacher/add', jsonParser, (req, res) => {
    const {teacher, token, _class} = req.body;
    User.findOne({_id: teacher, token: token}, (err, user) =>{
        if(err) res.status(500).json("Something went wrong.")
        else if (!user) res.status(400).json("User not found")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    __class.teacher.push(teacher)
                    __class.save()
                    .then(() => res.json("Success"))
                    .catch(err => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
})

router.post("/teacher/delete", jsonParser, (req, res) => {
    const {token, teacher, _class} = req.body;
    User.findOne({_id: teacher, token: token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(400).json("User not found.")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong")
                else if(!__class) res.status(400).json("Class not found.")
                else{
                    if(__class.teacher.includes(teacher)){
                        for(let i = 0; i< __class.teacher.length; i++){
                            if(__class.teacher[i] === teacher){__class.teacher.splice(i, 1); i-- }
                        }
                    }
                    __class.save()
                    .then(() => res.json("Success"))
                    .catch(err => res.status(400).json("Something went wrong."))
                }
            })
        }
    })
})

module.exports = router;
