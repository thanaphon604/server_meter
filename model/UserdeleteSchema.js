const mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserdeleteShema = new Schema({
   
    personIDAllow: {
        type: String 
    },
    firstNameAllow: {
        type:String
    },
    lastNameAllow: {
        type :String
    },     
    birthdayAllow: {
        type: String
    },
    //sex: Boolean,
    addressAllow: {
        tpye:String
    },
    phoneNumberAllow: {
         type: String
    },
    LicenseAllow: {
        tpye :String
    },
    BuildingNameAllow: { 
        type :String
    },
    roomNumberAllow :{ 
        type : String
    },
    Li:{
        type : String
    },
    ad:{
        type : String
    }
})

var Userdelete = mongoose.model('Userdelete', UserdeleteShema)

module.exports = {
    Userdelete
}