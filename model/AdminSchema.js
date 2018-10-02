const mongoose = require('mongoose')

var Schema = mongoose.Schema

var AdminSchema = new Schema({
    username: {
        type: String, 
        required: true,
        minlength: 6,
        unique: true
    },
    password: {
        type: String, 
        required: true,
        minlength: 6
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

var Admin = mongoose.model('Admin', AdminSchema)

module.exports = {
    Admin
}