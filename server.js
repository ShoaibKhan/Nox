const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')
var path = require('path');
//import data from "./general_client/src/views/DashBoard";
const professor = require('./routes/api/professor');
const sessions = require('./routes/api/sessions');
const student = require('./routes/api/student');
const records = require('./routes/api/records');
//const shibboleth = require('./routes/api/shibboleth');
var passport = require('passport');

var cors = require('cors');
var SamlStrategy = require('passport-saml').Strategy;
const cookieParser = require('cookie-parser');

var fs    = require ('fs'); // certificates

var sesidToStudentHashmap = {};  // Contains: Sesid, StudentHashMap, DataHashmap, Time the session was created
var sesidToDataHashmap = {}; // Contais: Sesid (F.K), Total students, Good , Okay, Consfused students
//var studentHashmap = {}; // Contains: Sesid (F.K), sid, Rating, Time 

var corsOptions = {
    origin: ['https://csc398dev.utm.utoronto.ca','https://idpz.utorauth.utoronto.ca'],//:3000 before
    credentials: true
}

//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// Axios.listen() 
const app = express();
// Creating Websocket Server
const server = require('https').createServer({ //change to https for ssl
    key: fs.readFileSync('utmwild.key'),
    cert: fs.readFileSync('__utm_utoronto_ca_cert.cer'),
    ca:[ fs.readFileSync('__utm_utoronto_ca_interm.cer')
]// ca belongs here
},app);
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
//app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.json()) // for parsing application/json
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));

//Use Routes
app.use('/nox/api/professor', professor);
app.use('/nox/api/sessions', sessions);
app.use('/nox/api/student', student);
app.use('/nox/api/records', records);
//app.use(passport.initialize());
//app.use(passport.session());

app.get('/nox/professor',function (req, res) {
    //res.send ('<h2>Hello Cruel World</h2>');
    var utorid = req.query.utorid;
    console.log('authenticating..');
     if(req.headers.utorid == 'chaud439'){ //valid
	console.log(req.headers.utorid, ' Logged into professor view');
	res.sendFile(path.resolve(__dirname,'general_client','build','index.html'))
	}
     else{ //invalid authentication
        console.log(req.headers.utorid, ' Not allowed to login to professor view');
	res.redirect('/nox');
	}
});


app.use(express.static('general_client/build'));

//app.post('/nox/professor',
//    bodyParser.urlencoded({ extended: false }),
//    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
//    function (req, res) {
//        console.log(res);
//        res.redirect('/');
//    }
//);

//app.get('/nox/professor',
//  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
//   function(req, res) {
//   res.send({ 'success': true });
//   console.log('authenticating....');
//   console.log(res);
//   res.redirect('/');
//  }
//);

//app.post('/Shibboleth.sso/SAML2/POST',
//function(req,res){
//console.log('dealing with shibboleth POST');
//});
app.get(('*'),(req,res) => {
    res.sendFile(path.resolve(__dirname,'general_client','build','index.html'))
});


//passport.use('saml',new SamlStrategy(
//    {
//        path: '/professor',
//	entryPoint: 'https://idpz.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO',//'https://idpz.utorauth.utoronto.ca/shibboleth',
//        issuer: 'https://sp.csc398dev.utm.utoronto.ca/shibboleth', //sp.csc398....?
//        privateCert: fs.readFileSync('sp-key.pem', 'utf-8'), //need utf-8?
//        cert: fs.readFileSync('sp-cert.pem'),
//       validateInResponseTo: false,
//	decryptionPvK: fs.readFileSync('utorauth_metadata_verify.crt'), 
//	relayState: 'ss:mem'
        //privateCert: private key? sp-key.pem, cert: issuer's? sp-cert.pem , what else?
//    },
//    function (profile, done) {
//        findByEmail(profile.email, function (err, user) {
//            if (err) {
//		console.log('error authenticating');
//                return done(err);
//            }
//	    console.log("authenticated userrr");
//            return done(null, user);
//        });
//    })
//);

//These functions are called to serialize the user
//to session state and reconsitute the user on the 
//next request. Normally, you'd save only the netID
//and read the full user profile from your database
//during deserializeUser, but for this example, we
//will save the entire user just to keep it simple


const port = process.env.PORT || 5001;
//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
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
