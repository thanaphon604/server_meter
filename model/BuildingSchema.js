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
                    payStatud: Boolean,
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
    }
})

var Building = mongoose.model('Building', BuildingSchema)

module.exports = {
    Building
}