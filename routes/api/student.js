const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
//Student Model
const Student = require('../../models/Student');

const uuidv4 = require('uuid/v4');
const Session = require('../../models/Sessions');

// @route   GET api/student
// @desc    Get a student
// @access  Public
router.get('/', (req, res) => {
    Student.findOne({ sid: req.body.sid }, function (err, result) {
        if (err) throw err;
        res.json(result);
    })

});


// @route   POST api/student
// @desc    Register a new student
// @access  Public (Should be private in real production)
router.post('/', (req, res) => {
    const newStudent = new Student({
    });
    if (req.cookies.sid != '' && req.cookies.sid != null) {
        newStudent.sid = req.cookies.sid;
        // res.status(200).json(req.cookies.sid);
    }
    else {
        newStudent.sid = uuidv4();
        res.cookie("sid", newStudent.sid);
        // res.status(200).json(req.cookies.sid);
    }
    Session.findOne({ sesid: req.body.sesid }, function (err, result) {
        if (err) res.status(400)
        if (result != null) {
            newStudent.sesid = req.sesid
            res.status(200).send('Session found')
        }
        else {
            res.status(404).json('Error: ' + 'Session not found')
        }
    })

    newStudent.save();
});

// To Do: Currently not working
// @route   DELETE api/student/:sid
// @desc    Delete a student
// @access  Public (Should be private in real production)


module.exports = router;