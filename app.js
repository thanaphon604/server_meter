const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/DB').then(() => {
    console.log('db is created...')
}, () => {
    console.log('fail to create db!!!')
})

var user = mongoose.model('User', {
    personID: {
        type: String,
        maxlength: 13,
        minlength: 13,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        minlength: 3
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3
    },
    birthday: {
        type: String,
        required: true
    },
    sex: {
        type: Boolean,
        required: true
    },
    address: {
        type: String,
        required: true,
        minlength: 10
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10
    },
    dateCopy: {
        type: String,
        required: true
    },
})

var Room = mongoose.model('Room', {
    room_number: {
        type: String,
        required: true
    },
    floor_number: {
        type: String,
        required: true
    },
    personID: [{
        type: String,
        maxlength: 13,
        minlength: 13,

    }],
})
var app = express()
app.use(bodyParser.json())



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/postroom', (req, res) => {
    let obj = req.body.obj
    console.log('test'+obj)
    console.log(obj.length)
    for (let i = 0; i < obj.length; i++) {
        let newRoom = new Room({
            room_number: obj[i].room,
            floor_number: obj[i].floor
        })
        if (i == obj.length - 1 && i != 0) {
            newRoom.save().then(() => {
                res.send('is saved')
            }, (e) => {
                res.status(400).send(e)
            })
        } else {
            newRoom.save()
        }
    } 
})

app.get('/', (req, res) => {
    let obj = req.body.obj
    console.log(obj)
    res.send('api is created...')
})


app.post('/postUser', (req, res) => {
    let newUser = new user({
        personID: req.body.personID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday,
        sex: req.body.sex,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        dateCopy: req.body.dateCopy,
    })

    newUser.save().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    })
})

app.get('/getUser', (req, res) => {
    user.find().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})
app.get('/getRoom', (req, res) => {
    Room.find().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})

app.get('/getUser/men', (req, res) => {
    user.find({
        sex: true
    }).then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})

app.get('/getUser/girl', (req, res) => {
    user.find({
        sex: false
    }).then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})

app.get('/getUser/:room/:floor/:build', (req, res) => {
    user.find({
        room: req.params.room,
        floor: req.params.floor,
        build: req.params.build,
    }).then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(404).send(err)
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('listen on port 3000')
})
