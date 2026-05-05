const express = require('express');
const router = express.Router();

// @route   POST api/student
// @desc    Acknowledge a student handshake. The actual identity is established
//          when joining a session — see /api/sessions/JoinSession.
// @access  Public
router.post('/', (req, res) => {
    res.status(200).json({ success: true });
});

module.exports = router;
