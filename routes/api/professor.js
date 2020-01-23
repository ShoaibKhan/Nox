const express = require('express');
const router = express.Router();

//professor Model
const Professor = require('../../models/Professor');

// @route   GET api/professor
// @desc    Get a professor
// @access  Public
router.get('/', (req, res) => {
    Professor.findOne({ pid: req.body.pid }, function (err, result) {
        if (err) throw err;
        res.json(result);
    })

});

// @route   POST api/professor
// @desc    Register a new professor
// @access  Public (Should be private in real production)
router.post('/', (req, res) => {
    const newProfessor = new Professor({
        name: req.body.name
    });
    newProfessor.save().then(professor => res.json(professor))
});

// To Do: Currently not working
// @route   DELETE api/professor/:pid
// @desc    Delete a professor
// @access  Public (Should be private in real production)
router.delete('/:pid', (req, res) => {
    Professor.findOne()
        .then(professor => professor.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
