const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')

const professor = require('./routes/api/professor');
const sessions = require('./routes/api/sessions');
const student = require('./routes/api/student');
var cors = require('cors')

const cookieParser = require('cookie-parser');
//const io = require('socket.io')(server)


var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();


// socket related events
//const socketOps = require('./socketOps')
//socketOps.allSocketOps(io)

//app.use(function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
//});

//app.options("*", cors(corsOptions))


// Cookies
app.use(cookieParser());

app.use(cors(corsOptions))

//Bodyparser Middleware
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));

//Use Routes
app.use('/api/professor', professor);
app.use('/api/sessions', sessions);
app.use('/api/student', student);



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

// After connection, send events to client
// For now, just sending the msg that we have connected
//io.on('connection', () => { console.log("I've connected") });

// On port 5000, listen for clients. Calling it porty due to port alrdy being used
//const port = 5000;
//io.listen(port);
console.log('listening to boss Nox on port ', port);
// NOTES:
// GET request has all the data in the URL
// POST request has all the data in the body, node.js
// typically just converts this to JSON for you
// POST Request should have info i.e sid, rating, rating, 
// timerating, etc 

// Buffer (works like a Queue)
//asd

// Contains a bunch of API calls

// Professor should have a websocket and 
// clients should not need a websocket, just open
// and close their conncetions/requests
// i.e when a student presses a button, open 
// connection, do the API call, and then close
// the connection

// observers (professors) and observables 

// in production, the default port should be 80

