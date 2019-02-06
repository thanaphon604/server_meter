const mongoose = require('mongoose')

var Schema = mongoose.Schema

var MeterSchema = new Schema({
    floormeter: [
        {
            roommeter: [
                {
                    //หมายเลขมิเตอร์เดือนนั้น
                    usemeter: {
                        type: Number
                    },
                    //จำนวนมิเตอร์ี่ใช้ในเดือนนั้น
                    usemetermonth: {
                        type: Number,

                    },
                    roomNumbermeter: {
                        type: String,

                    },
                    meterstatus:{
                        type: String,

                    }

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

    },
    somepricemeter:{
        type: Number,
        //จ่ายให้การไฟฟ้า
    },
    someunitmeter:{
        type: Number,
        //มิเตอร์ทั้งหอพัก
    }

})

var meterbuild = mongoose.model('meterbuild', MeterSchema)

module.exports = {
    meterbuild
}