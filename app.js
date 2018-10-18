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
        floor: req.body.myData.floor,
        adminAllow: req.body.myData.adminAllow,
        BuildingName: req.body.myData.BuildingName,
        UnitMeter: req.body.myData.UnitMeter,
        BuildingPhone: req.body.myData.BuildingPhone,
        BuildingEmail: req.body.myData.BuildingEmail,
    })
    newBuilding.save().then((d) => {

        res.send('###############')
        res.send(d)
    }, (e) => {
        console.log(req.body)
        res.send('ERROR ')
        res.status(400).send(e)
    })

})
app.post('/getHome', (req, res) => {
    let nameBuildInput = req.body.BuildingName
    //find หาusername password สำหรับ 
    Building.find({
        BuildingName: req.body.BuildingName
    }).then((build) => {
        if (build.length == 1) {
            res.render('home.hbs', {
                build: encodeURI(JSON.stringify(build))
            })
            //res.send(admin[0])
        } else if (build.length == 0) {
            res.status(400).send('Fail !!!')
        }
    }, (err) => {
        res.send('###########')
        res.status(400).send(err)
        res.send(nameBuildInput)
        res.send('###########')

    })
})



app.listen(3000, () => {
    console.log('listen on port 3000')
})