const mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserSchema = new Schema({
    usernameuser: {
        type: String, 
       
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
     
    }
})

var Userroom = mongoose.model('Userroom', UserSchema)

module.exports = {
    Userroom
}