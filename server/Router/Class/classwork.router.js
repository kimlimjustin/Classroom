const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../../models/user.model');
const Class = require('../../models/class.model');
const Classwork = require('../../models/classwork.model');
const {nanoid} = require('nanoid');

router.post('/create', jsonParser, (req, res) => {
    const {title, description, _class, type, author, duedate, token, options}  = req.body;
    User.findOne({_id: author, token}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if (!user) res.status(404).json("Author not found.")
        else{
            Class.findOne({_id: _class}, (err, __class) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!__class) res.status(404).json("Class not found.")
                else{
                    const newClasswork = new Classwork({title, description, class: _class, types: type, duedate, options, author})
                    newClasswork.save()
                    .then(() => res.json({message: "Classwork created.", id: newClasswork._id}))
                    .catch(err => res.status(400).json("Error: "+err))
                }
            })
        }
    })
})

router.get('/class/get/:class', jsonParser, (req, res) => {
    const classId = req.params.class;
    Class.findOne({_id: classId}, (err, _class) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!_class) res.status(404).json("Class not found.")
        else{
            Classwork.find({class: classId})
            .sort({_id: -1})
            .then(classworks => {
                if(classworks) res.json(classworks)
            })
            .catch(() => res.status(500).json("Something went wrong."))
        }
    })
})

router.get('/get/:classwork', jsonParser, (req, res) => {
    const classwork = req.params.classwork;
    Classwork.findById(classwork)
    .then(result => res.json(result))
    .catch(() => res.status(404).json("Classwork not found."))
})

router.post('/update/:id', jsonParser, (req, res) => {
    const {title, description, duedate, type, options, token}  = req.body;
    const id = req.params.id;
    Classwork.findById(id, (err, classwork) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!classwork) res.status(404).json("Classwork not found.")
        else{
            User.findOne({_id: classwork.author, token}, (err, user) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!user) res.status(403).json("Permission denied.")
                else{
                    classwork.title = title;
                    classwork.description = description;
                    classwork.duedate = duedate;
                    classwork.type = type;
                    classwork.options = options;
                    classwork.save()
                    .then(() => res.json({message:"Success", classwork}))
                    .catch(err => res.status(400).json("Error: "+err));
                }
            })
        }
    })
})

router.post('/delete/:id', jsonParser, (req, res) => {
    const {token, author} = req.body;
    const id = req.params.id;
    User.find({token, _id: author}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Classwork.findByIdAndDelete(id)
            .then(() => res.json("Success"))
            .catch(err => res.status(400).json("Error: "+err));
        }
    })
})

router.post('/submit/answer', jsonParser, (req, res) => {
    const {answer, classwork, student, token} = req.body;
    User.findOne({token, _id: student}, (err, user) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!user) res.status(403).json("Permission denied.")
        else{
            Classwork.findOne({_id: classwork}, (err, classwork) => {
                if(err) res.status(500).json("Something went wrong.")
                else if(!classwork) res.status(404).json("Classwork not found.")
                else{
                    let response = {_id: nanoid(20),student: user, answer, answeredOn: new Date()};
                    classwork.answer.push(response)
                    classwork.save()
                    .then(() => res.json({message:"Success", answers: classwork.answer}))
                    .catch(err => res.status(400).json("Error: "+err))
                }
            })
        }
    })
})

router.get('/get/answer/:classwork', jsonParser, (req, res) => {
    const classworkId = req.params.classwork;
    Classwork.findById(classworkId, (err, classwork) => {
        if(err) res.status(500).json("Something went wrong.")
        else if(!classwork) res.status(404).json("Classwork not found.")
        else res.json(classwork.answer)
    })
})

module.exports = router;