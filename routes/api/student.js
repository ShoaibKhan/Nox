const express = require('express');
const router = express.Router();

//Student Model
const Student = require('../../models/Student');

// @route   GET api/student
// @desc    Get a student
// @access  Public
router.get('/', (req, res) => {
    Student.findOne({sid: req.body.sid}, function(err,result){
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
    newStudent.save().then(student => res.json(student))
});

// To Do: Currently not working
// @route   DELETE api/student/:sid
// @desc    Delete a student
// @access  Public (Should be private in real production)


//module.exports = router;