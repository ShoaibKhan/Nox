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
    res.clearCookie("sid")

    //  newStudent.save();
});

// To Do: Currently not working
// @route   DELETE api/student/:sid
// @desc    Delete a student
// @access  Public (Should be private in real production)


module.exports = router;