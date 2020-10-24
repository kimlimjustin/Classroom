// requiring depedencies.
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    archived: {
        type: Boolean,
        default: false,
    },
    teacher: {
        type: Array,
        required: true
    },
    students: {
        type: Array,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    code: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

const Class = mongoose.model("Class", ClassSchema)

module.exports = Class;
