const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')
//import data from "./general_client/src/views/DashBoard";
const professor = require('./routes/api/professor');
const sessions = require('./routes/api/sessions');
const student = require('./routes/api/student');
const records = require('./routes/api/records');
var cors = require('cors')

const cookieParser = require('cookie-parser');

var sesidToStudentHashmap = {};
var sesidToDataHashmap = {};


var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
Axios.listen() 
const app = express();
// Creating Websocket Server
const server = require('http').createServer(app);
// Getting the websocket server
const io = require('socket.io')(server);

// socket related events
//const socketOps = require('./socketOps')
//socketOps.allSocketOps(io)
//app.options("*", cors(corsOptions))

app.use(cors(corsOptions))

// Cookies
app.use(cookieParser());

//Bodyparser Middleware
app.use(bodyParser.json());
//app.use(express.json()) // for parsing application/json
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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
    //socket.emit('', myParameters);
    //console.log(myParameters);

    //Socket on "newCodeToServer"  is a function u can specify
    // on is for client communicating (mostly) to Client/Server -> Current, (Do something on the basis of something)
    // on recieve a msg 
    // Emit -> send a msg
    // We create functions/events is a function which

    // Recieves the data from clients
    // We assume that the data incoming would be the following:
    // SessionID, StudentID, Time, and the Rating

    socket.on("newCodeToServer", (JsonParameters) => {

        /*
        // Existing student
        if (studentHashmap[JsonParameters.sid][JsonParameters.sid] != undefined || studentHashmap[JsonParameters.sid] != null) {
            sid: JsonParameters.sid
            rating: JsonParameters.rating,
            time: JsonParameters.time,
            oldrating: sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].rating
        }
        */

        // new student for that session
        studentHashmap = {
            sid:JsonParameters.sid,
            sesid:JsonParameters.sessid,
            rating: JsonParameters.rating,
            time: JsonParameters.time,
            oldrating: null
        }

        // Updating the state of the Hashmap
        function NumberOfStudentsCalculation (sid,sesid,rating,oldrating,time){
            // Student is Confused
            if (rating == 1) {
                sesidToDataHashmap[sesid][confusedStudents] += 1
            }
            // Student is understanding okay
            if (rating == 2){
                sesidToDataHashmap[sesid][OkayStudents] += 1
            }
            // Student is understanding well
            if (rating == 3){
                sesidToDataHashmap[sesid][goodStudents] += 1
            }
        }

        // example data for a sesid
        // sesidToDataHashmap[1022]

        // get data for a session
        var datatb = sesidToDataHashmap[JsonParameters.sesid]

        // simplify calling totalStudents
        hashtb[totalStudents]

        // Count totalStudents for a session
        sesidToDataHashmap[JsonParameters.sesid][totalStudents]

        // Add 1 to totalStudents for a session
        sesidToDataHashmap[JsonParameters.sesid][totalStudents] += 1

        // Add a student to a specific sesid
        sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid] = studentHashmap

        // Add a student to a specific sesid
        sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid] = { rating: 1, time: '10:01', oldrating: 2 }

        //Access a student to a specific sesid
        sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid]


        var sesidToDataHashmapExample = {
            // sesid
            1022: {
                goodStudents: 0,
                okayStudents: 0,
                confusedStudents: 0,
                totalStudents: 0

            },
            1044: {
                goodStudents: 0,
                okayStudents: 0,
                confusedStudents: 0
            }
        }

        var sesidToStudentHashmapExample = {
            // sesid
            1022: {
                // sid for that sesid
                0001: {
                    rating: 2,
                    time: '20:01',
                    oldrating: null

                },
                0002: {
                    rating: 1,
                    time: '10:01',
                    oldrating: 2
                },
                0003: {
                    rating: 1,
                    time: '15:01',
                    oldrating: null
                }

            },
            1233: {
                005: {
                    rating: 1,
                    time: '15:01',
                    oldrating: null

                },
                006: {
                    rating: 1,
                    time: '15:01',
                    oldrating: 2
                },
                007: {
                    rating: 1,
                    time: '15:01',
                    oldrating: null
                }

            }
        }

        // Sending the data to the server, after all calculations have been stored
        // inside of the Hashmap
        console.log(JsonParameters.socketID);
        function sendData(JsonParameters.socketID){
        io.sockets.connected[JsonParameters.socketID].emit("", sesidToDataHashmap[JsonParameters.sesid][goodStudents] , sesidToDataHashmap[JsonParameters.sesid][okayStudents], 
        sesidToDataHashmap[JsonParameters.sesid][confusedStudents]);
        console.log("SOCKET FUNCTION WENT THROUGH TO SERVER");
        }; 
        /*
        this.codeBox.value = JsonParameters.newCode;
        const myParameters = { "newCode": "54321" };
        console.log(JsonParameters.socketID);
        sendData(sonParameters.socketID)
        //emits that data to event in front end
        //Gets all sockets that have connected, and then sends that data to the specif prof  
        io.sockets.connected[JsonParameters.socketID].emit(sendData(), JsonParameters);
        console.log("SOCKET FUNCTION WENT THROUGH TO SERVER");
        */
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

