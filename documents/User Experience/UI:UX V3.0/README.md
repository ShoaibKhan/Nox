<div align="center">

<img src="documents/Nox Logos/Nox_Logo3.png" alt="Nox" width="180"/>

# Nox

**Real-time, anonymous Q&A and polling for lecture-style classrooms.**

Built at the University of Toronto to close the communication gap between professors and students — students can ask without raising their hand, and professors can see who's keeping up before they fall behind.

[Live demo](https://csc398dev.utm.utoronto.ca) · [Design canvas](./Nox%20Redesign.html) · [Claude Code handoff](./CLAUDE_CODE_HANDOFF.md)

</div>

---

## Why Nox

Lectures are a one-way medium. Students sit silent because raising a hand is a public act with social cost; professors keep teaching because no signal means everything is fine. Nox fixes both ends:

- **Anonymous** Q&A with upvotes — the room's best questions surface to the top, no one is on the spot.
- **Live understanding pulse** — three taps (*I get it / Slow down / I'm lost*) keep professors honest in real time.
- **Quick polls** — multiple choice, true/false, confidence 1–5, or open-ended; results appear as students vote.
- **Zero account for students** — type a six-character session code and you're in.

---

## What's new in this redesign

| Area | Before | After |
|---|---|---|
| Look & feel | Photo-background dark theme, mixed monospace + serif | Warm parchment canvas, tightened type pairing (Newsreader · Inter · JetBrains Mono), retained U of T navy |
| Student mobile | Centered modal on photo bg | Mobile-first three-step flow: join → live → poll, with built-in pulse and anonymous composer |
| Pulse feedback | Single static rating | Continuous timeline graph + "13 students lost" alert when comprehension dips |
| Q&A | Flat list | Upvote-sorted feed with answered/trending tags, threaded prof replies |
| Polls | One question at a time | Templates, queued polls, lock-in animation, per-poll analytics |
| Sessions | Course list only | Full term overview with mini sparklines per session and post-session reports |
| Auth | Custom prof login | **Kept faithful to U of T idpz weblogin** for trust + SSO |

The full clickable prototype lives in [`Nox Redesign.html`](./Nox%20Redesign.html). Open it and hover any artboard to fullscreen it.

---

## Screens

### Auth — University of Toronto weblogin (kept as-is)

<img src="pictures/v2/Desktop_login.png" alt="UTORid login" width="700"/>

The auth screen remains pixel-faithful to the official idpz screen so students and faculty trust the credential prompt. SSO behavior is unchanged.

### Student · Mobile

|||
|---|---|
| **Join session** — six-character code, QR fallback, no account | **Live class** — three-mood pulse + upvote-sorted Q&A + anonymous composer |
| **Vote on a poll** — large lettered tap targets, lock-in animation | **See live results** — animated bar fills as the room responds |

### Student · Web

Same flow as mobile with a side rail for pulse, recent prof answers, and active poll. Layout responsively switches at 768px.

### Professor · Desktop

- **Sessions** — course list with per-session mini sparklines, term-level stats (avg understanding, total questions, poll turnout, students reached).
- **Live dashboard** — full pulse timeline, distribution panel, top-questions feed with mark-answered/reply, and a heads-up alert when 30s avg pulse drops below 1.8.
- **Live poll** — animated results, leader/confidence/avg-time stats, queued polls, template library.

---

## Design system

All tokens live in [`Nox Redesign.html`](./Nox%20Redesign.html) `:root` and are documented in [`CLAUDE_CODE_HANDOFF.md`](./CLAUDE_CODE_HANDOFF.md).

```
Primary  #1E3765   (U of T navy)
Paper    #F7F3EB   (warm parchment canvas)
Ink      #0F1729
Accents  oklch good · okay · low (semantic, equal-chroma)
Type     Newsreader · Inter · JetBrains Mono
```

Reusable React primitives (`Btn`, `Card`, `Pill`, `NoxTopBar`, `PulseLine`, `PollBars`, `SectionLabel`) are in [`src/primitives.jsx`](./src/primitives.jsx); icons in [`src/icons.jsx`](./src/icons.jsx).

---

## Repo layout

```
.
├── Nox Redesign.html         ← clickable prototype (start here)
├── CLAUDE_CODE_HANDOFF.md    ← implementation brief for Claude Code
├── src/                      ← prototype JSX sources
│   ├── auth-uoft.jsx
│   ├── student-mobile.jsx
│   ├── student-desktop.jsx
│   ├── professor.jsx
│   ├── primitives.jsx
│   └── icons.jsx
├── general_client/           ← existing CRA frontend (target for migration)
├── routes/api/               ← Express routes
├── models/                   ← Mongoose schemas
├── server.js                 ← entrypoint
└── pictures/v2/              ← legacy reference shots
```

---

## Run it locally

```bash
git clone https://github.com/ShoaibAhmadKhan/Nox.git
cd Nox
./setup.bash         # installs deps, builds client, starts server
```

Server + client run on `http://localhost:5001`.

| Action | Command |
|---|---|
| Stop the server | `Ctrl+C` |
| Start server again | `node server.js` |
| Restart client after an update | `./updateDev.bash` |

---

## Status & next steps

- ✅ Design system finalized
- ✅ All 9 screens prototyped (mobile + web + professor)
- 🛠 Implementation in progress — see [`CLAUDE_CODE_HANDOFF.md`](./CLAUDE_CODE_HANDOFF.md) for the build plan, new endpoints, and acceptance checklist.

---

## Contributing

Message any of the developers if you'd like to contribute. PRs welcome.

<div align="center">

<sub>Made for U of T. Built to listen.</sub>

</div>
