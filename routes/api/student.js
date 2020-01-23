const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const Student = require('../../models/Student');
const io = require('socket.io-client');
const constantModule = require('../../config/constants');
const uuidv4 = require('uuid/v4');
const Session = require('../../models/Sessions');
const cors = require('cors')

// Establish socket connection
let socket;
if (!socket) {
    socket = io(constantModule.PublicURL + ':' + '5001');
}

// @route   POST api/student
// @desc    Register a new student
// @access  Public (Should be private in real production)
router.post('/', (req, res) => {
    const newStudent = new Student({
    });
    //clearCookie("sid");
    res.status(200).json({ success: true })

    // Sending hardcoded data to test if it gets displayed on graph. 
    //const myParameters = { "sid": req.body.sid, sesid: "qwerty", "Time": "10:50", "rating": req.body.rating, "socketID": req.body.socketID };

    // Websocket Cleint 
    // which sends the data to the websocket server --> in server. 
    //socket.emit('newCodeToServer', myParameters);
    // console.log(5);
    //console.log(myParameters);

    //  newStudent.save();
});

// To Do: Currently not working
// @route   DELETE api/student/:sid
// @desc    Delete a student
// @access  Public (Should be private in real production)


module.exports = router;
