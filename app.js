const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

mongoose.set('strictQuery', false);

const mongoUri = process.env.MONGO_URI;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;

mongoose.connect(mongoUri, {
    user: mongoUsername,
    pass: mongoPassword,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err) {
    if (err) {
        console.log("error!! " + err)
    } else {
      //  console.log("MongoDB Connection Successful")
    }
})

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);

// Mock data for testing/fallback
const mockPlanets = [
    { id: 0, name: 'Sun', description: 'The Sun is the star at the center of the Solar System', image: 'sun.png', velocity: '0 km/s', distance: '0 km' },
    { id: 1, name: 'Mercury', description: 'Mercury is the smallest planet in the Solar System', image: 'mercury.png', velocity: '47.87 km/s', distance: '57.9 million km' },
    { id: 2, name: 'Venus', description: 'Venus is the second planet from the Sun', image: 'venus.png', velocity: '35.02 km/s', distance: '108.2 million km' },
    { id: 3, name: 'Earth', description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life', image: 'earth.png', velocity: '29.78 km/s', distance: '149.6 million km' },
    { id: 4, name: 'Mars', description: 'Mars is the fourth planet from the Sun', image: 'mars.png', velocity: '24.07 km/s', distance: '227.9 million km' },
    { id: 5, name: 'Jupiter', description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System', image: 'jupiter.png', velocity: '13.07 km/s', distance: '778.5 million km' },
    { id: 6, name: 'Saturn', description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System', image: 'saturn.png', velocity: '9.69 km/s', distance: '1.434 billion km' },
    { id: 7, name: 'Uranus', description: 'Uranus is the seventh planet from the Sun', image: 'uranus.png', velocity: '6.81 km/s', distance: '2.871 billion km' },
    { id: 8, name: 'Neptune', description: 'Neptune is the eighth and farthest known planet from the Sun', image: 'neptune.png', velocity: '5.43 km/s', distance: '4.495 billion km' }
];

app.post('/planet',   function(req, res) {
   // console.log("Received Planet ID " + req.body.id)
    planetModel.findOne({
        id: req.body.id
    }, function(err, planetData) {
        if (err) {
            res.status(500).send("Error in Planet Data")
        } else if (!planetData) {
            // Use mock data if database returns null
            const mockPlanet = mockPlanets.find(p => p.id === req.body.id);
            res.send(mockPlanet || {});
        } else {
            res.send(planetData);
        }
    })
})

app.get('/',   async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});


app.get('/os',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
})

app.get('/live',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
})

app.get('/ready',   function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
})

app.listen(3000, () => {
    console.log("Server successfully running on port - " +3000);
})


module.exports = app;