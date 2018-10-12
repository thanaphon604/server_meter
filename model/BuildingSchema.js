const mongoose = require('mongoose')

var Schema = mongoose.Schema

var BuildingSchema = new Schema({
    floor: [
        {
            room: [
                {
                    user : [
                        {
                            cardID: {
                                type: String,
                                unique: true
                            },
                            firstName: String,
                            lastName: String,     
                            birthday: Date,
                            sex: Boolean,
                            address: String,
                            tel: String,
                            birthday: Date,
                        }
                    ],
                    roomStatus: String,
                    payStatus: Boolean,
                    roomNumber: {
                        type: String,
                        unique: true
                    },
                }
            ],
            floorNumber: Number 
        }
    ],
    adminAllow: {
        type: String,
        required: true
    },
    BuildingName:{
        type: String,
        required:true
    },
    UnitMeter:{
        type:Number,
        required: true
    },
    BuildingPhone:{
        type:String,
        
    },
    BuildingEmail:{
        type: String,
    }


})

var Building = mongoose.model('Building', BuildingSchema)

module.exports = {
    Building
}