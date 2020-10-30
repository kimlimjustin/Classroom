// requiring depedencies.
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true, 
        minlength: 3,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        //required: true,
        trim: true,
        unique: true,  
    },
    profile_picture: {
        type: Object,
        required: false
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    archived_class: {
        type: Array,
        required: false
    }
}, {
    timestamps: true,
})

UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        else{
            cb(null, isMatch);
        }
    });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;