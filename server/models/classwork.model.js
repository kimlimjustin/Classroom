const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassworkSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    class: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Class"
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    types: {
        type: String,
        required: true,
        enum: ['material', 'short answer', 'long answer', 'multiple choice', 'checkbox']
    },
    answer: {
        type: Array,
        required: false
    },
    duedate: {
        type: Date,
        required: false,
    },
    options: {
        type: Array,
        required: false
    }
}, {
    timestamps: true
})

const Classwork = mongoose.model("Classwork", ClassworkSchema);

module.exports = Classwork;