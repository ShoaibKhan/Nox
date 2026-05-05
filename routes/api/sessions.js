const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');

const Student = require('../../models/Student');
const Record = require('../../models/Records');
const Poll = require('../../models/Polls');
const Session = require('../../models/Sessions');

const isProd = process.env.NODE_ENV === 'production';

const studentCookieOptions = { sameSite: 'lax', secure: isProd, path: '/' };
const profCookieOptions = { httpOnly: false, sameSite: 'lax', secure: isProd, path: '/' };

function requireProf(req, res, next) {
    const pid = req.cookies && req.cookies.pid;
    if (!pid) return res.status(401).json({ success: false, error: 'authentication required' });
    req.pid = pid;
    next();
}

router.post('/FindSession', (req, res) => {
    Session.findOne({ sesid: req.body.sesid })
        .then((result) => {
            if (result && result.sesid === req.body.sesid) {
                return res.json({ success: true });
            }
            res.status(404).json({ success: false });
        })
        .catch(() => res.status(500).json({ success: false }));
});

router.get('/AllSessions', requireProf, (req, res) => {
    Session.find({ pid: req.pid, courseCode: req.query.courseCode })
        .then((result) => res.json(result || []))
        .catch(() => res.status(500).json({ success: false }));
});

router.get('/FindCourse', requireProf, (req, res) => {
    Session.find({ pid: req.pid })
        .distinct('courseCode')
        .then((result) => res.json(result || []))
        .catch(() => res.status(500).json({ success: false }));
});

// ---- Sessions list (richer payload than AllSessions) ----
router.get('/ByCourse', requireProf, async (req, res) => {
    const { courseCode } = req.query;
    if (!courseCode) return res.status(400).json({ success: false });
    try {
        const sessions = await Session.find({ pid: req.pid, courseCode }).sort({ dateStart: -1 });
        const enriched = await Promise.all(
            (sessions || []).map(async (s) => {
                const records = await Record.find({ sessionID: s.sesid });
                const polls = await Poll.countDocuments({ sesid: s.sesid });
                const ratings = records.filter((r) => r.value > 0).map((r) => r.value);
                const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
                const questions = records.filter((r) => r.comment && r.comment.length > 0).length;
                return {
                    sesid: s.sesid,
                    courseCode: s.courseCode,
                    pid: s.pid,
                    dateStart: s.dateStart,
                    avg,
                    q: questions,
                    polls,
                    state: 'past',
                };
            })
        );
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ---- Post-session report ----
router.get('/Report', requireProf, async (req, res) => {
    const { sesid } = req.query;
    if (!sesid) return res.status(400).json({ success: false });
    try {
        const [session, records, polls] = await Promise.all([
            Session.findOne({ sesid, pid: req.pid }),
            Record.find({ sessionID: sesid }),
            Poll.find({ sesid }),
        ]);
        if (!session) return res.status(404).json({ success: false });
        const ratings = records.filter((r) => r.value > 0);
        const questions = records
            .filter((r) => r.comment && r.comment.length > 0)
            .map((r) => ({
                id: r._id,
                text: r.comment,
                votes: r.votes,
                answered: r.answered,
                time: r.timeRating,
            }));
        const buckets = {};
        ratings.forEach((r) => {
            const t = new Date(r.timeRating);
            const minute = `${t.getUTCHours()}:${String(t.getUTCMinutes()).padStart(2, '0')}`;
            if (!buckets[minute]) buckets[minute] = { sum: 0, n: 0 };
            buckets[minute].sum += r.value;
            buckets[minute].n += 1;
        });
        const pulseOverTime = Object.entries(buckets).map(([t, b]) => ({ t, avg: b.sum / b.n }));
        res.json({
            sesid,
            courseCode: session.courseCode,
            dateStart: session.dateStart,
            pulseOverTime,
            questions,
            polls,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/JoinSession', async (req, res) => {
    const sesid = typeof req.body.sesid === 'string' ? req.body.sesid.trim() : '';
    if (!sesid) return res.status(400).json({ success: false });

    let sid = req.cookies && req.cookies.sid;
    try {
        if (!sid) {
            const newStudent = new Student({ sid: randomUUID() });
            await newStudent.save();
            sid = newStudent.sid;
            res.cookie('sid', sid, studentCookieOptions);
        }
        const session = await Session.findOne({ sesid });
        if (session && session.sesid === sesid) {
            res.cookie('sesid', session.sesid, studentCookieOptions);
            return res.json({ success: true });
        }
        return res.status(404).json({ success: false });
    } catch (err) {
        return res.status(500).json({ success: false });
    }
});

// Create session (professor)
router.post('/', requireProf, (req, res) => {
    const newSession = new Session({
        courseCode: req.body.courseCode,
        pid: req.pid,
        sesid: req.body.sesid || randomUUID().slice(0, 6).toUpperCase(),
    });
    newSession
        .save()
        .then((sessions) => res.json(sessions))
        .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

router.delete('/', requireProf, (req, res) => {
    Session.findOneAndDelete({ sesid: req.body.sesid, pid: req.pid })
        .then((deleted) => {
            if (!deleted) return res.status(404).json({ success: false });
            res.json({ success: true });
        })
        .catch(() => res.status(500).json({ success: false }));
});

// ---- Poll lifecycle ----

router.post('/StartPoll', requireProf, async (req, res) => {
    const { sesid, question, type, options, durationSeconds } = req.body;
    if (!sesid || !question || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ success: false });
    }
    try {
        const owns = await Session.findOne({ sesid, pid: req.pid });
        if (!owns) return res.status(403).json({ success: false });
        const pollId = randomUUID();
        const expiresAt = durationSeconds ? new Date(Date.now() + Number(durationSeconds) * 1000) : undefined;
        const saved = await Poll.create({
            pollId,
            sesid,
            question: String(question).slice(0, 500),
            type: type || 'mc',
            options: options.map((o, i) => ({
                id: o.id || `opt-${i}`,
                label: o.label || 'ABCDEF'[i] || String(i + 1),
                text: String(o.text || '').slice(0, 240),
                votes: 0,
                voters: [],
            })),
            expiresAt,
        });
        const payload = {
            pollId: saved.pollId,
            sesid: saved.sesid,
            question: saved.question,
            type: saved.type,
            options: saved.options.map((o) => ({ id: o.id, label: o.label, text: o.text, votes: o.votes })),
            expiresAt: saved.expiresAt ? saved.expiresAt.getTime() : null,
        };
        const io = req.app.get('io');
        if (io) io.to(sesid).emit('pollOpened', payload);
        res.json(payload);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/EndPoll', requireProf, async (req, res) => {
    const { sesid, pollId } = req.body;
    if (!sesid || !pollId) return res.status(400).json({ success: false });
    try {
        const owns = await Session.findOne({ sesid, pid: req.pid });
        if (!owns) return res.status(403).json({ success: false });
        const updated = await Poll.findOneAndUpdate(
            { pollId, sesid },
            { closed: true, closedAt: new Date() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false });
        const io = req.app.get('io');
        if (io) io.to(sesid).emit('pollClosed', { sesid, pollId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/Vote', async (req, res) => {
    const sid = req.cookies && req.cookies.sid;
    const sesid = req.cookies && req.cookies.sesid;
    const { pollId, optionId } = req.body;
    if (!sid || !sesid || !pollId || !optionId) return res.status(400).json({ success: false });
    try {
        const poll = await Poll.findOne({ pollId, sesid });
        if (!poll) return res.status(404).json({ success: false });
        if (poll.closed) return res.status(409).json({ success: false, reason: 'closed' });
        const alreadyVoted = poll.options.some((o) => o.voters && o.voters.includes(sid));
        if (alreadyVoted) {
            return res.json({
                success: true,
                alreadyVoted: true,
                options: poll.options.map((o) => ({ id: o.id, label: o.label, text: o.text, votes: o.votes })),
            });
        }
        const opt = poll.options.find((o) => o.id === optionId);
        if (!opt) return res.status(404).json({ success: false });
        opt.votes = (opt.votes || 0) + 1;
        opt.voters.push(sid);
        poll.markModified('options');
        const saved = await poll.save();
        const payload = {
            pollId: saved.pollId,
            sesid: saved.sesid,
            options: saved.options.map((o) => ({ id: o.id, label: o.label, text: o.text, votes: o.votes })),
        };
        const io = req.app.get('io');
        if (io) io.to(sesid).emit('pollUpdate', payload);
        res.json({ success: true, ...payload });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
