const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const {Admin} = require('./model/AdminSchema')
const {Building} = require('./model/BuildingSchema')


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost/serDB')
  .then(() =>  console.log('@@@ Connection db is succes @@@'))
  .catch((err) => console.error('!!! Fail to connect db !!!'));

var app = express()


app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('helloo')
})
app.post('/testPost', (req, res) => {
    res.send('helloo')
})

app.post('/postAdmin', (req, res ) => {
    let newAdmin = new Admin({
        username: req.body.username,
        password: req.body.password
    })
    newAdmin.save().then((d) => {
        res.send(d)
    }, (e) => {
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
app.get('/getAdminn', (req, res) => {
    let usernameInput = req.headers['username']
    let passwordInput = req.headers['password']
    //find หาusername password สำหรับ login
    Admin.find({
        username: usernameInput,
        password: passwordInput
    }).then((Admin) => {
        if (Admin.length == 1) {
            res.send(Admin[0])
        } else if (Admin.length == 0) {
            res.status(404).send('sory not found is user')
        }
    }, (err) => {
        res.status(404).send(err)
    })
})

app.post('/postBuilding', (req, res ) => {
    let newBuilding = new Building({
        floor: req.body.floor,
        adminAllow: req.body.adminAllow
    })
    newBuilding.save().then((d) => {
        res.send(d)
    }, (e) => {
        res.status(400).send(e)
    })
})



app.listen(3000, () => {
    console.log('listen on port 3000')
})