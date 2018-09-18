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

app.get('/', (req, res) => {
    res.send('hello')
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