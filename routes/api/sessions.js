const express = require('express');
const router = express.Router();


//Professor Model
const Session = require('../../models/Sessions');

// @route   GET api/sessions
// @desc    Get a session
// @access  Public
router.get('/', (req, res) => {
    Session.findOne({ sesid: req.body.sesid }, function (err, result) {
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

// @route   POST api/sessions
// @desc    Create a session
// @access  Public (Should be private in real production)
router.post('/', (req, res) => {
    const newSession = new Session({
        pid: req.body.pid,
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