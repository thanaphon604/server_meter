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
                                
                            },
                            firstName: String,
                            lastName: String,     
                            birthday: Date,
                            sex: Boolean,
                            address: String,
                            tel: String,
                          
                        }
                    ],
                    roomStatus: String,
                    payStatus: Boolean,
                    contract :Date,
                    roomNumber: {
                        type: String,
                       
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
        required: true
        
    },
    BuildingEmail:{
        type: String,
        required: true
    }


})

var Building = mongoose.model('Building', BuildingSchema)

module.exports = {
    Building
}