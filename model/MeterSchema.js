const mongoose = require('mongoose')

var Schema = mongoose.Schema

var MeterSchema = new Schema({
    floormeter: [
        {
            roommeter: [
                {
                    //เลขมิเตอร์ไฟเดือนก่อนหน้า
                    beforusemeter: {
                        type: Number
                    },
                    //หมายเลขมิเตอร์ไฟเดือนนั้น
                    usemeter: {
                        type: Number
                    },
                    //จำนวนมิเตอร์ี่ไฟใช้ในเดือนนั้น
                    usemetermonth: {
                        type: Number,

                    },
                     //เลขมิเตอร์น้ำเดือนก่อนหน้า
                     beforusewater: {
                        type: Number
                    },
                    //หมายเลขมิเตอร์oheเดือนนั้น
                    usewater: {
                        type: Number
                    },
                    //จำนวนมิเตอร์ี่ไฟใช้ในเดือนนั้น
                    usemonth: {
                        type: Number,

                    },
                    roomNumbermeter: {
                        type: String,

                    },
                    //status meter ค้างค่าไฟฟ้า
                    meterstatus: {
                        type: String,

                    },
                    // status water ค้างค่าน้ำ
                    waterstatus: {
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
    somepricemeter: {
        type: Number,
        //จ่ายให้การไฟฟ้า
    },
    someunitmeter: {
        type: Number,
        //มิเตอร์ทั้งหอพัก
    }

})

var meterbuild = mongoose.model('meterbuild', MeterSchema)

module.exports = {
    meterbuild
}