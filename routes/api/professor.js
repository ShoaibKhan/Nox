const express = require('express');
const router = express.Router();
const Professor = require('../../models/Professor');

const isProd = process.env.NODE_ENV === 'production';
const profCookieOptions = { httpOnly: false, sameSite: 'lax', secure: isProd, path: '/' };

router.get('/', (req, res) => {
    const pid = req.cookies && req.cookies.pid;
    if (!pid) return res.status(401).json({ success: false });
    Professor.findOne({ pid })
        .then((result) => res.json(result))
        .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

router.get('/me', (req, res) => {
    const pid = req.cookies && req.cookies.pid;
    if (!pid) return res.status(401).json({ success: false });
    Professor.findOne({ pid })
        .then((result) => {
            if (!result) return res.json({ pid });
            res.json({ pid: result.pid, firstName: result.firstName, lastName: result.lastName });
        })
        .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

router.post('/', (req, res) => {
    const newProfessor = new Professor({
        firstName: req.body.firstName || req.body.name || '',
        lastName: req.body.lastName || '',
        pid: req.body.pid,
    });
    newProfessor
        .save()
        .then((professor) => res.json(professor))
        .catch((err) => res.status(500).json({ success: false, error: err.message }));
});

// Login proxy for the redesigned UoftAuthScreen.
// In production the real auth happens at the U of T idpz edge and the
// utorid header is forwarded. In development we accept any utorid so the
// CRA dev flow works; we never attempt to verify a password locally.
router.post('/login', async (req, res) => {
    const utorid = (req.body.utorid || req.headers.utorid || '').toString().trim();
    if (!utorid) return res.status(400).json({ success: false });
    try {
        if (!isProd) {
            res.cookie('pid', utorid, profCookieOptions);
            return res.json({ success: true, pid: utorid });
        }
        const result = await Professor.findOne({ pid: utorid });
        if (!result) return res.status(403).json({ success: false });
        res.cookie('pid', result.pid, profCookieOptions);
        return res.json({ success: true, pid: result.pid });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('pid', { path: '/' });
    res.json({ success: true });
});

router.delete('/:pid', (req, res) => {
    Professor.findOneAndDelete({ pid: req.params.pid })
        .then((deleted) => {
            if (!deleted) return res.status(404).json({ success: false });
            res.json({ success: true });
        })
        .catch(() => res.status(500).json({ success: false }));
});

module.exports = router;
