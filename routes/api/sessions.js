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
        if (err) throw err;
        res.json(result);
    })

});

// Join A session
router.get('/JoinSession', (req, res) => {
    var student = req.cookies.sid;
    console.log(req.cookies);
    if (student === undefined) { // New Student
        student = new Student({});
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
                student = new Student({});

                //res.json(newStudent);
                //res.status(404).json({ success: false });
            }
        })
    }

    // store student's id in cookie
    res.cookie('sid', student.sid, cookieConfig);
    console.log(student.sid);
    // Find Session asked to join
    Session.findOne({ sesid: req.body.sesid }, function (err, result) {
        if (err) { // Internal Error
            //callback(err);
            res.status(err.status).json({ success: false });
            return;
        }
        else if (result && result.length > 0) { // Found Session
            student.currentSesID = result.sesid;
            res.cookie('sesid', result.sesid);
            res.status(302).json({ success: true });
            console.log(result);
        }
        else { // Did not find Session
            res.status(404).json({ success: false });
            console.log(result);
        }
        //res.json(result);

    })

});

// @route   POST api/sessions
// @desc    Create a session
// @access  Public (Should be private in real production)
router.post('/', (req, res) => {
    console.log(`Received POST request for course: ${req.body.courseCode}`)
    const newSession = new Session({
        courseCode: req.body.courseCode
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