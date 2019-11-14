const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
//Student Model
const Student = require('../../models/Student');

const uuidv4 = require('uuid/v4');
const Session = require('../../models/Sessions');
const cors = require('cors')

var corsOptions = {
    origin: 'http://localhost:3000/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


// @route   GET api/student
// @desc    Get a student
// @access  Public
router.get('/', (req, res) => {
    Student.findOne({ sid: req.body.sid }, function (err, result) {
        if (err) throw err;
        res.json(result);
    })
    res.json({ success: true });

});


// @route   POST api/student
// @desc    Register a new student
// @access  Public (Should be private in real production)
router.post('/', (req, res) => {
    //const newStudent = new Student({
    //});
    //clearCookie("sid");
    res.status(200).json({ success: true })


    //  newStudent.save();
});

// To Do: Currently not working
// @route   DELETE api/student/:sid
// @desc    Delete a student
// @access  Public (Should be private in real production)


module.exports = router;