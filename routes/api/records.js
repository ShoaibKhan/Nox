const express = require('express');
const router = express.Router();

//Records Model
const Record = require('../../models/Records');

// @route   GET api/records
// @desc    Get ALL records given criterias
// @access  Public
router.get('/', (req, res) => {
    Record.find()
        .sort({ date: -1})  
        .then(records => res.json(records))
});

// @route   POST api/records
// @desc    Create a record
// @access  Public
router.post('/', (req, res) => {
    const newRecord = new Record({
        studentID: req.body.studentID,
        sessionID: req.body.sessionID,
        value: req.body.value,
        old_value: req.body.old_value
    });
    newRecord.save().then(records => res.json(records));
});



module.exports = router;