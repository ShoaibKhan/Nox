const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const professor = require('./routes/api/professor');
const sessions = require('./routes/api/sessions');
const student = require('./routes/api/student');
const records = require('./routes/api/records');
const Professor = require('./models/Professor');

const environment = process.env.NODE_ENV || 'development';
const isProd = environment === 'production';

const corsOptions = {
    origin: isProd
        ? ['https://csc398dev.utm.utoronto.ca', 'https://idpz.utorauth.utoronto.ca']
        : 'http://localhost:3000',
    credentials: true,
};

const app = express();

if (isProd) app.set('trust proxy', 1);

const httpModule = isProd ? require('https') : require('http');
const serverOptions = isProd
    ? {
          key: fs.readFileSync('utmwild.key'),
          cert: fs.readFileSync('__utm_utoronto_ca_cert.cer'),
          ca: fs.readFileSync('__utm_utoronto_ca_interm.cer'),
      }
    : {};
const server = httpModule.createServer(serverOptions, app);

const io = require('socket.io')(server, { cors: corsOptions });
app.set('io', io);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '64kb' }));

const db = require('./config/keys').mongoURI;
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log(err));

app.use('/nox/api/professor', professor);
app.use('/nox/api/sessions', sessions);
app.use('/nox/api/student', student);
app.use('/nox/api/records', records);

const profCookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
};

// idpz/utorauth handshake — the edge proxy attaches `utorid` to the headers
app.get('/nox/professor', async function (req, res) {
    const utorid = req.headers.utorid;
    try {
        const devBypass = !utorid && !isProd;
        if (devBypass) {
            return res
                .cookie('pid', 'dev', profCookieOptions)
                .sendFile(path.resolve(__dirname, 'general_client', 'build', 'index.html'));
        }
        const result = await Professor.findOne({ pid: utorid });
        if (result && result.pid === utorid) {
            return res
                .cookie('pid', utorid, profCookieOptions)
                .sendFile(path.resolve(__dirname, 'general_client', 'build', 'index.html'));
        }
        res
            .status(403)
            .send('You are not authorized as a Professor. Contact achaudhral629@gmail.com to request access.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Authentication error');
    }
});

app.use(express.static('general_client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'general_client', 'build', 'index.html'));
});

const port = process.env.PORT || 5001;
server.listen(port, () => console.log(`Server started on port ${port}`));


// ==========================================================================
// Per-session live state for pulse + presence
// ==========================================================================

// sesid -> { values: number[], lastSamples: { sid: { value, time } } }
const sesidToPulseState = {};

// socket.id -> { sesid, role, sid }
const socketToSession = {};

function aggregateForSession(sesid) {
    const state = sesidToPulseState[sesid];
    if (!state) {
        return {
            goodStudents: 0,
            okayStudents: 0,
            confusedStudents: 0,
            totalStudents: 0,
            average_rating: 0,
            average: 0,
            avgRGB: 'rgba(255,255,0,0.3)',
        };
    }
    let good = 0;
    let okay = 0;
    let lost = 0;
    Object.values(state.lastSamples || {}).forEach((s) => {
        if (!s || s.value == null) return;
        if (s.value === 3) good++;
        else if (s.value === 2) okay++;
        else if (s.value === 1) lost++;
    });
    const total = good + okay + lost;
    const average = total ? (good * 3 + okay * 2 + lost) / total : 0;
    let avgRGB = 'rgba(255,255,0,0.3)';
    if (average >= 2.25) avgRGB = 'rgba(0,255,0,0.3)';
    else if (total > 0 && average <= 1.75) avgRGB = 'rgba(255,0,0,0.3)';
    return {
        goodStudents: good,
        okayStudents: okay,
        confusedStudents: lost,
        totalStudents: total,
        average_rating: Number.isFinite(average) ? average : 0,
        average,
        avgRGB,
    };
}

setInterval(() => {
    Object.keys(sesidToPulseState).forEach((sesid) => {
        const room = io.sockets.adapter.rooms.get(sesid);
        if (!room || room.size === 0) return;
        const agg = aggregateForSession(sesid);
        sesidToPulseState[sesid].values.push(agg.average);
        if (sesidToPulseState[sesid].values.length > 600) {
            sesidToPulseState[sesid].values.shift();
        }
        io.to(sesid).emit('pulseTick', agg);
        io.to(sesid).emit('Data', agg);
    });
}, 1000);


// ==========================================================================
// Socket.io connection handling
// ==========================================================================

function emitPresence(sesid) {
    const room = io.sockets.adapter.rooms.get(sesid);
    const count = room ? room.size : 0;
    io.to(sesid).emit('presenceUpdate', { sesid, count });
}

function ensureSessionState(sesid) {
    if (!sesidToPulseState[sesid]) {
        sesidToPulseState[sesid] = { values: [], lastSamples: {} };
    }
}

io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on('disconnect', () => {
        const meta = socketToSession[socket.id];
        if (meta && meta.sesid) emitPresence(meta.sesid);
        delete socketToSession[socket.id];
        console.info(`Client gone [id=${socket.id}]`);
    });

    socket.on('joinSessionRoom', ({ sesid, sid, role } = {}) => {
        if (!sesid) return;
        socket.join(sesid);
        socketToSession[socket.id] = { sesid, sid: sid || null, role: role || 'student' };
        ensureSessionState(sesid);
        emitPresence(sesid);
    });

    // Legacy: professor explicit registration
    socket.on('proffesorSocket', (params = {}) => {
        if (!params.sesid) return;
        socket.join(params.sesid);
        socketToSession[socket.id] = { sesid: params.sesid, role: 'prof' };
        ensureSessionState(params.sesid);
        emitPresence(params.sesid);
    });

    socket.on('studentPulse', ({ sesid, sid, value, time } = {}) => {
        if (!sesid || !sid) return;
        const v = Number(value);
        if (![1, 2, 3].includes(v)) return;
        ensureSessionState(sesid);
        sesidToPulseState[sesid].lastSamples[sid] = { value: v, time: time || Date.now() };
    });

    // Legacy alias
    socket.on('newCodeToServer', (params = {}) => {
        if (!params.sesid || !params.sid) return;
        const v = Number(params.rating);
        if (![1, 2, 3].includes(v)) return;
        ensureSessionState(params.sesid);
        sesidToPulseState[params.sesid].lastSamples[params.sid] = { value: v, time: Date.now() };
    });

    socket.on('newCommentToServer', (payload = {}) => {
        if (!payload.sesid) return;
        io.to(payload.sesid).emit('incomingComment', payload);
    });

    socket.on('newQuestion', (payload = {}) => {
        if (!payload.sesid) return;
        io.to(payload.sesid).emit('newQuestion', payload);
    });

    socket.on('voteQuestion', (payload = {}) => {
        if (!payload.sesid) return;
        io.to(payload.sesid).emit('voteUpdate', payload);
    });

    socket.on('markAnswered', (payload = {}) => {
        if (!payload.sesid) return;
        io.to(payload.sesid).emit('markAnswered', payload);
    });

    socket.on('startPoll', (payload = {}) => {
        if (!payload.sesid) return;
        io.to(payload.sesid).emit('pollOpened', payload);
    });

    socket.on('voteOnPoll', (payload = {}) => {
        if (!payload.sesid) return;
        io.to(payload.sesid).emit('pollUpdate', payload);
    });

    socket.on('endPoll', (payload = {}) => {
        if (!payload.sesid) return;
        io.to(payload.sesid).emit('pollClosed', payload);
    });
});
