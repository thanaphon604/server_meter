const mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserSchema = new Schema({
    usernameuser: {
        type: String, 
        unique: true
       
    },
    passworduser: {
        type: String, 
        
    },
    fnameuser: {
        type: String,
    
    },
    lnameuser: {
        type: String,
       
    },
    phoneuser: {
        type: String,
     
    },
    BuildingNameuser:{
        type: String,
        required: true
    }
})

var Userroom = mongoose.model('Userroom', UserSchema)

module.exports = {
    Userroom
}