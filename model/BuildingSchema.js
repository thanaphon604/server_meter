const mongoose = require('mongoose')

var Schema = mongoose.Schema

var BuildingSchema = new Schema({
    floor: [
        {
            room: [
                {
                    user: [
                        {
                            personID: {
                                type: String,
                                unique: true
                            },
                            firstName: String,
                            lastName: String,
                            birthday: String,
                            //sex: Boolean,
                            address: String,
                            phoneNumber: {
                                type: String,
                                unique: true
                            },
                            License: String,


                        }
                    ],
                    roomStatus: String,
                    payStatus: Boolean,
                    contract: {
                        type: String
                    },
                    roomNumber: {
                        type: String,

                    },
                    rentroom: Number
                }
            ],
            floorNumber: Number
        }
    ],
    adminAllow: {
        type: String,
        required: true
    },
    BuildingName: {
        type: String,
        required: true
    },
    UnitMeter: {
        type: Number,
        required: true
    },
    //มิเตอร์ก่อนหน้า
    UnitMeterbefor: {
        type: Number,

    },
    //วันที่เปลี่ยนunitmeter
    DateUnitMeter: {
        type: Date,

    },

    BuildingPhone: {
        type: String,
        required: true

    },
    BuildingEmail: {
        type: String,
        required: true
    },
    //ราคามิเตอร์น้ำ
    plicewater: {
        type: Number,
        required: true
    },
    plicewaterbefor: {
        type: Number,

    },
    //วันที่เปลี่ยนunitwater
    DateUnitWater: {
        type: Date,

    },
    //วิธีคิดค่าน้ำ
    methodwater: {
        type: String,
        required: true
    }


})

var Building = mongoose.model('Building', BuildingSchema)

module.exports = {
    Building
}