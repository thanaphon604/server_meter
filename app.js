const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbs = require('hbs')
var path = require('path');

const { Admin } = require('./model/AdminSchema')
const { Building } = require('./model/BuildingSchema')
const { Userdelete } = require('./model/UserdeleteSchema')
const { meterbuild } = require('./model/MeterSchema')

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
    let newBuilding = new Building({
        floor: req.body.floor,
        adminAllow: req.body.adminAllow,
        BuildingName: req.body.BuildingName,
        UnitMeter: req.body.UnitMeter,
        BuildingPhone: req.body.BuildingPhone,
        BuildingEmail: req.body.BuildingEmail,
    })
    newBuilding.save().then((d) => {
        res.send(d)
    }, (e) => {
        console.log(e)
        res.status(400).send(e)
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
app.get('/Person', (req, res) => {
    res.render('personInput.hbs')
})
//run Home.hbs
app.get('/HOME', (req, res) => {
    res.render('home.hbs')
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
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let i = 0; i < build[0].floor.length; i++) {
                for (let j = 0; j < build[0].floor[i].room.length; j++) {
                    if (roomNumberInput == build[0].floor[i].room[j].roomNumber) {
                        build[0].floor[i].room[j].contract = contractInput

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
})

//post user 
app.post('/postUser', (req, res) => {
    let BuildingNameInput = req.body.BuildingName
    let roomNumberInput = req.body.roomNumber

    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let i = 0; i < build[0].floor.length; i++) {
                for (let j = 0; j < build[0].floor[i].room.length; j++) {
                    if (roomNumberInput == build[0].floor[i].room[j].roomNumber) {

                        build[0].floor[i].room[j].user.push({
                            personID: req.body.personID,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            birthday: req.body.birthday,
                            address: req.body.address,
                            phoneNumber: req.body.phoneNumber,
                            License: req.body.License
                        })

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
            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('sory not found is user')
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
                            if (personIDInput == build[0].floor[i].room[j].user[k].personID) {

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
//-------------------------------------หน้าที่ 6 ---------------------------------------------
//หน้าที่ 6 หน้า เเก้ไขunitmeter 
app.post('/postUUnitmeter', (req, res) => {

    let BuildingNameInput = req.body.BuildingName
    let UnitMeterInput = req.body.UnitMeter
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            build[0].UnitMeter = UnitMeterInput

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
//หน้าปรับปรุงห้องพัก
app.post('/postRoomUpdate', (req, res) => {
    let RoomUpdateInput = req.body.RoomUpdate
    let BuildingNameInput = req.body.BuildingName
    
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: BuildingNameInput,
    }).then((build) => {
        if (build.length == 1) {
            for (let i = 0; i < build[0].floor.length; i++) {
                for (let j = 0; j < build[0].floor[i].room.length; j++) {
                    if (RoomUpdateInput[j] == build[0].floor[i].room[j].roomNumber) {
                        build[0].floor[i].room[j].roomStatus = 'Update'

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




app.listen(3000, () => {
    console.log('listen on port 3000')
})