const mongoose = require('mongoose')

var Schema = mongoose.Schema

var MeterSchema = new Schema({
    floormeter: [
        {
            roommeter: [
                {
                    //ผู้ใช้หน่วยมิเตอร์ต่อห้อง
                    usemeter: {
                        type:Number
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
        required: true
    },
    buildingnamemeter: {
        type: String,
        required: true
    },
    allunitmeter: {
        type: Number,
        required: true
    },
    buymeter: {
        type: Number,
        required: true

    },
    datemeter: {
        type: String,
        required: true
    }


})

var meterbuild = mongoose.model('meterbuild', MeterSchema)

module.exports = {
    meterbuild
}