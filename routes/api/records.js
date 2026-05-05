const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { randomUUID } = require('crypto');
const Record = require('../../models/Records');
const Session = require('../../models/Sessions');

const isProd = process.env.NODE_ENV === 'production';
const isDemoMode = () => !isProd && mongoose.connection.readyState !== 1;

function requireProf(req, res, next) {
    const pid = req.cookies && req.cookies.pid;
    if (!pid) return res.status(401).json({ success: false, error: 'authentication required' });
    req.pid = pid;
    next();
}

function requireStudent(req, res, next) {
    const sid = req.cookies && req.cookies.sid;
    const sesid = req.cookies && req.cookies.sesid;
    if (!sid || !sesid) return res.status(401).json({ success: false, error: 'session required' });
    req.sid = sid;
    req.sesid = sesid;
    next();
}

router.get('/', requireProf, (req, res) => {
    Record.find({ sessionID: req.query.sessionID || undefined })
        .sort({ dateJoined: -1 })
        .then((records) => res.json(records))
        .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

async function createFromBody(req, res) {
    const io = req.app.get('io');
    const sesid = req.sesid;

    if (req.body.isComment === 'true' || req.body.isComment === true) {
        const text = String(req.body.comment || '').slice(0, 500).trim();
        if (!text) return res.status(400).json({ success: false });

        // Dev demo mode: skip persistence, broadcast a synthetic record so
        // the live screen still gets a question through the socket.
        if (isDemoMode()) {
            const payload = {
                _id: randomUUID(),
                id: randomUUID(),
                comment: text,
                text,
                sid: req.sid,
                sesid,
                votes: 0,
                answered: false,
                Time: new Date(),
            };
            if (io && sesid) {
                io.to(sesid).emit('incomingComment', payload);
                io.to(sesid).emit('newQuestion', payload);
            }
            return res.json(payload);
        }

        try {
            const saved = await Record.create({
                studentID: req.sid,
                sessionID: sesid,
                value: 0,
                old_value: 0,
                comment: text,
                votes: 0,
                answered: false,
            });
            const payload = {
                _id: saved._id,
                id: saved._id,
                comment: saved.comment,
                text: saved.comment,
                sid: saved.studentID,
                sesid: saved.sessionID,
                votes: saved.votes,
                answered: saved.answered,
                Time: saved.timeRating,
            };
            if (io && sesid) {
                io.to(sesid).emit('incomingComment', payload);
                io.to(sesid).emit('newQuestion', payload);
            }
            return res.json(payload);
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    const value = Number(req.body.value);
    if (![1, 2, 3].includes(value)) return res.status(400).json({ success: false });

    if (isDemoMode()) {
        return res.json({ ok: true, value, demo: true });
    }

    try {
        const saved = await Record.create({
            studentID: req.sid,
            sessionID: sesid,
            value,
            old_value: Number(req.body.old_value) || 0,
        });
        return res.json(saved);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

router.post('/', requireStudent, createFromBody);
router.post('/AddRecord', requireStudent, createFromBody);

// ---- Vote on a question ----
router.post('/Vote', requireStudent, async (req, res) => {
    const recordId = String(req.body.recordId || '');
    const delta = Number(req.body.delta);
    if (!recordId || !Number.isFinite(delta) || (delta !== 1 && delta !== -1)) {
        return res.status(400).json({ success: false });
    }
    try {
        const rec = await Record.findById(recordId);
        if (!rec) return res.status(404).json({ success: false });
        if (rec.sessionID !== req.sesid) return res.status(403).json({ success: false });
        const has = rec.voters && rec.voters.includes(req.sid);
        if (delta > 0 && has) {
            return res.json({ success: true, alreadyVoted: true, votes: rec.votes });
        }
        if (delta < 0 && !has) {
            return res.json({ success: true, votes: rec.votes });
        }
        if (delta > 0) {
            rec.voters = [...(rec.voters || []), req.sid];
            rec.votes = (rec.votes || 0) + 1;
        } else {
            rec.voters = (rec.voters || []).filter((x) => x !== req.sid);
            rec.votes = Math.max(0, (rec.votes || 0) - 1);
        }
        const saved = await rec.save();
        const payload = { recordId: String(saved._id), id: String(saved._id), votes: saved.votes };
        const io = req.app.get('io');
        if (io && saved.sessionID) io.to(saved.sessionID).emit('voteUpdate', payload);
        res.json({ success: true, ...payload });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ---- Mark a question answered (professor only, must own the session) ----
router.post('/MarkAnswered', requireProf, async (req, res) => {
    const recordId = String(req.body.recordId || '');
    if (!recordId) return res.status(400).json({ success: false });
    try {
        const rec = await Record.findById(recordId);
        if (!rec) return res.status(404).json({ success: false });
        const owns = await Session.findOne({ sesid: rec.sessionID, pid: req.pid });
        if (!owns) return res.status(403).json({ success: false });
        rec.answered = true;
        const saved = await rec.save();
        const io = req.app.get('io');
        const payload = { recordId: String(saved._id), id: String(saved._id) };
        if (io && saved.sessionID) io.to(saved.sessionID).emit('markAnswered', payload);
        res.json({ success: true, ...payload });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
