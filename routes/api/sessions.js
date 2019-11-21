const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const Student = require('../../models/Student');


//Professor Model
const Session = require('../../models/Sessions');

const cookieConfig = {
    //httpOnly: true, // to disable accessing cookie via client side js
    secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    // signed: true // if you use the secret with cookieParser
};

// @route   GET api/sessions
// @desc    Get a session
// @access  Public
router.get('/', (req, res) => {
    Session.find({ pid: req.body.pid }, function (err, result) {
        if (err) throw err;
        res.json(result);
    })

});

router.get('/AllSessions', (req, res) => {
    Session.find({ pid: req.body.pid }, function (err, result) {
        if (err) { // Internal Error
            //callback(err);
            res.status(err.status).send({ success: false });
            return;
        }
        else if (result && result.pid === req.body.pid) { // Found Sessions
            console.log(result);
            res.json(result);
        }
        else {
            console.log(result);
            res.status(404).json(result);
        }
    })

});

// If Session not found
// res.send({ success: false });

// Set a cookie example
// res.cookie('sesid', result.sesid);

// Remove a cookie
//  res.clearCookie("sesid");

// Get a Cookie
// req.cookies['cookieName']
// res.clearCookie("cookie-name");
router.post('/JoinSession', (req, res) => {

    var student = req.cookies['sid'];
    console.log(student);
    console.log('Result Cookie:', res.cookies);
    if (student === 'undefined' || student === null) { // New Student
        newStudent = new Student({});
        res.cookie('sid', newStudent.sid);
        console.log("NEW STUDENT");
    }
    else { // Find Student in DB
        Student.findOne({ sid: student.sid }, function (err, result) {
            if (err) { // Internal Error
                callback(err);
                res.status(err.status);
                return;
            }
            else if (result && result != []) { // Found existing student
                //res.status(302).json(result);
                student = result;
                console.log("EXISTING STUDENT", result);

            }
            else { // No student exists, make a new one
                newStudent = new Student({});
                res.cookie('sid', newStudent.sid);
                //res.json(newStudent);
                //res.status(404).json({ success: false });
            }
        })
    }

    // store student's id in cookie
    // res.cookie('sid', student.sid);

    console.log(student.sid);
    // Find Session asked to join
    //res.send(req.body.sesid);
    Session.findOne({ sesid: req.body.sesid }, function (err, result) {
        //res.send(result);
        if (err) { // Internal Error
            //callback(err);
            res.status(err.status).send({ success: false });
            return;
        }
        else if (result && result.sesid === req.body.sesid) { // Found Session
            student.currentSesID = result.sesid;
            res.cookie('sesid', result.sesid);
            res.send({ success: true });
            console.log(result);
        }
        else { // Did not find Session
            console.log('DID NOT FIND SESSION');
            res.status(404).send({ success: false, response: 'DID NOT FIND SESSION' });
            console.log(result);
        }
        //res.json(result);

    })

});

// @route   POST api/sessions
// @desc    Create a session
// @access  Private localhost:3000 (front-end)
router.post('/', (req, res) => {
    console.log(`Received POST request for course: ${req.body.courseCode}`)
    const newSession = new Session({
        courseCode: req.body.courseCode,
        pid: req.body.pid
    });


    newSession.save().then(sessions => res.json(sessions))
});


// To Do: Currently not working
// @route   DELETE api/sessions/:sesid
// @desc    Delete a session
// @access  Public (Should be private in real production)
router.delete('/', (req, res) => {

    Session.findOne({ sesid: req.body.sesid }, function (err, result) {
        if (err) res.status(404).json({ success: false });
        result => result.remove().then(() => res.json({ success: true }))
            .catch(err => res.status(404).json({ success: false }));
    })

});

module.exports = router;