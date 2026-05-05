<div align="center">

<img src="pictures/v3/student-mobile-join.png" alt="Nox" width="220"/>

# Nox

**Real-time, anonymous Q&A and polling for lectures.**

</div>

---

Lectures are a one-way medium. Students sit silent because raising a hand is a public act with social cost; instructors keep teaching because no signal means everything is fine. Nox closes both gaps:

- **Anonymous Q&A** with upvotes — the room's best questions surface to the top, no one is on the spot.
- **Live understanding pulse** — three taps (*I get it · Slow down · I'm lost*) keep instructors honest in real time.
- **Quick polls** — multiple choice, true/false, confidence 1–5, or open-ended; results update as students vote.
- **Zero account for students** — type a six-character session code and you're in.

Single sign-on for instructors uses the institution's existing weblogin (UTORid · idpz). No new credentials.

---

## Screens

### Student · Mobile

|  |  |  |
|---|---|---|
| <img src="pictures/v3/student-mobile-join.png" width="240"/> | <img src="pictures/v3/student-mobile-live.png" width="240"/> | <img src="pictures/v3/student-mobile-poll-results.png" width="240"/> |
| **Join** — six-character code, QR fallback, no account | **Live** — three-mood pulse + upvote-sorted Q&A + anonymous composer | **Poll** — large lettered tap targets, animated lock-in |

### Student · Web

The same flow on a wider canvas with a side rail for understanding, the active poll, and instructor replies. Layout switches at 768 px.

<img src="pictures/v3/student-desktop.png" width="900"/>

### Instructor · Desktop

<img src="pictures/v3/prof-sessions.png" width="900"/>

> **Sessions** — every course at a glance. Per-session sparklines, term-level stats (avg understanding, questions asked, poll responses), one click to start the next live session.

<img src="pictures/v3/prof-dashboard.png" width="900"/>

> **Live dashboard** — full pulse timeline, distribution panel, top-questions feed with mark-answered/reply, and a heads-up alert when 30-second average pulse drops below 1.8.

<img src="pictures/v3/prof-poll.png" width="900"/>

> **Live poll** — animated results, leader / confidence / avg-time stats, queued polls, template library.

### Authentication

Pixel-faithful to the institution's existing weblogin so students and faculty trust the credential prompt. SSO behavior is unchanged.

<img src="pictures/v3/auth-login.png" width="900"/>

---

## Design system

```
Primary  #1E3765    U of T navy
Paper    #F7F3EB    warm parchment canvas
Ink      #0F1729
Accents  oklch good · okay · low (semantic, equal-chroma)
Type     Newsreader · Inter · JetBrains Mono
```

Reusable React primitives — `Btn`, `Card`, `Pill`, `NoxTopBar`, `PulseLine`, `PollBars`, `SectionLabel` — live in [`general_client/src/components/ui/`](general_client/src/components/ui/). Tokens are CSS custom properties in [`general_client/src/styles/tokens.css`](general_client/src/styles/tokens.css).

---

## Architecture

```
Browser (CRA · React · Redux)
  ├── REST  ── /nox/api/{sessions,records,professor,student}
  └── WS    ── socket.io (rooms keyed by session code)
                │
                ▼
        Express + socket.io
                │
                ▼
            MongoDB (sessions · records · polls · students · professors)
```

- **REST + sockets**, room-scoped per session. Pulse aggregates 1 Hz; questions, votes, and poll updates fan out instantly.
- **Cookie-based auth** for both instructors (`pid`, set by the SSO handshake) and students (`sid`, anonymous, set on first join). The server never trusts identity claims sent in request bodies.
- **Per-question and per-poll uniqueness** is enforced server-side; one vote per student.

---

## Local development

```bash
git clone https://github.com/ShoaibAhmadKhan/Nox.git
cd Nox

# 1. Install dependencies (root + client)
npm run setup

# 2. Configure environment — see .env.example
export MONGO_URI='mongodb://127.0.0.1:27017/nox'

# 3. Start MongoDB (any one of these)
brew services start mongodb-community
# or: docker run -d -p 27017:27017 mongo:7

# 4. Run server + client in dev (separate ports, hot-reload)
npm run dev

# Or build the client once and serve it from Express
npm run build && npm start
```

Dev: client on `http://localhost:3000`, server on `http://localhost:5001`.
Built mode: everything on `http://localhost:5001`.

| Action | Command |
|---|---|
| Run server only | `npm run server` |
| Run client only | `npm run client` |
| Production build | `npm run build` |
| Run tests (client) | `npm test --prefix general_client` |

---

## Project layout

```
.
├── server.js                      Express + socket.io entrypoint
├── routes/api/                    REST endpoints (sessions · records · professor · student)
├── models/                        Mongoose schemas
├── config/keys.js                 Reads MONGO_URI from env (never commit secrets)
├── general_client/                Create React App
│   └── src/
│       ├── App.js                 Routes
│       ├── components/ui/         Primitives + icons
│       ├── views/{auth,student,professor}/
│       ├── slices/                Redux slices (pulse, questions, poll)
│       ├── actions/               Thunks + REST clients
│       ├── socket.js              Singleton socket.io client
│       └── styles/tokens.css      Design tokens
└── documents/User Experience/     Design canvas + handoff docs
```

---

## Contributing

PRs welcome. Please open an issue first for anything substantial so we can talk through the design before you build it.

<div align="center">
<sub>Built to listen.</sub>
</div>
