const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbs = require('hbs')
var path = require('path');

const { Admin } = require('./model/AdminSchema')
const { Building } = require('./model/BuildingSchema')


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

app.get('/', (req, res) => {
    res.send('hello')
})
app.get('/test', (req, res) => {
    res.render('test.hbs')
})
app.post('/createbuilding', (req, res) => {
    res.render('createbuild.hbs', {
        username: req.body.username
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
            res.render('homebuild.hbs', {
                username: usernameInput
            })
            //res.send(admin[0])
        } else if (admin.length == 0) {
            res.status(400).send('sory not found is user')
        }
    }, (err) => {
        res.status(400).send(err)
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
    res.send('ERROR DFKFDKF',newBuilding)
    // newBuilding.save().then((d) => {
    //     res.send(d)
    // }, (e) => {
    //     console.log(e)
    //     res.send('ERROR DFKFDKF',myData)
    //     res.status(400).send(e)
    // })
    
    // newBuilding.save().then((d) => {
    //     console.log('you is tttttttt is:',d)
    //     res.send(d)
    // }, (e) => {
    //     console.log('you have pop is :',d)
    //     res.status(400).send(e) 
    //     res.render('error.hbs')
    // })
})



app.listen(3000, () => {
    console.log('listen on port 3000')
})