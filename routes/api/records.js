const express = require('express');
const router = express.Router();
const io = require('socket.io-client');
const constantModule = require('../../config/constants');

//Records Model
const Record = require('../../models/Records');

let socket;
if (!socket) {
    socket = io(constantModule.PublicURL + ':' + '5001');
}

// @route   GET api/records
// @desc    Get ALL records given criterias
// @access  Public
router.get('/', (req, res) => {
    Record.find()
        .sort({ date: -1 })
        .then(records => res.json(records))
});

// @route   POST api/records
// @desc    Create a record
// @access  Public
router.post('/', (req, res) => {
    // TO DO: New comment 
    if (req.body.isComment != undefined && req.body.isComment != null && req.body.isComment == "true") {
        const newRecord = new Record({
            studentID: req.body.studentID,
            sessionID: req.body.sessionID,
            value: 0,
            old_value: 0,
            comment: req.body.comment

        });
        const myParameters = { "comment": req.body.comment, "sid": req.body.studentID, sesid: req.body.sessionID, "Time": "10:50", "socketID": "" };

        // Websocket Cleint 
        // which sends the data to the websocket server --> in server. 
        socket.emit('newCommentToServer', myParameters);
        console.log(5);
        console.log(myParameters);
        newRecord.save();
        res.json(myParameters);

        //newRecord.save().then(record => console.log(record) ).catch(error => console.log(error));
    }
    // New rating
    else {
        const newRecord = new Record({
            studentID: req.body.studentID,
            sessionID: req.body.sessionID,
            value: req.body.value,
            old_value: req.body.old_value
        });
        const myParameters = { "sid": req.body.studentID, sesid: req.body.sessionID, "Time": "10:50", "rating": req.body.value, "socketID": "" };

        // Websocket Cleint 
        // which sends the data to the websocket server --> in server. 
        socket.emit('newCodeToServer', myParameters);
        console.log(5);
        console.log(myParameters);

        newRecord.save().then(record => res.json(record));
    }


});



module.exports = router;
