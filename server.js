const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')

const professor = require('./routes/api/professor');
const sessions = require('./routes/api/sessions');
const student = require('./routes/api/student');
const records = require('./routes/api/records');
var cors = require('cors')

const cookieParser = require('cookie-parser');



var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
// Creating Websocket Server
const server = require('http').createServer(app);
// Getting the websocket server
const io = require('socket.io')(server);

// socket related events
//const socketOps = require('./socketOps')
//socketOps.allSocketOps(io)


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
app.use('/api/records', records);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server started on port ${port}`));

// On port 5000, listen for clients. Calling it porty due to port alrdy being used
//const socketPort = 5001;
//io.listen(socketPort);
//console.log('listening to ghgh on port ', port);


// After connection, send events to client
// For now, just sending the msg that we have connected

var sequenceNumberByClient = new Map();

// Server saying connection
// Server Socket = io
// When a client connects to server
// Takes in socket clients 
io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);

    // If that client disconnects, do this
    // Client socket = socket
    socket.on('disconnect', () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
    //const myParameters = { "newCode": "54321" };
    //socket.emit('someEvent', myParameters);
    //console.log(myParameters);

    //Socket on "newCodeToServer"  is a function u can specify
    // on is for client communicating (mostly) to Client/Server -> Current, (Do something on the basis of something)
    // on recieve a msg 
    // Emit -> send a msg
    // We create functions/events is a function which

    // Recieves the data from clients
    socket.on("newCodeToServer", (JsonParameters) => {
        //this.codeBox.value = JsonParameters.newCode;
        //const myParameters = { "newCode": "54321" };
        console.log(JsonParameters.socketID);
        //emits that data to some event in front end
        //Gets all sockets that have connected, and then sends that data to the specif prof  
        io.sockets.connected[JsonParameters.socketID].emit('someEvent', JsonParameters);
        console.log("SOCKET FUNCTION WENT THROUGH TO SERVER");
    });


});





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

