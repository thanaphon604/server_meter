const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbs = require('hbs')
var path = require('path');
fs = require('fs')
var uab = require('unique-array-objects')
var check = require('check-types');
var keys = require('./config/keys')



const { Admin } = require('./model/AdminSchema')
const { Building } = require('./model/BuildingSchema')
const { Userdelete } = require('./model/UserdeleteSchema')
const { meterbuild } = require('./model/MeterSchema')
const { Userroom } = require('./model/UserSchema')

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/serDB')
    .then(() => console.log('@@@ Connection db is succes @@@'))
    .catch((err) => console.error('!!! Fail to connect db !!!'));

var app = express()

app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/p', (req, res) => {
    // res.send('hello')
    res.render('testhome.hbs')
})
app.get('/Loginadmin', (req, res) => {
    // res.send('hello')
    res.render('Loginadmin.hbs')
})
app.get('/Loginuser', (req, res) => {
    // res.send('hello')
    res.render('Loginuser.hbs')
})

app.post('/createbuilding', (req, res) => {
    res.render('createbuild.hbs', {
        username: req.body.username,

    })
})

app.post('/postAdmin', (req, res) => {
    //console.log(JSON.stringify(req.body))
    let newAdmin = new Admin({
        username: req.body.username,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        phone: req.body.phone,
    })
    newAdmin.save().then((d) => {
        res.send(d)
    }, (e) => {
        console.log(e)
        res.status(400).send(e)
    })
    // res.send(req.body.username+'  '+req.body.password)
})

app.get('/getAdmin', (req, res) => {
    Admin.find().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})
app.get('/getmeterbuild', (req, res) => {
    meterbuild.find().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})

app.post('/signin', (req, res) => {
    let usernameInput = req.body.username
    let passwordInput = req.body.password
    //find หาusername password สำหรับ 
    Admin.find({
        username: usernameInput,
        password: passwordInput
    }).then((admin) => {
        if (admin.length == 1) {
            Building.find({
                adminAllow: req.body.username
            }).then((doc) => {
                res.render('homebuild.hbs', {
                    username: usernameInput,
                    doc: encodeURI(JSON.stringify(doc))
                })
            })
            //res.send(admin[0])
        } else if (admin.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})


app.get('/getuser', (req, res) => {
    Building.find().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})

app.post('/postBuilding', (req, res) => {
    let BuildingNameInput = req.body.BuildingName
    let newBuilding = new Building({
        floor: req.body.floor,
        adminAllow: req.body.adminAllow,
        BuildingName: req.body.BuildingName,
        UnitMeter: req.body.UnitMeter,
        BuildingPhone: req.body.BuildingPhone,
        BuildingEmail: req.body.BuildingEmail,
        methodwater: req.body.methodwater,
        plicewater: req.body.plicewater
    })
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            res.send('BuildingName error')
        } else if (build.length == 0) {
            newBuilding.save().then((d) => {
                res.send('success')
            }, (e) => {
                console.log(e)
                res.status(400).send('success')
            })
        }
    }, (err) => {
        res.status(400).send(err)
    })
})

/*
app.post('/getHome', (req, res) => {
    let nameBuildInput = req.body.BuildingName
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: req.body.BuildingName
    }).then((build) => {
        console.log(nameBuildInput)
        res.render('home.hbs', {
            build: encodeURI(JSON.stringify(build))
        })
        //res.send(admin[0])
    }, (err) => {
        res.status(400).send(err)
    })
})
*/
// run Person/.hbs
// app.get('/Person', (req, res) => {
//     res.render('personInput.hbs')
// })
app.post('/Person', (req, res) => {
    let BuildingNameInput = req.body.BuildingName
    let roomInput = req.body.room
    let roomNumberInput = req.body.roomNumber
    console.log('#########')
    console.log(BuildingNameInput)
    console.log(roomInput)
    console.log(roomNumberInput)
    console.log('#########')


    Building.find({
        BuildingName: BuildingNameInput,
    }).then((doc) => {
        res.render('personInput.hbs', {
            BuildingName: BuildingNameInput,
            room: roomInput,
            roomNumber: roomNumberInput,
            doc: encodeURI(JSON.stringify(doc))
        })
    })
})
//run Home.hbs
app.post('/HOME', (req, res) => {
    let BuildingNameInput = req.body.BuildingName
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((doc) => {
        res.render('home.hbs', {
            BuildingName: BuildingNameInput,
            doc: encodeURI(JSON.stringify(doc))
        })
    })
})
app.get('/getwater/:BuildingName', (req, res) => {
    Building.find({
        BuildingName: req.params.BuildingName
    }).then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})

app.get('/getbuild/:BuildingName', (req, res) => {
    Building.find({
        BuildingName: req.params.BuildingName
    }).then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})

//inout contract  in room
app.post('/postcontract', (req, res) => {
    let contractInput = req.body.contract
    let BuildingNameInput = req.body.BuildingName
    let roomNumberInput = req.body.roomNumber
    let rentroomInput = req.body.rentroom
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let i = 0; i < build[0].floor.length; i++) {
                for (let j = 0; j < build[0].floor[i].room.length; j++) {
                    if (roomNumberInput == build[0].floor[i].room[j].roomNumber) {
                        build[0].floor[i].room[j].contract = contractInput
                        build[0].floor[i].room[j].rentroom = rentroomInput

                        build[0].save().then((suc) => {
                            console.log('res contract : ', suc)
                            res.send(suc)
                        }, (e) => {
                            consoel.log('error contract :', e)
                            res.status(400).send(e)
                        })

                    }
                }
            }
            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })

    //    meterbuild.find({
    //         BuildingName: BuildingNameInput,
    //     }).then((buildd) => {
    //         if (buildd.length == 1) {
    //             for (let i = 0; i < buildd[0].floormeter.length; i++) {
    //                 for (let j = 0; j < buildd[0].floormeter[i].roommeter.length; j++) {
    //                     if (roomNumberInput == buildd[0].floormeter[i].roommeter[j].roomNumbermeter) {
    //                         buildd[0].floormeter[i].roommeter[j].contractmeter = contractInput
    //                         buildd[0].floormeter[i].roommeter[j].rentroommeter = rentroomInput

    //                         buildd[0].save().then((suc) => {
    //                             console.log('res contract : ', suc)
    //                             res.send(suc)
    //                         }, (e) => {
    //                             consoel.log('error contract :', e)
    //                             res.status(400).send(e)
    //                         })

    //                     }
    //                 }
    //             }
    //             //res.send(admin[0])
    //         } else if (build.length == 0) {
    //             res.status(400).send('sory not found is user')
    //         }
    //     }, (err) => {
    //         res.status(400).send(err)
    //     })

})
//api post renroom meterbuild
app.post('/postrentroom', (req, res) => {
    let BuildingNameInput = req.body.BuildingName
    let roomNumberInput = req.body.roomNumber
    let rentroomInput = req.body.rentroom
    //find หาusername password สำหรับ 
    console.log('###########')
    console.log(BuildingNameInput)
    console.log(roomNumberInput)
    console.log(rentroomInput)
    console.log('#######')
    meterbuild.find({
        buildingnamemeter: BuildingNameInput,
    }).then((build) => {
        if (build.length >= 1) {
            console.log('find')
            for (let l = 0; l < build.length; l++) {
                for (let i = 0; i < build[l].floormeter.length; i++) {
                    for (let j = 0; j < build[l].floormeter[i].roommeter.length; j++) {
                        if (roomNumberInput == build[0].floormeter[i].roommeter[j].roomNumbermeter) {
                            console.log('ggwp############')
                            build[l].floormeter[i].roommeter[j].rentroommeter = rentroomInput

                            build[l].save().then((suc) => {
                                console.log('res contract : ', suc)
                                res.send(suc)
                            }, (e) => {
                                consoel.log('error contract :', e)
                                res.status(400).send(e)
                            })
                        }
                    }
                }
            }

            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory ')
        }
    }, (err) => {
        res.status(400).send(err)
    })


})

//post user 
app.post('/postUser', (req, res) => {
    let personIDInput = "" + req.body.personID
    let BuildingNameInput = req.body.BuildingName
    let roomNumberInput = req.body.roomNumber
    let phoneNumberInput = req.body.phoneNumber
    let d = 0
    let e = 0
    let count = 0
    Building.find({
        personID: personIDInput,
    }).then((build) => {
        if (build.length >= 1) {
            console.log('find user11111111111111')
            //res.send(admin[0])
        } else if (build.length == 0) {
            console.log('find user222222222', build.length)
            console.log('find user222222222', personIDInput)
            console.log(check.string(personIDInput))
            Building.find({
                BuildingName: BuildingNameInput
            }).then((build) => {
                if (build.length == 1) {
                    for (let i = 0; i < build[0].floor.length; i++) {
                        for (let j = 0; j < build[0].floor[i].room.length; j++) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log(build[0].floor[i].room[j].user.length)
                                if (build[0].floor[i].room[j].user[k].personID == personIDInput || build[0].floor[i].room[j].user[k].phoneNumber == phoneNumberInput) {
                                    // console.log(' find ssddsdsdwe')

                                    d++
                                } else if (build[0].floor[i].room[j].user[k].personID != personIDInput) {
                                    e++
                                    // console.log('not find ssddsdsdwe')
                                }
                            }
                        }
                    }

                    if (d == 0) {
                        for (let i = 0; i < build[0].floor.length; i++) {
                            for (let j = 0; j < build[0].floor[i].room.length; j++) {
                                if (roomNumberInput == build[0].floor[i].room[j].roomNumber) {
                                    count = 1
                                    build[0].floor[i].room[j].user.push({
                                        personID: req.body.personID,
                                        firstName: req.body.firstName,
                                        lastName: req.body.lastName,
                                        birthday: req.body.birthday,
                                        address: req.body.address,
                                        phoneNumber: req.body.phoneNumber,
                                        License: req.body.License

                                    })
                                    build[0].floor[i].room[j].roomStatus = 'ไม่ว่าง'

                                    build[0].save().then((suc) => {
                                        console.log('res person : ', suc)
                                        res.send("บันทึกสำเร็จ")
                                    }, (e) => {
                                        consoel.log('error person :', e)
                                        res.status(400).send(e)
                                    })



                                }
                            }
                        }

                    } else {
                        res.send('not mat')
                    }
                    if (count == 1) {
                        console.log('saveuser room')
                        let newUserroom = new Userroom({
                            usernameuser: req.body.phoneNumber,
                            passworduser: req.body.personID,
                            fnameuser: req.body.firstName,
                            lnameuser: req.body.lastName,
                            phoneuser: req.body.phoneNumber,
                            BuildingNameuser: req.body.BuildingName,


                        })
                        newUserroom.save().then((d) => {
                            res.send("บันทึกสำเร็จ")
                        }, (e) => {
                            console.log(e)
                            res.status(400).send(e)
                        })
                    }

                    //res.send(admin[0])
                } else if (build.length == 0) {

                }
            }, (err) => {
                res.status(400).send(err)
            })
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//updateUser หน้า personInput
app.post('/updateUser', (req, res) => {
    let BuildingNameInput = req.body.BuildingName
    let roomNumberInput = req.body.roomNumber
    let personIDInput = req.body.personID
    let firstNameInput = req.body.firstName
    let lastNameInput = req.body.lastName
    let birthdayInput = req.body.birthday
    let addressInput = req.body.address
    let phoneNumberInput = req.body.phoneNumber
    let LicenseInput = req.body.License
    let phoneruserInput = req.body.phoneuser
    let personiduserInput = req.body.personiduser
    // console.log('test')
    // console.log(BuildingNameInput )
    // console.log(roomNumberInput)
    // console.log(personIDInput)
    // console.log(firstNameInput)
    // console.log(lastNameInput)
    // console.log(birthdayInput)
    // console.log(addressInput)
    // console.log(phoneNumberInput)
    // console.log(LicenseInput)
    // console.log('test###############')

    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let i = 0; i < build[0].floor.length; i++) {
                for (let j = 0; j < build[0].floor[i].room.length; j++) {
                    if (roomNumberInput == build[0].floor[i].room[j].roomNumber) {
                        for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                            if (personiduserInput == build[0].floor[i].room[j].user[k].personID) {
                                // console.log('===========')
                                // console.log(build[0].floor[i].room[j].user[k].personID)
                                // console.log(personIDInput)
                                // console.log('===========')

                                build[0].floor[i].room[j].user[k].personID = personIDInput
                                build[0].floor[i].room[j].user[k].firstName = firstNameInput
                                build[0].floor[i].room[j].user[k].lastName = lastNameInput
                                build[0].floor[i].room[j].user[k].birthday = birthdayInput
                                build[0].floor[i].room[j].user[k].address = addressInput
                                build[0].floor[i].room[j].user[k].phoneNumber = phoneNumberInput
                                build[0].floor[i].room[j].user[k].License = LicenseInput
                                console.log('test')
                                console.log(build[0].floor[i].room[j].user[k].personID)
                                console.log(build[0].floor[i].room[j].user[k].firstName)
                                console.log(build[0].floor[i].room[j].user[k].lastName)
                                console.log(build[0].floor[i].room[j].user[k].birthday)
                                console.log(build[0].floor[i].room[j].user[k].address)
                                console.log(build[0].floor[i].room[j].user[k].phoneNumber)
                                console.log(build[0].floor[i].room[j].user[k].License)
                                console.log('test###############')

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    res.status(400).send(e)
                                })


                            }
                        }
                    }
                }
            }



            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//=======
app.post('/updateUserroom', (req, res) => {
    let BuildingNameInput = req.body.BuildingName
    let roomNumberInput = req.body.roomNumber
    let personIDInput = req.body.personID
    let firstNameInput = req.body.firstName
    let lastNameInput = req.body.lastName
    let birthdayInput = req.body.birthday
    let addressInput = req.body.address
    let phoneNumberInput = req.body.phoneNumber
    let LicenseInput = req.body.License
    let phoneruserInput = req.body.phoneuser

    Userroom.find({
        usernameuser: phoneruserInput,
    }).then((user) => {
        if (user.length == 1) {
            for (let d = 0; d < user.length; d++) {
                user[0].usernameuser = phoneNumberInput
                user[0].passworduser = personIDInput
                user[0].fnameuser = firstNameInput
                user[0].lnameuser = lastNameInput
                user[0].phoneuser = phoneNumberInput
                user[0].BuildingNameuser = BuildingNameInput

                user[0].save().then((suc) => {
                    console.log('res person : ', suc)
                    res.send(suc)
                }, (e) => {
                    consoel.log('error person :', e)
                    res.status(400).send(e)
                })

            }

            //res.send(admin[0])
        } else if (user.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//deleteuser หน้า personInput
app.post('/deleteUser', (req, res) => {
    // let newUserdelete = new Userdelete({
    //     BuildingNameAllow: req.body.BuildingName,
    //     roomNumberAllow: req.body.roomNumber,
    //     personIDAllow: req.body.personID,
    //     firstNameAllow: req.body.firstName,
    //     lastNameAllow: req.body.lastName,
    //     birthdayAllow: req.body.birthday,
    //     addressAllow: req.body.address,
    //     phoneNumberAllow: req.body.phoneNumber,
    //     LicenseAllow: req.body.License,
    // })
    // res.send('pop')
    // res.send(newUserdelete)
    // res.send('pop')
    // // console.log(newUserdelete)
    // // console.log(roomNumberAllow)
    // // console.log(personIDAllow)
    // // console.log( firstNameAllow)
    // // console.log(lastNameAllow)
    // // console.log(birthdayAllow)
    // // console.log(addressAllow)
    // // console.log(phoneNumberAllow)
    // // console.log(LicenseAllow)

    // newUserdelete.save().then((d) => {
    //     res.send(d)
    //     res.send(newUserdelete)
    // }, (e) => {
    //     console.log(e)
    //     res.status(400).send(e)
    // })
    // let LicenseInput = req.body.License
    // let addressInput = req.body.address
    let BuildingNameInput = req.body.BuildingName
    let roomNumberInput = req.body.roomNumber
    let personIDInput = req.body.personID
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let i = 0; i < build[0].floor.length; i++) {
                for (let j = 0; j < build[0].floor[i].room.length; j++) {
                    if (roomNumberInput == build[0].floor[i].room[j].roomNumber) {
                        for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                            if (personIDInput == build[0].floor[i].room[j].user[k].personID) {
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: req.body.BuildingName,
                                    roomNumberAllow: req.body.roomNumber,
                                    personIDAllow: req.body.personID,
                                    firstNameAllow: req.body.firstName,
                                    lastNameAllow: req.body.lastName,
                                    birthdayAllow: req.body.birthday,
                                    phoneNumberAllow: req.body.phoneNumber,
                                    Li: req.body.License,
                                    ad: req.body.address
                                })
                                console.log(newUserdelete)
                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    res.status(400).send(e)
                                })
                                console.log('hhhhh')
                                // console.log(addressInput)
                                console.log('hhhhh')
                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    res.status(400).send(e)
                                })
                            }

                        }
                    }
                }
            }
            Userroom.remove({ 'passworduser': personIDInput }, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('remove successfully.');
            })

            //res.send(admin[0])

            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//หน้า api post หน้า delete user
// app.post('/postUserdelete', (req, res) => {
//     let newUserdelete = new Userdelete({
//         BuildingNameAllow: req.body.BuildingName,
//         roomNumberAllow: req.body.roomNumber,
//         personIDAllow: req.body.personID,
//         firstNameAllow: req.body.firstName,
//         lastNameAllow: req.body.lastName,
//         birthdayAllow: req.body.birthday,
//         addressAllow: req.body.address,
//         phoneNumberAllow: req.body.phoneNumber,
//         LicenseAllow:req.body.License,
//     })
//     console.log(newUserdelete)
//     newUserdelete.save().then((d) => {
//         res.send(d)
//     }, (e) => {
//         console.log(e)
//         res.status(400).send(e)
//     })
// })

// api getUser หน้า personInput
app.get('/getUser/:BuildingName/', (req, res) => {
    Building.find({
        BuildingName: req.params.BuildingName
    }).then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})
//---------------------------------------------------------------
//หน้าที่ 2 หน้าดึงข้อมูล user delete ของ user ที่ถูกลบ ในหน้าที่ 2
app.get('/getUserdelete', (req, res) => {
    Userdelete.find().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})
//---------------------------------------------------------------------------------------
//หน้า 3 เพิ่มมิเตอร์
// app.post('/postMeter', (req, res) => {
//     let newmeterbuild = new meterbuild({
//         floormeter: req.body.floormeter,
//         pricemeter: req.body.pricemeter,
//         buildingnamemeter: req.body.buildingnamemeter,
//         datemeter: req.body.datemeter,

//     })
//     newmeterbuild.save().then((d) => {
//         res.send(d)
//     }, (e) => {
//         console.log(e)
//         res.send(e)
//         res.status(400).send(e)
//     })
// })
//โพสมิเตอร์
app.post('/postMeter', (req, res) => {
    let newmeterbuild = new meterbuild({
        floormeter: req.body.floormeter,
        pricemeter: req.body.pricemeter,
        pricewater: req.body.pricewater,
        buildingnamemeter: req.body.buildingnamemeter,
        datemeter: req.body.datemeter
    })
    let floormeterInput = req.body.floormeter
    let pricemeterInput = req.body.pricemeter
    let buildingnamemeterInput = req.body.buildingnamemeter
    let datemeterInput = req.body.datemeter
    // console.log('d',floormeterInput.floormeter.roommeter.dateroommeter)
    meterbuild.find({
        buildingnamemeter: buildingnamemeterInput,
        datemeter: datemeterInput
        //    BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let m = 0; m < build.length; m++) {
                for (let i = 0; i < build[m].floormeter.length; i++) {
                    for (let j = 0; j < build[m].floormeter[i].roommeter.length; j++) {
                        //   console.log('d',floormeterInput[i].roommeter[j].beforusemeter)
                        build[m].floormeter[i].roommeter[j].beforusemeter = floormeterInput[i].roommeter[j].beforusemeter
                        build[m].floormeter[i].roommeter[j].usemeter = floormeterInput[i].roommeter[j].usemeter
                        build[m].floormeter[i].roommeter[j].usemetermonth = floormeterInput[i].roommeter[j].usemetermonth
                        build[m].floormeter[i].roommeter[j].meterstatus = floormeterInput[i].roommeter[j].meterstatus

                        build[m].save().then((suc) => {
                            console.log('res contract : ', suc)
                            res.send(suc)
                        }, (e) => {
                            consoel.log('error contract :', e)
                            res.status(400).send(e)
                        })

                    }
                }
            }

            //res.send(admin[0])
        } else if (build.length == 0) {
            newmeterbuild.save().then((d) => {
                res.send(d)
            }, (e) => {
                console.log(e)
                res.send(e)
                res.status(400).send(e)
            })
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//post มิเตอร์รวมของหอพัก
app.post('/postsomeMeter', (req, res) => {

    let newmeterbuild = new meterbuild({
        pricemeter: req.body.pricemeter,
        pricewater: req.body.pricewater,
        buildingnamemeter: req.body.buildingnamemeter,
        datemeter: req.body.datemeter,
        someunitmeter: req.body.someunitmeter,
        somepricemeter: req.body.somepricemeter,

    })

    let somepricemeterInput = req.body.somepricemeter
    let someunitmeterInput = req.body.someunitmeter
    let buildingnamemeterInput = req.body.buildingnamemeter
    let datemeterInput = req.body.datemeter

    // console.log('d',floormeterInput.floormeter.roommeter.dateroommeter)
    meterbuild.find({
        buildingnamemeter: buildingnamemeterInput,
        datemeter: datemeterInput
        //    BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let m = 0; m < build.length; m++) {
                build[m].someunitmeter = someunitmeterInput
                build[m].somepricemeter = somepricemeterInput

                build[m].save().then((suc) => {
                    console.log('res contract : ', suc)
                    res.send(suc)
                }, (e) => {
                    consoel.log('error contract :', e)
                    res.status(400).send(e)
                })
            }
            //res.send(admin[0])
        } else if (build.length == 0) {
            newmeterbuild.save().then((d) => {
                res.send(d)
            }, (e) => {
                console.log(e)
                res.send(e)
                res.status(400).send(e)
            })
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//post water ของหอพัก
app.post('/postWater', (req, res) => {
    let newmeterbuild = new meterbuild({
        floormeter: req.body.floormeter,
        pricemeter: req.body.pricemeter,
        pricewater: req.body.pricewater,
        buildingnamemeter: req.body.buildingnamemeter,
        datemeter: req.body.datemeter
    })
    let floormeterInput = req.body.floormeter
    let pricemeterInput = req.body.pricemeter
    let buildingnamemeterInput = req.body.buildingnamemeter
    let datemeterInput = req.body.datemeter
    // console.log('d',floormeterInput.floormeter.roommeter.dateroommeter)
    meterbuild.find({
        buildingnamemeter: buildingnamemeterInput,
        datemeter: datemeterInput
        //    BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let m = 0; m < build.length; m++) {
                for (let i = 0; i < build[m].floormeter.length; i++) {
                    for (let j = 0; j < build[m].floormeter[i].roommeter.length; j++) {
                        //   console.log('d',floormeterInput[i].roommeter[j].beforusemeter)
                        build[m].floormeter[i].roommeter[j].beforusewater = floormeterInput[i].roommeter[j].beforusewater
                        build[m].floormeter[i].roommeter[j].usewater = floormeterInput[i].roommeter[j].usewater
                        build[m].floormeter[i].roommeter[j].usewatermonth = floormeterInput[i].roommeter[j].usewatermonth
                        build[m].floormeter[i].roommeter[j].waterstatus = floormeterInput[i].roommeter[j].waterstatus

                        build[m].save().then((suc) => {
                            console.log('res contract : ', suc)
                            res.send(suc)
                        }, (e) => {
                            consoel.log('error contract :', e)
                            res.status(400).send(e)
                        })

                    }
                }
            }

            //res.send(admin[0])
        } else if (build.length == 0) {
            newmeterbuild.save().then((d) => {
                res.send(d)
            }, (e) => {
                console.log(e)
                res.send(e)
                res.status(400).send(e)
            })
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//post >>>>>>>ภาพรวมน้ำ<<<<ของหอพักที่จ่ายให้การไฟฟ้า
app.post('/postsomeWater', (req, res) => {

    let newmeterbuild = new meterbuild({
        pricemeter: req.body.pricemeter,
        pricewater: req.body.pricewater,
        buildingnamemeter: req.body.buildingnamemeter,
        datemeter: req.body.datemeter,
        someunitwater: req.body.someunitwater,
        somepricewater: req.body.somepricewater,

    })

    let somepricewaterInput = req.body.somepricewater
    let someunitwaterInput = req.body.someunitwater
    let buildingnamemeterInput = req.body.buildingnamemeter
    let datemeterInput = req.body.datemeter

    // console.log('d',floormeterInput.floormeter.roommeter.dateroommeter)
    meterbuild.find({
        buildingnamemeter: buildingnamemeterInput,
        datemeter: datemeterInput
        //    BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let m = 0; m < build.length; m++) {
                build[m].someunitwater = someunitwaterInput
                build[m].somepricewater = somepricewaterInput

                build[m].save().then((suc) => {
                    console.log('res contract : ', suc)
                    res.send(suc)
                }, (e) => {
                    consoel.log('error contract :', e)
                    res.status(400).send(e)
                })
            }
            //res.send(admin[0])
        } else if (build.length == 0) {
            newmeterbuild.save().then((d) => {
                res.send(d)
            }, (e) => {
                console.log(e)
                res.send(e)
                res.status(400).send(e)
            })
        }
    }, (err) => {
        res.status(400).send(err)
    })
})

app.get('/getmeter/:getdata/', (req, res) => {
    let data = req.params.getdata
    let getdata1 = ''
    let getdata2 = ''
    let getdata3 = ''
    let i = 0
    var datameter = []

    while (data[i] != ',') {
        getdata1 = getdata1 + data[i]
        i++;
    }
    i++
    while (data[i] != ',') {
        getdata2 = getdata2 + data[i]
        i++;
    }
    i++
    while (i < data.length) {
        getdata3 = getdata3 + data[i]
        i++;
    }
    //  console.log('namenow', getdata1)
    //  console.log('now1', getdata2)
    //  console.log('now2', getdata3)

    meterbuild.find({
        buildingnamemeter: getdata1,
        datemeter: getdata2
    }).then((build) => {
        // datameter.push(doc1)
        res.send(build)
        console.log(build)
        // meterbuild.find({
        //     buildingnamemeter: getdata1,
        //     datemeter: getdata3
        // // }).then((doc2) => {
        // //     datameter.push(doc2)
        // //     res.send(datameter)
        // //        console.log(datameter)
        // // }, (err) => {
        // //     res.status(404).send(err)
        // // })
    }, (err) => {
        res.status(404).send(err)
    })
})
//ดึงมิเตอร์ก่อนหน้า
app.get('/getmeterbefor/:getdata/', (req, res) => {
    let data = req.params.getdata
    let getdata1 = ''
    let getdata2 = ''
    let getdata3 = ''
    let i = 0
    var datameter = []

    while (data[i] != ',') {
        getdata1 = getdata1 + data[i]
        i++;
    }
    i++
    while (data[i] != ',') {
        getdata2 = getdata2 + data[i]
        i++;
    }
    i++
    while (i < data.length) {
        getdata3 = getdata3 + data[i]
        i++;
    }
    // console.log('namebefor', getdata1)
    // console.log('befor1', getdata2)
    //  console.log('befor2', getdata3)

    meterbuild.find({
        buildingnamemeter: getdata1,
        datemeter: getdata3
    }).then((build) => {
        // datameter.push(doc1)
        res.send(build)
        console.log(build)
        // meterbuild.find({
        //     buildingnamemeter: getdata1,
        //     datemeter: getdata3
        // // }).then((doc2) => {
        // //     datameter.push(doc2)
        // //     res.send(datameter)
        // //        console.log(datameter)
        // // }, (err) => {
        // //     res.status(404).send(err)
        // // })
    }, (err) => {
        res.status(404).send(err)
    })
})
//------------------------------------หน้าวิเคราห์ระบบ----------------------------------------
app.get('/getmeteranalysis/:getdata/', (req, res) => {
    let data = req.params.getdata
    let getdata1 = ''
    let getdata2 = ''
    let i = 0
    var datameter = []
    console.log('dataana', data)

    while (data[i] != ',') {
        getdata1 = getdata1 + data[i]
        i++;
    }
    i++
    while (i < data.length) {
        getdata2 = getdata2 + data[i]
        i++;
    }
    //  console.log('ชื่อหอ', getdata1)
    //   console.log('วันที่', getdata2)
    meterbuild.find({
        buildingnamemeter: getdata1,
        datemeter: getdata2
    }).then((build) => {
        // datameter.push(doc1)
        res.send(build)
        console.log(build)
    }, (err) => {
        res.status(404).send(err)
    })
})
//-------------------------------------หน้า5 ใบเเจ้งหนี้เเละใบเสร็จ-------------------------------
app.get('/getmeterbuilds/:BuildingName', (req, res) => {
    // && _data.floor[i].room[j].roomStatus == 'ไม่ว่าง'
    let doc = []
    meterbuild.find({
        buildingnamemeter: req.params.BuildingName
    }).then((build) => {
        if (build.length >= 1) {
            for (let m = 0; m < build.length; m++) {
                for (let i = 0; i < build[m].floormeter.length; i++) {
                    for (let j = 0; j < build[m].floormeter[i].roommeter.length; j++) {
                        if (build[m].floormeter[i].roommeter[j].meterstatus == "ค้างชำระ" && build[m].floormeter[i].roommeter[j].waterstatus == "ค้างชำระ" && build[m].floormeter[i].roommeter[j].statusprint != "เคยพริ้น") {
                            if (doc.length >= 1) {
                                for (let n = 0; n < doc.length; n++) {
                                    if (doc[n] != build[m]) {
                                        doc.push(build[m])

                                    }
                                }
                            } else {
                                doc.push(build[m])

                            }
                            // doc.push(build[m])
                            // Array.from(new Set(doc))
                            //console.log('log',build[m])
                        }
                    }
                }
            }
            let a = uab(doc)
            res.send(a)
        } else if (build.length == 0) {
            res.status(400).send('sory ')
        }
    }, (err) => {
        res.status(404).send(err)
    })
})
// app.get('/getmeterbuilds/:BuildingName', (req, res) => {
//     meterbuild.find({
//         buildingnamemeter: req.params.BuildingName
//     }).then((doc) => {

//         res.send(doc)

//     }, (err) => {
//         res.status(404).send(err)
//     })

// })
app.get('/print', function (req, res) {
    var filePath = "/sss.pdf";

    fs.readFile(__dirname + filePath, function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.post('/postPrint', (req, res) => {
    let methodwater = req.body.methodwater
    let buildingName = req.body.BuildingName
    let rooms = req.body.RoomPrint
    let roomNumber = []
    rooms.forEach((e, i) => {
        roomNumber.push(e)
        // roomNumber.push(e.split(',')[1])
    })
    // console.log('room is : ', rooms)
    console.log('room is number: ', roomNumber)

    let dates = req.body.Datameterbuilds
    let stringData = [] // ข้อมูลทุกห้อง-
    console.log('#######')
    dates.forEach((e, i) => {
        let {
            pricemeter,
            pricewater,
            datemeter,
            floormeter,
        } = e

        let objData = { //ข้อมูลแต่ละห้อง
            buildingName,
            datemeter,
        }

        floormeter.forEach((f, i) => {
            let { roommeter } = f
            roommeter.forEach((r, i) => {
                console.log('curroom is : ', r.dateroommeter)
                if (roomNumber.indexOf(r.dateroommeter) !== -1) { // ห้องที่ checked
                    let {
                        roomNumbermeter,
                        beforusemeter,
                        usemeter,
                        usemetermonth,
                        beforusewater,
                        usewater,
                        usewatermonth,
                        rentroommeter,
                    } = r
                    objData.roomNumber = roomNumbermeter
                    objData.rent = rentroommeter,
                        objData.meter = {
                            beforusemeter, usemeter, usemetermonth
                        }
                    objData.water = {
                        beforusewater, usewater, usewatermonth
                    }
                    objData.pricemeter = pricemeter
                    objData.pricewater = pricewater
                    objData.meterTotal = usemeter * pricemeter
                    if (methodwater === 'rentunit') {
                        objData.waterTotal = usewater * pricewater
                    } else {
                        objData.waterTotal = pricewater
                    }
                    console.log('room', roomNumbermeter, ' , usemeter :', usemeter)
                    stringData.push(objData)
                }
            }) // end per room

        })
    }) // end all date
    console.log('stringData is : ', stringData)

    //console.log('data is : ', JSON.stringify(req.body))
    const PDFDocument = require('pdfkit')
    const fs = require('fs')

    const doc = new PDFDocument()



    doc.pipe(fs.createWriteStream('sss.pdf'))

    stringData.forEach((page, i) => {
        doc.font('fonts/ThaiSansLite.ttf').fontSize(25)

        doc
        // .text(`หน้า ${i + 1}`, 100, 80)
        doc.fontSize(28).text('ใบเเจ้งหนี้(Invoice)', {
            align: 'center',
            fontSize: '30'
        })
            //.text(JSON.stringify(page), 100, 100)
            .moveDown(0.25)
        doc.fontSize(24).text(`ชื่อหอพัก ${stringData[i].buildingName}`)
            .moveDown(0.1)
        doc.fontSize(24).text(`เลขที่ห้องพัก ${stringData[i].roomNumbermeter}`)
            .moveDown(0.1)
        doc.fontSize(24).text(`ประจำเดือนที่ ${stringData[i].datemeter}`)
        doc.underline(50, 200, 500, 27, { color: "black" })

            .moveDown(0.25)
        doc.fontSize(15).text(`           เลขมิเตอร์ก่อนหน้า เลขมิเตอร์ปัจจุบัน  จำนวนที่ใช้  ราคาต่อหน่วย/บาท  จำนวนเงินที่ต้องจ่าย`)
        .moveDown(0.1)
        doc.fontSize(15).text(`ค่าเช่า                                                                                   ${stringData[i].rent}`)
        .moveDown(0.1)
        doc.fontSize(15).text(`ค่าไฟฟ้า                ${stringData[i].meter.beforusemeter}              ${stringData[i].meter.usemeter}          ${stringData[i].meter.usemetermonth}                ${stringData[i].pricemeter}                  ${stringData[i].meterTotal}`)
        .moveDown(0.1)
        doc.fontSize(15).text(`ค่าน้ำ                   ${stringData[i].water.beforusewater}              ${stringData[i].water.usewater}          ${stringData[i].water.usewatermonth}                ${stringData[i].pricewater}                 ${stringData[i].waterTotal}`)
        doc.underline(50, 300, 500, 27, { color: "black" })
        //.text(JSON.stringify(page), 100, 100)
        .moveDown(1)
        doc.fontSize(24).text(`รวมทั้งสิ้น  ${stringData[i].rent +stringData[i].meterTotal+stringData[i].waterTotal }   บาท`)
        doc.underline(0, 350, 620, 45, { color: "black" })
        doc.underline(0, 350, 620, 45, { color: "black" })
        doc.underline(0, 350, 620, 45, { color: "black" })
        .moveDown(1)
        //=============บน
        doc.fontSize(28).text('ใบเเจ้งหนี้(Invoice)', {
            align: 'center',
            fontSize: '30'
        })
        .moveDown(0.25)
        doc.fontSize(24).text(`ชื่อหอพัก ${stringData[i].buildingName}`)
            .moveDown(0.1)
        doc.fontSize(24).text(`เลขที่ห้องพัก ${stringData[i].roomNumbermeter}`)
            .moveDown(0.1)
        doc.fontSize(24).text(`ประจำเดือนที่ ${stringData[i].datemeter}`)
        doc.underline(50, 535, 500, 27, { color: "black" })

            .moveDown(0.25)
        doc.fontSize(15).text(`           เลขมิเตอร์ก่อนหน้า เลขมิเตอร์ปัจจุบัน  จำนวนที่ใช้  ราคาต่อหน่วย/บาท  จำนวนเงินที่ต้องจ่าย`)
        .moveDown(0.1)
        doc.fontSize(15).text(`ค่าเช่า                                                                                   ${stringData[i].rent}`)
        .moveDown(0.1)
        doc.fontSize(15).text(`ค่าไฟฟ้า                ${stringData[i].meter.beforusemeter}              ${stringData[i].meter.usemeter}          ${stringData[i].meter.usemetermonth}                ${stringData[i].pricemeter}                  ${stringData[i].meterTotal}`)
        .moveDown(0.1)
        doc.fontSize(15).text(`ค่าน้ำ                   ${stringData[i].water.beforusewater}              ${stringData[i].water.usewater}          ${stringData[i].water.usewatermonth}                ${stringData[i].pricewater}                 ${stringData[i].waterTotal}`)
        doc.underline(50, 635, 500, 27, { color: "black" })
        //.text(JSON.stringify(page), 100, 100)
        .moveDown(1)
        doc.fontSize(24).text(`รวมทั้งสิ้น  ${stringData[i].rent +stringData[i].meterTotal+stringData[i].waterTotal }   บาท`)
       
        doc.addPage()


    })
    doc.end()

    res.send('done')
})


app.post('/postPrintpay', (req, res) => {
    let dataprint = req.body.htmlStringmeterprintpay
    let BuildingNameInput = req.body.BuildingName
    let RoomPrintInput = req.body.RoomPrint
    console.log('name', BuildingNameInput)
    console.log('room', RoomPrintInput)

    meterbuild.find({
        buildingnamemeter: BuildingNameInput,

    }).then((build) => {
        if (build.length >= 1) {
            console.log('ggrecive', build.length)
            for (let l = 0; l < RoomPrintInput.length; l++) {
                for (let m = 0; m < build.length; m++) {
                    for (let i = 0; i < build[m].floormeter.length; i++) {
                        for (let j = 0; j < build[m].floormeter[i].roommeter.length; j++) {
                            if (RoomPrintInput[l] == build[m].floormeter[i].roommeter[j].dateroommeter) {
                                build[m].floormeter[i].roommeter[j].meterstatus = 'ไม่มียอดค้างชำระ'
                                build[m].floormeter[i].roommeter[j].waterstatus = 'ไม่มียอดค้างชำระ'
                                build[m].floormeter[i].roommeter[j].statusprint = 'เคยพริ้น'
                                build[m].save().then((suc) => {
                                    console.log('res contract : ', suc)
                                    res.send(suc)
                                }, (e) => {
                                    consoel.log('error contract :', e)
                                    res.status(400).send(e)
                                })
                            }
                        }
                    }
                }
            }
            res.send(build[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })

    var fs = require('fs');
    var pdf = require('html-pdf');
    //var html = fs.readFileSync(dataprint , 'utf8');
    var options = { format: 'Letter' };
    // console.log('data is :',  req.body)
    pdf.create('<html lang="en"><head><meta charset="UTF-8"></head><body>' + dataprint + '</body></html>', options).toFile('./files/Receipt.pdf', function (err, res) {
        if (err) return console.log(err);
        //console.log(res); // { filename: '/app/businesscard.pdf' }
    });
})
//render เเทบใบเสร็จรับเงินหน้าใหม่
app.get('/printt', function (req, res) {
    let filePath = "/files/Receipt.pdf";

    fs.readFile(__dirname + filePath, function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});
//ออกจากหอพัก
app.post('/outroom', (req, res) => {

    let BuildingNameInput = req.body.BuildingName
    let roomNumberInput = req.body.roomNumber
    let nowmeterInput = req.body.nowmeter
    let nowwaterInput = req.body.nowwater
    let dataprint = req.body.htmlStringmeterprint

    var pdf = require('html-pdf');
    var options = { format: 'Letter' };
    pdf.create('<html lang="en"><head><meta charset="UTF-8"></head><body>' + dataprint + '</body></html>', options).toFile('./files/lastinvoice.pdf', function (err, res) {
        if (err) return console.log(err);
    });

    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let i = 0; i < build[0].floor.length; i++) {
                for (let j = 0; j < build[0].floor[i].room.length; j++) {
                    if (roomNumberInput == build[0].floor[i].room[j].roomNumber) {
                        if (build[0].floor[i].room[j].user.length >= 1) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log('check user.length', build[0].floor[i].room[j].user.length)
                                console.log('check user.length', k)
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: BuildingNameInput,
                                    roomNumberAllow: roomNumberInput,
                                    personIDAllow: build[0].floor[i].room[j].user[k].personID,
                                    firstNameAllow: build[0].floor[i].room[j].user[k].firstName,
                                    lastNameAllow: build[0].floor[i].room[j].user[k].lastName,
                                    birthdayAllow: build[0].floor[i].room[j].user[k].birthday,
                                    phoneNumberAllow: build[0].floor[i].room[j].user[k].phoneNumber,
                                    Li: build[0].floor[i].room[j].user[k].License,
                                    ad: build[0].floor[i].room[j].user[k].address
                                })
                                // console.log(newUserdelete)

                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    //    res.status(400).send(e)
                                })
                                console.log('personid user ', build[0].floor[i].room[j].user[k].personID)
                                Userroom.remove({ 'passworduser': build[0].floor[i].room[j].user[k].personID }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('remove successfully.');
                                })


                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    //   res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    //    res.status(400).send(e)
                                })
                                console.log('check user.length2', k)
                            }
                        }
                        if (build[0].floor[i].room[j].user.length >= 1) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log('check user.length', build[0].floor[i].room[j].user.length)
                                console.log('check user.length', k)
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: BuildingNameInput,
                                    roomNumberAllow: roomNumberInput,
                                    personIDAllow: build[0].floor[i].room[j].user[k].personID,
                                    firstNameAllow: build[0].floor[i].room[j].user[k].firstName,
                                    lastNameAllow: build[0].floor[i].room[j].user[k].lastName,
                                    birthdayAllow: build[0].floor[i].room[j].user[k].birthday,
                                    phoneNumberAllow: build[0].floor[i].room[j].user[k].phoneNumber,
                                    Li: build[0].floor[i].room[j].user[k].License,
                                    ad: build[0].floor[i].room[j].user[k].address
                                })
                                // console.log(newUserdelete)

                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    //    res.status(400).send(e)
                                })
                                console.log('personid user ', build[0].floor[i].room[j].user[k].personID)
                                Userroom.remove({ 'passworduser': build[0].floor[i].room[j].user[k].personID }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('remove successfully.');
                                })


                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    //   res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    //    res.status(400).send(e)
                                })
                                console.log('check user.length2', k)
                            }
                        }
                        if (build[0].floor[i].room[j].user.length >= 1) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log('check user.length', build[0].floor[i].room[j].user.length)
                                console.log('check user.length', k)
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: BuildingNameInput,
                                    roomNumberAllow: roomNumberInput,
                                    personIDAllow: build[0].floor[i].room[j].user[k].personID,
                                    firstNameAllow: build[0].floor[i].room[j].user[k].firstName,
                                    lastNameAllow: build[0].floor[i].room[j].user[k].lastName,
                                    birthdayAllow: build[0].floor[i].room[j].user[k].birthday,
                                    phoneNumberAllow: build[0].floor[i].room[j].user[k].phoneNumber,
                                    Li: build[0].floor[i].room[j].user[k].License,
                                    ad: build[0].floor[i].room[j].user[k].address
                                })
                                // console.log(newUserdelete)

                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    //    res.status(400).send(e)
                                })
                                console.log('personid user ', build[0].floor[i].room[j].user[k].personID)
                                Userroom.remove({ 'passworduser': build[0].floor[i].room[j].user[k].personID }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('remove successfully.');
                                })


                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    //   res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    //    res.status(400).send(e)
                                })
                                console.log('check user.length2', k)
                            }
                        }
                        if (build[0].floor[i].room[j].user.length >= 1) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log('check user.length', build[0].floor[i].room[j].user.length)
                                console.log('check user.length', k)
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: BuildingNameInput,
                                    roomNumberAllow: roomNumberInput,
                                    personIDAllow: build[0].floor[i].room[j].user[k].personID,
                                    firstNameAllow: build[0].floor[i].room[j].user[k].firstName,
                                    lastNameAllow: build[0].floor[i].room[j].user[k].lastName,
                                    birthdayAllow: build[0].floor[i].room[j].user[k].birthday,
                                    phoneNumberAllow: build[0].floor[i].room[j].user[k].phoneNumber,
                                    Li: build[0].floor[i].room[j].user[k].License,
                                    ad: build[0].floor[i].room[j].user[k].address
                                })
                                // console.log(newUserdelete)

                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    //    res.status(400).send(e)
                                })
                                console.log('personid user ', build[0].floor[i].room[j].user[k].personID)
                                Userroom.remove({ 'passworduser': build[0].floor[i].room[j].user[k].personID }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('remove successfully.');
                                })


                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    //   res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    //    res.status(400).send(e)
                                })
                                console.log('check user.length2', k)
                            }
                        }
                        if (build[0].floor[i].room[j].user.length >= 1) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log('check user.length', build[0].floor[i].room[j].user.length)
                                console.log('check user.length', k)
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: BuildingNameInput,
                                    roomNumberAllow: roomNumberInput,
                                    personIDAllow: build[0].floor[i].room[j].user[k].personID,
                                    firstNameAllow: build[0].floor[i].room[j].user[k].firstName,
                                    lastNameAllow: build[0].floor[i].room[j].user[k].lastName,
                                    birthdayAllow: build[0].floor[i].room[j].user[k].birthday,
                                    phoneNumberAllow: build[0].floor[i].room[j].user[k].phoneNumber,
                                    Li: build[0].floor[i].room[j].user[k].License,
                                    ad: build[0].floor[i].room[j].user[k].address
                                })
                                // console.log(newUserdelete)

                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    //    res.status(400).send(e)
                                })
                                console.log('personid user ', build[0].floor[i].room[j].user[k].personID)
                                Userroom.remove({ 'passworduser': build[0].floor[i].room[j].user[k].personID }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('remove successfully.');
                                })


                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    //   res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    //    res.status(400).send(e)
                                })
                                console.log('check user.length2', k)
                            }
                        }
                        if (build[0].floor[i].room[j].user.length >= 1) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log('check user.length', build[0].floor[i].room[j].user.length)
                                console.log('check user.length', k)
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: BuildingNameInput,
                                    roomNumberAllow: roomNumberInput,
                                    personIDAllow: build[0].floor[i].room[j].user[k].personID,
                                    firstNameAllow: build[0].floor[i].room[j].user[k].firstName,
                                    lastNameAllow: build[0].floor[i].room[j].user[k].lastName,
                                    birthdayAllow: build[0].floor[i].room[j].user[k].birthday,
                                    phoneNumberAllow: build[0].floor[i].room[j].user[k].phoneNumber,
                                    Li: build[0].floor[i].room[j].user[k].License,
                                    ad: build[0].floor[i].room[j].user[k].address
                                })
                                // console.log(newUserdelete)

                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    //    res.status(400).send(e)
                                })
                                console.log('personid user ', build[0].floor[i].room[j].user[k].personID)
                                Userroom.remove({ 'passworduser': build[0].floor[i].room[j].user[k].personID }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('remove successfully.');
                                })


                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    //   res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    //    res.status(400).send(e)
                                })
                                console.log('check user.length2', k)
                            }
                        }
                        if (build[0].floor[i].room[j].user.length >= 1) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log('check user.length', build[0].floor[i].room[j].user.length)
                                console.log('check user.length', k)
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: BuildingNameInput,
                                    roomNumberAllow: roomNumberInput,
                                    personIDAllow: build[0].floor[i].room[j].user[k].personID,
                                    firstNameAllow: build[0].floor[i].room[j].user[k].firstName,
                                    lastNameAllow: build[0].floor[i].room[j].user[k].lastName,
                                    birthdayAllow: build[0].floor[i].room[j].user[k].birthday,
                                    phoneNumberAllow: build[0].floor[i].room[j].user[k].phoneNumber,
                                    Li: build[0].floor[i].room[j].user[k].License,
                                    ad: build[0].floor[i].room[j].user[k].address
                                })
                                // console.log(newUserdelete)

                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    //    res.status(400).send(e)
                                })
                                console.log('personid user ', build[0].floor[i].room[j].user[k].personID)
                                Userroom.remove({ 'passworduser': build[0].floor[i].room[j].user[k].personID }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('remove successfully.');
                                })


                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    //   res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    //    res.status(400).send(e)
                                })
                                console.log('check user.length2', k)
                            }
                        }
                        if (build[0].floor[i].room[j].user.length >= 1) {
                            for (let k = 0; k < build[0].floor[i].room[j].user.length; k++) {
                                console.log('check user.length', build[0].floor[i].room[j].user.length)
                                console.log('check user.length', k)
                                let newUserdelete = new Userdelete({
                                    BuildingNameAllow: BuildingNameInput,
                                    roomNumberAllow: roomNumberInput,
                                    personIDAllow: build[0].floor[i].room[j].user[k].personID,
                                    firstNameAllow: build[0].floor[i].room[j].user[k].firstName,
                                    lastNameAllow: build[0].floor[i].room[j].user[k].lastName,
                                    birthdayAllow: build[0].floor[i].room[j].user[k].birthday,
                                    phoneNumberAllow: build[0].floor[i].room[j].user[k].phoneNumber,
                                    Li: build[0].floor[i].room[j].user[k].License,
                                    ad: build[0].floor[i].room[j].user[k].address
                                })
                                // console.log(newUserdelete)

                                newUserdelete.save().then((d) => {
                                    res.send(d)
                                }, (e) => {
                                    console.log(e)
                                    //    res.status(400).send(e)
                                })
                                console.log('personid user ', build[0].floor[i].room[j].user[k].personID)
                                Userroom.remove({ 'passworduser': build[0].floor[i].room[j].user[k].personID }, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('remove successfully.');
                                })


                                build[0].floor[i].room[j].user[k] = build[0].floor[i].room[j].user[k + 1]
                                build[0].floor[i].room[j].user.pop()

                                build[0].save().then((suc) => {
                                    console.log('res person : ', suc)
                                    //   res.send(suc)
                                }, (e) => {
                                    consoel.log('error person :', e)
                                    //    res.status(400).send(e)
                                })
                                console.log('check user.length2', k)
                            }
                        }
                        if (build[0].floor[i].room[j].user.length == 0) {

                            build[0].floor[i].room[j].contract = ""
                            build[0].floor[i].room[j].rentroom = 0
                            build[0].floor[i].room[j].roomStatus = "ว่าง"


                            build[0].save().then((suc) => {
                                console.log('res person : ', suc)
                                //   res.send(suc)
                            }, (e) => {
                                consoel.log('error person :', e)
                                //    res.status(400).send(e)
                            })
                        }

                    }
                }
            }

            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
app.get('/printout', function (req, res) {
    let filePath = "/files/lastinvoice.pdf";

    fs.readFile(__dirname + filePath, function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});


//-------------------------------------หน้าที่ 6 ---------------------------------------------
//หน้าที่ 6 หน้า เเก้ไขunitmeter 
app.post('/postUnitmeter', (req, res) => {

    let BuildingNameInput = req.body.BuildingName
    let UnitMeterInput = req.body.UnitMeter
    let dateInput = req.body.nowdate
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            build[0].UnitMeterbefor = build[0].UnitMeter
            build[0].UnitMeter = UnitMeterInput
            build[0].DateUnitMeter = dateInput

            build[0].save().then((suc) => {
                console.log('res contract : ', suc)
                res.send(suc)
            }, (e) => {
                consoel.log('error contract :', e)
                res.status(400).send(e)
            })
            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//เเก้ไข unit water
app.post('/postUnitwater', (req, res) => {

    let BuildingNameInput = req.body.BuildingName
    let plicewaterInput = req.body.plicewater
    let dateInput = req.body.nowdate
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            build[0].plicewaterbefor = build[0].plicewater
            build[0].plicewater = plicewaterInput
            build[0].DateUnitWater = dateInput

            build[0].save().then((suc) => {
                console.log('res contract : ', suc)
                res.send(suc)
            }, (e) => {
                consoel.log('error contract :', e)
                res.status(400).send(e)
            })
            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})

//หน้าเเก้ไขห้องพัก buildingNameIndex: _buildingName
app.post('/remove-room', (req, res) => {
    let RoomInput = req.body.numIndex
    let BuildingNameInput = req.body.buildingNameIndex

    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            console
            for (let i = 0; i < build[0].floor.length; i++) {
                for (let j = 0; j < build[0].floor[i].room.length; j++) {
                    if (build[0].floor[i].room[j].roomStatus == "ว่าง" || build[0].floor[i].room[j].roomStatus == "กำลังปรับปรุง") {
                        if (RoomInput == build[0].floor[i].room[j].roomNumber) {
                            build[0].floor[i].room[j] = build[0].floor[i].room[j + 1]
                            build[0].floor[i].room.pop()

                            build[0].save().then((suc) => {
                                console.log('res person : ', suc)
                                res.send(suc)
                            }, (e) => {
                                consoel.log('error person :', e)
                                res.status(400).send(e)
                            })
                        }
                    }
                }
            }
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
}) // save


app.post('/add-floor', (req, res) => {

    let BuildingNameInput = req.body.buildingNameIndex

    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            let lastNumber = build[0].floor.length
            console.log(lastNumber)
            build[0].floor.push({
                room: []
            })
            build[0].save().then((suc) => {
                console.log('res person : ', suc)
                res.send(suc)
            }, (e) => {
                consoel.log('error person :', e)
                res.status(400).send(e)
            })

        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
    // meterbuild.find({
    //     BuildingName: BuildingNameInput,
    // }).then((build) => {
    //     if (build.length == 1) {
    //         for (let i = 0; i < build.length; i++) {
    //             let lastNumber = build[i].floormeter.length
    //             console.log(lastNumber)
    //             build[i].floormeter.push({
    //                 roommeter: []
    //             })
    //             build[i].save().then((suc) => {
    //                 console.log('res person : ', suc)
    //                 res.send(suc)
    //             }, (e) => {
    //                 consoel.log('error person :', e)
    //                 res.status(400).send(e)
    //             })
    //         }
    //     } else if (build.length == 0) {
    //         res.status(400).send('sory not found is user')
    //     }
    // }, (err) => {
    //     res.status(400).send(err)
    // })
})

app.post('/add-room', (req, res) => {
    let fi = req.body.floorIndex
    let count = (parseInt(fi)) + 1
    let lastNumber = ''
    console.log('data : ', fi)
    //Building.findOne({BuildingNumber: req.body.BuildingName})
    Building.findOne({ BuildingName: req.body.buildingNameIndex }).then((b) => {
        if (b.floor[fi].room.length == 0 && count < 10) {
            lastNumber = "0" + (count) + "01"
            b.floor[fi].room.push({
                user: [],
                roomStatus: 'ว่าง',
                payStatus: false,
                contract: '',
                roomNumber: lastNumber
            })
        } else if (b.floor[fi].room.length == 0 && count >= 10) {
            lastNumber = (count) + "01"
            console.log('number :', lastNumber)
            b.floor[fi].room.push({
                user: [],
                roomStatus: 'ว่าง',
                payStatus: false,
                contract: '',
                roomNumber: lastNumber
            })
        } else {
            let lastNumber = b.floor[fi].room[b.floor[fi].room.length - 1].roomNumber

            lastNumber.charAt(0) === '0' ? lastNumber = +lastNumber.slice(1) : lastNumber = +lastNumber
            let nextNumber = '' + (lastNumber + 1)
            nextNumber.length === 3 ? nextNumber = '0' + nextNumber : nextNumber = nextNumber + ''
            b.floor[fi].room.push({
                user: [],
                roomStatus: 'ว่าง',
                payStatus: false,
                contract: '',
                roomNumber: nextNumber
            })
        }
        b.save().then((suc) => {
            console.log('success :', suc)
            res.send(suc)
        }, (e) => {
            console.log("error : ", e)
            res.status(400).send(e)
        })
    }, (error) => {
        res.status(400).send(error)
    })
})

//หน้าปรับปรุงห้องพัก
app.post('/postRoomUpdate', (req, res) => {
    let RoomUpdateInput = req.body.RoomUpdate
    let BuildingNameInput = req.body.BuildingName

    console.log('roomnumber', RoomUpdateInput)
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let l = 0; l < RoomUpdateInput.length; l++) {
                for (let i = 0; i < build[0].floor.length; i++) {
                    for (let j = 0; j < build[0].floor[i].room.length; j++) {
                        console.log('room', j)

                        if (RoomUpdateInput[l] == build[0].floor[i].room[j].roomNumber) {
                            build[0].floor[i].room[j].roomStatus = 'กำลังปรับปรุง'
                            console.log('roomlll', RoomUpdateInput[l])
                            build[0].save().then((suc) => {
                                console.log('res contract : ', suc)
                                res.send(suc)
                            }, (e) => {
                                console.log('error contract :', e)
                                res.status(400).send(e)
                            })

                        }
                    }
                }

            }
            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//เเกไขชื่อหอพัก
app.post('/postDatabuild', (req, res) => {
    let BuildingNameInput = req.body.BuildingName
    let PhoneInput = req.body.Phone
    let EmailInput = req.body.Email

    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {


            build[0].BuildingPhone = PhoneInput
            build[0].BuildingEmail = EmailInput


            build[0].save().then((suc) => {
                console.log('res contract : ', suc)
                res.send(suc)
            }, (e) => {
                consoel.log('error contract :', e)
                res.status(400).send(e)
            })


            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})
//====================ฝั่ง user ของหอพัก=================
app.post('/signinuser', (req, res) => {
    let usernameInput = req.body.usernameuser
    let passwordInput = req.body.passworduser
    let ggwpinput = req.body.ggwp
    console.log('test', ggwpinput)
    //find หาusername password สำหรับ 
    Userroom.find({
        usernameuser: usernameInput,
        passworduser: passwordInput
    }).then((user) => {
        if (user.length == 1) {
            Building.find({
                BuildingName: user[0].BuildingNameuser
            }).then((doc) => {
                console.log('data', user[0].BuildingNameuser)
                res.render('homeuser.hbs', {
                    phoneNumber: usernameInput,
                    BuildingName: user[0].BuildingNameuser,
                    doc: encodeURI(JSON.stringify(doc))
                })
            })
            //res.send(admin[0])
        } else if (user.length == 0) {
            res.status(400).send('sory not found is user')

        }
    }, (err) => {
        res.status(400).send(err)
    })
})
app.get('/getbuilduser/:BuildingName', (req, res) => {
    // console.log( req.params.BuildingName)
    meterbuild.find({
        buildingnamemeter: req.params.BuildingName
    }).then((doc) => {
        res.send(doc)
        //console.log(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})
//====================ฝั่ง user ของหอพัก=================



app.listen(process.env.PORT || 3000, () => {
    console.log('listen on port 3000')
})