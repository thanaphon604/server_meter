const mongoose = require('mongoose')

var Schema = mongoose.Schema

var MeterSchema = new Schema({
    floormeter: [
        {
            roommeter: [
                {
                    //ผู้ใช้หน่วยมิเตอร์ต่อห้อง
                    usemeter: {
                        type: Number
                    },
                    allunitmeter: {
                        type: Number,

                    },
                    roomNumbermeter: {
                        type: String,

                    },
                }
            ],
            floorNumbermeter: Number
        }
    ],
    pricemeter: {
        type: Number,

    },
    buildingnamemeter: {
        type: String,

    },
    buymeter: {
        type: Number,

    },
    datemeter: {
        type: String,

    }


})

var meterbuild = mongoose.model('meterbuild', MeterSchema)

module.exports = {
    meterbuild
}