/*const mongoose = require('mongoose');
const User = require('../user.model');
const Class = require('./class.model');

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    } ,
    class: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true
    }
}, {
    timestamps: true
})*/