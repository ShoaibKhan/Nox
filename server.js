const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')
var path = require('path');
const professor = require('./routes/api/professor');
const sessions = require('./routes/api/sessions');
const student = require('./routes/api/student');
const records = require('./routes/api/records');
const Professor = require('./models/Professor');
var fs = require('fs');
var cors = require('cors');
const cookieParser = require('cookie-parser');

// In production or development?
const environment = process.env.NODE_ENV || 'development';

var sesidToStudentHashmap = {};  // Contains: Sesid, StudentHashMap, DataHashmap, Time the session was created
var sesidToDataHashmap = {}; // Contains: Sesid (F.K), Total students, Good , Okay, Consfused students
//var studentHashmap = {}; // Contains: Sesid (F.K), sid, Rating, Time 

// Sites allowed to use Server's API
var corsOptions = {
    origin: (environment == 'development') ? 'http://localhost:3000' : ['https://csc398dev.utm.utoronto.ca', 'https://idpz.utorauth.utoronto.ca'],
    credentials: true
}

// HTTPS only in production
const http = (environment == 'development') ? require('http') : require('https');

// Creating an express Server with SSL certificates in production
const app = express();
const server = http.createServer({
    key: environment == "development" ? "" : fs.readFileSync('utmwild.key'),
    cert: environment == "development" ? "" : fs.readFileSync('__utm_utoronto_ca_cert.cer'),
    ca: environment == "development" ? "" : fs.readFileSync('__utm_utoronto_ca_interm.cer'),
}, app);
// Getting the websocket server
const io = require('socket.io')(server);

app.use(cors(corsOptions))

// Cookies
app.use(cookieParser());

//Bodyparser Middleware
app.use(bodyParser.json());

//app.use(passport.initialize());
//app.use(passport.session());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));

// Create paths for each API (routes)
app.use('/nox/api/professor', professor);
app.use('/nox/api/sessions', sessions);
app.use('/nox/api/student', student);
app.use('/nox/api/records', records);


// Authentication required 
// if URL path is under /professor 
app.get('/nox/professor', function (req, res) {
    console.log('Authenticating Professor... ');

    // Allow access in development enviroment 
    // Otherwise check if Professor exists in DB
    Professor.findOne({ pid: req.headers.utorid }, function (err, result) {
        if (err) { // Internal Error
            console.log(err);
            throw (err);
        }
        else if ((result != undefined && result.pid != undefined && result.pid == req.headers.utorid) || req.headers.utorid == undefined && environment == 'development') {
            console.log(req.headers.utorid || 'Development User', ' Logged Into Professor View');
            res.cookie('pid', req.headers.utorid, { path: '/nox/professor', secure: true }).sendFile(path.resolve(__dirname, 'general_client', 'build', 'index.html'))
            return;

        }
        else { // Not allowed entry
            console.log(req.headers.utorid, ' Not allowed to login to professor view');
            res.send('You are not authorized as a Professor. Contact achaudhral629@gmail.com to request access.');
        }
    });


});

// Connect React.js build folder made by $npm run build 
// in general_client folder
app.use(express.static('general_client/build'));

// Every other URL will be sent to the Front-End
app.get(('*'), (req, res) => {
    res.sendFile(path.resolve(__dirname, 'general_client', 'build', 'index.html'))
});

const port = process.env.PORT || 5001;
server.listen(port, () => console.log(`Server started on port ${port}`));

var sequenceNumberByClient = new Map();


// Everything below is dealing with Sockets from server to Professor
// Read up on how sockets work here: https://socket.io/get-started/chat/
io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);


    // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);
    var profID;
    // If that client disconnects, do this
    // Client socket = socket
    socket.on('disconnect', () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
    socket.on("proffesorSocket", (JsonParameters) => {
        console.log("Recieved Prof's socket data", JsonParameters);
        // Session does not exist in hashtable then make it
        if (sesidToDataHashmap[JsonParameters.sesid] == undefined || sesidToDataHashmap[JsonParameters.sesid] == null) {
            sesidToDataHashmap[JsonParameters.sesid] = {
                goodStudents: 0,
                okayStudents: 0,
                confusedStudents: 0,
                totalStudents: 0,
                socketID: null
            }
        }
        // Add socketID into existing session of hashtable
        sesidToDataHashmap[JsonParameters.sesid].socketID = JsonParameters.socketID;
        console.log('THIS is profs socket id: ', sesidToDataHashmap[JsonParameters.sesid]);
    });

    var returnJSON = NumberOfStudentsCalculation
    socket.on("newCommentToServer", (studentJson) => {

        //potential problem
        if (sesidToDataHashmap[studentJson.sesid].socketID != null &&
            sesidToDataHashmap[studentJson.sesid].socketID != undefined &&
            io.sockets.connected[sesidToDataHashmap[studentJson.sesid].socketID] != undefined &&
            io.sockets.connected[sesidToDataHashmap[studentJson.sesid].socketID] != null) {

            io.sockets.connected[sesidToDataHashmap[studentJson.sesid].socketID].emit("incomingComment", studentJson);

        }
    });
    socket.on("newCodeToServer", (myParameters) => {
        console.log(myParameters.socketID);
        var returnJSON = NumberOfStudentsCalculation(myParameters);
        console.log("sessions data is..... ", sesidToDataHashmap[myParameters.sesid]);
        //io.sockets.emit("Data", returnJSON);

        // Ensure Profs Socket exists before emitting
        if (sesidToDataHashmap[myParameters.sesid].socketID != null &&
            sesidToDataHashmap[myParameters.sesid].socketID != undefined &&
            io.sockets.connected[sesidToDataHashmap[myParameters.sesid].socketID] != undefined &&
            io.sockets.connected[sesidToDataHashmap[myParameters.sesid].socketID] != null) {

            io.sockets.connected[sesidToDataHashmap[myParameters.sesid].socketID].emit("Data", returnJSON);
        }
    });
});
function NumberOfStudentsCalculation(JsonParameters) {
    // Not an existing user
    // TO DO: check undefined and null

    // Initializing session table for new session in student hashmap
    if (sesidToStudentHashmap[JsonParameters.sesid] == undefined || sesidToStudentHashmap[JsonParameters.sesid] == null) {
        sesidToStudentHashmap[JsonParameters.sesid] = {};
    }
    // Initializing an empty student table for new students
    if (sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid] == undefined || sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid] == null) {
        sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid] = {
            rating: undefined,
            time: undefined,
            oldrating: null
        };
    }
    // Initializing session table for new session in session hashmap
    if (sesidToDataHashmap[JsonParameters.sesid] == undefined || sesidToDataHashmap[JsonParameters.sesid] == null) {
        sesidToDataHashmap[JsonParameters.sesid] = {
            goodStudents: 0,
            okayStudents: 0,
            confusedStudents: 0,
            totalStudents: 0,
            socketID: null

        }
    }
    // step 2
    if (sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].rating != null && sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].rating != undefined) {
        // Student is confused
        if (sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].rating == 1) {
            sesidToDataHashmap[JsonParameters.sesid].confusedStudents -= 1
        }
        // Student is understanding okay
        if (sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].rating == 2) {
            sesidToDataHashmap[JsonParameters.sesid].okayStudents -= 1
        }
        // Student is understanding well
        if (sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].rating == 3) {
            sesidToDataHashmap[JsonParameters.sesid].goodStudents -= 1
        }
    }
    //3-5
    sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].oldrating = sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].rating
    sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].rating = JsonParameters.rating
    sesidToStudentHashmap[JsonParameters.sesid][JsonParameters.sid].time = JsonParameters.time


    //Existing User
    if (JsonParameters.rating != null && JsonParameters.rating != undefined) {
        // If the student is feeling lost
        if (JsonParameters.rating == 1) {
            sesidToDataHashmap[JsonParameters.sesid].confusedStudents += 1
        }
        // Student is feeling okay
        if (JsonParameters.rating == 2) {
            sesidToDataHashmap[JsonParameters.sesid].okayStudents += 1
        }
        // Student is understanding well
        if (JsonParameters.rating == 3) {
            sesidToDataHashmap[JsonParameters.sesid].goodStudents += 1
        }
    }
    // Adding all the student totals
    sesidToDataHashmap[JsonParameters.sesid].totalStudents =
        + sesidToDataHashmap[JsonParameters.sesid].goodStudents
        + sesidToDataHashmap[JsonParameters.sesid].okayStudents
        + sesidToDataHashmap[JsonParameters.sesid].confusedStudents;

    // Calcluating Avrg
    average_rating = ((sesidToDataHashmap[JsonParameters.sesid].goodStudents) * 3 + (sesidToDataHashmap[JsonParameters.sesid].okayStudents) * 2 + (sesidToDataHashmap[JsonParameters.sesid].confusedStudents) * 1) / (sesidToDataHashmap[JsonParameters.sesid].totalStudents)

    // Calculate RGB corresponding to avg
    var avgRGB = '';
    if (average_rating >= 2.25) { // good
        avgRGB = 'rgba(0,255,0,0.3)';
    }
    else if (average_rating <= 1.75) { // confused
        avgRGB = 'rgba(255,0,0,0.3)';
    }
    else { //okay
        avgRGB = 'rgba(255,255,0,0.3)';
    }

    // Create JSON to return
    var studentCount = {
        goodStudents: sesidToDataHashmap[JsonParameters.sesid].goodStudents,
        okayStudents: sesidToDataHashmap[JsonParameters.sesid].okayStudents,
        confusedStudents: sesidToDataHashmap[JsonParameters.sesid].confusedStudents,
        average_rating: average_rating,
        avgRGB: avgRGB

    };

    return studentCount;
}
