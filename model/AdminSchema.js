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
    }
})

var Admin = mongoose.model('Admin', AdminSchema)

module.exports = {
    Admin
}