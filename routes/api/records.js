const express = require('express');
const router = express.Router();

//Records Model
const Record = require('../../models/Records');

// @route   GET api/records
// @desc    Get ALL records given criterias
// @access  Public
router.get('/', (req, res) => {
    Records.find()
        .sort({ date: -1})  
        .then(records => res.json(records))
});

// @route   POST api/records
// @desc    Create a record
// @access  Public
router.post('/', (req, res) => {
    const newRecord = new Record({
        studentId: req.body.studentId,
        sessionId: req.body.sessionId
    });
});

// To Do: Currently not working
// @route   DELETE api/records/:pid
// @desc    Delete a record
// @access  Public (Should be private in real production)
router.delete('/:pid', (req, res) => {
    Professor.findById(req.params.id)
        .then(professor => professor.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});



module.exports = router;