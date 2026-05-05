# Claude Code Handoff — Nox UI Implementation

You are taking over implementation of a redesigned UI for **Nox**, a real-time anonymous Q&A and polling web app for university lectures (originally built for University of Toronto students/professors). The visual design is finished and lives in this project as a clickable hi-fi prototype: `Nox Redesign.html` (canvas) and the React JSX sources under `src/`.

Your job: port these designs into the existing codebase under `general_client/` (Create React App + Redux + reactstrap/Material UI) and wire them to the existing Express/Mongo backend. Keep the design pixel-faithful. Do not redesign.

---

## What the prototype contains

Nine artboards in `Nox Redesign.html`:

| # | Artboard | Source file | Notes |
|---|---|---|---|
| 1 | UTORid login (idpz) | `src/auth-uoft.jsx` | **Keep faithful to the U of T weblogin idpz screen.** Don't redesign — only forward credentials to the existing utorauth flow. |
| 2 | Student · Join session (mobile) | `src/student-mobile.jsx → StudentJoinScreen` | 6-character OTP-style code input, QR fallback. |
| 3 | Student · Live Q&A + pulse (mobile) | `src/student-mobile.jsx → StudentLiveScreen` | Three-mood pulse strip + upvote-sorted question feed + anonymous composer. |
| 4 | Student · Poll vote (mobile) | `src/student-mobile.jsx → StudentPollScreen` | Lettered options A/B/C/D, large tap targets. |
| 5 | Student · Poll results revealed (mobile) | `src/student-mobile.jsx → StudentPollScreen revealed` | Animated bar fills, lock-in confirmation. |
| 6 | Student · Web live class | `src/student-desktop.jsx → StudentDesktopLive` | Same flow on desktop with side rail. |
| 7 | Professor · Sessions (course detail) | `src/professor.jsx → ProfSessions` | Course list, term stats, sessions table with mini sparklines. |
| 8 | Professor · Live dashboard | `src/professor.jsx → ProfDashboard` | Pulse graph, alert banner, top-questions feed, distribution panel, quick actions. |
| 9 | Professor · Live poll | `src/professor.jsx → ProfPollLive` | Live results, controls, queued polls, templates. |

Shared design tokens, primitives and icons:
- `src/primitives.jsx` — `NoxTopBar`, `NoxLockup`, `Btn`, `Card`, `Pill`, `PulseLine`, `PollBars`, `SectionLabel`
- `src/icons.jsx` — monoline 24×24 stroke icons + `NoxMark`
- CSS variables defined in the `<style>` block of `Nox Redesign.html` (`:root`)

---

## Design system — non-negotiable

**Colors** (CSS custom properties — copy these verbatim into the app's stylesheet):

```css
--uoft-navy:       #1E3765;   /* primary brand */
--uoft-navy-deep:  #172A4F;
--uoft-navy-soft:  #283F73;
--uoft-blue:       #4A6FA5;
--uoft-blue-light: #7196C7;
--paper:           #F7F3EB;   /* warm parchment canvas */
--paper-2:         #EFE9DD;
--bone:            #FBF8F2;
--ink:             #0F1729;
--ink-2:           #2A3447;
--ink-3:           #5A6478;
--line:            rgba(15,23,41,0.10);
--line-2:          rgba(15,23,41,0.06);
--accent-good:     oklch(0.74 0.13 150);
--accent-okay:     oklch(0.80 0.12 80);
--accent-low:      oklch(0.66 0.16 28);
--accent-warm:     #C8A24B;
```

**Typography:** Newsreader (serif headlines/numerals) + Inter (UI body) + JetBrains Mono (codes, labels, micro-meta). Load from Google Fonts in `public/index.html`.

**Radii:** 6 / 10 / 16 / 22. **Shadows:** subtle, three tiers (see prototype `--shadow-sm/md/lg`).

**Motion:** 150ms ease for hover, 400ms cubic-bezier(.2,.8,.2,1) for poll bar fills, no bounces.

---

## Functional requirements (what to build)

### Authentication (Auth screen)
- Render the U of T idpz screen exactly as in `src/auth-uoft.jsx`.
- Submit posts to existing `/api/professor/login` (or whatever utorauth proxy already exists in `routes/api`).
- On success store `pid` in cookie; redirect to `/nox/professor`.

### Student flow (mobile-first, also responsive web)
1. **Join** — 6-char code input, validate against `POST /nox/api/sessions/JoinSession` (already exists). On success, set `sid` and `sesid` cookies, route to `/nox/student`.
2. **Live** — Connect to existing socket.io server, room = `sesid`.
   - Pulse: emit `studentPulse` `{value: 1|2|3}` whenever the user changes mood. Replaces the current `record` actions but should pipe to the existing `addRecord` reducer.
   - Q&A: questions are stored as `Records` with `isComment:'true'` (existing schema). New: include `votes:Number` and `answered:Boolean`. Emit `newQuestion` and `voteQuestion` events; server broadcasts updated list.
   - Composer: `POST /nox/api/records/AddRecord` (existing) with comment text.
3. **Poll** — Subscribe to `pollOpened`, `pollClosed`, `pollUpdate` socket events. Submit votes via `POST /nox/api/sessions/Vote` (new endpoint to add). Show results once user has voted OR once poll is closed.

### Professor flow (desktop)
1. **Sessions list** — Fetch courses via existing `getCourses(pid)` action. For each course, fetch sessions list (new endpoint `/nox/api/sessions/ByCourse`). Show one "live now" if a session is currently active. **Start session** creates a session and routes to dashboard.
2. **Live dashboard** — Same socket room as students.
   - Pulse line: rolling array of last N average pulses (server emits `pulseTick` once per second with the average).
   - Top questions: receive `incomingComment` (existing) and `voteUpdate`. Mark answered → emits `markAnswered`.
   - Alert banner: client-side rule — show if last 30s avg pulse < 1.8.
3. **Live poll** — Compose poll (multiple choice / true-false / confidence 1–5 / open-ended), emit `startPoll`, watch `pollUpdate`, end with `endPoll`. Templates are pre-filled poll structures stored client-side.

### New backend endpoints to add
- `POST /nox/api/sessions/Vote` — `{sesid, pollId, optionId, sid}` → records vote, broadcasts `pollUpdate`.
- `POST /nox/api/sessions/StartPoll` — `{sesid, question, type, options}` → broadcasts `pollOpened`.
- `POST /nox/api/sessions/EndPoll` — `{sesid, pollId}` → broadcasts `pollClosed`.
- `POST /nox/api/records/Vote` — `{recordId, sid, delta:+1|-1}` → upvote/downvote on a question.
- `POST /nox/api/records/MarkAnswered` — `{recordId}`.
- `GET /nox/api/sessions/ByCourse?courseCode=…&pid=…` — list of sessions for a course.
- `GET /nox/api/sessions/Report?sesid=…` — JSON summary (avg pulse over time, all questions, all polls) for export.

Add socket events on the server side: `studentPulse`, `pulseTick` (broadcast 1 Hz aggregate), `voteQuestion`, `voteUpdate`, `markAnswered`, `pollOpened`, `pollUpdate`, `pollClosed`.

---

## Implementation plan

1. **Tokenize** — Add a `src/styles/tokens.css` with the variables above; import in `index.css`. Add Google Fonts to `public/index.html`.
2. **Primitives** — Port `Btn`, `Card`, `Pill`, `NoxTopBar`, `NoxLockup`, `PulseLine`, `PollBars`, `SectionLabel` from `src/primitives.jsx` into `general_client/src/components/ui/`. They're plain React, no deps beyond React itself.
3. **Icons** — Port `src/icons.jsx` into `components/ui/icons.jsx`.
4. **Routes** — Update `App.js`:
   - `/nox` → `LandingPage` (rebuilt as `StudentJoinScreen`)
   - `/nox/student` → mobile or desktop layout based on viewport (use `useMediaQuery`)
   - `/nox/professor` → `ProfSessions`
   - `/nox/professor/dashboard` → `ProfDashboard`
   - `/nox/professor/poll` → `ProfPollLive`
   - `/nox/login` → `UoftAuthScreen`
5. **State** — Extend the existing Redux store: add `pulse` (running array), `questions` (with vote/answered fields), `poll` (active poll + results). Keep existing `sessionReducer` and `recordsReducer` as the backing store; add slices.
6. **Sockets** — Centralize socket instance in `src/socket.js`. Subscribe in dashboard/live components with `useEffect`. Emit events from action creators.
7. **Mobile-first** — Wrap student views in a max-width-420 container on small viewports; on ≥768px switch to the desktop layout with right rail.
8. **Replace bootstrap** — The redesign does not use react-bootstrap or Material UI styling. Remove those imports from migrated views; keep the libs installed only if other un-migrated views still need them, then remove on cleanup pass.

---

## Acceptance checklist

- [ ] All 9 artboards reproducible in the running app at 1:1 visual fidelity.
- [ ] Pulse updates from student → professor in <1s end-to-end.
- [ ] Question upvotes update reactively for all clients.
- [ ] Poll vote → server → broadcast cycle works for ≥50 concurrent students.
- [ ] Auth flow uses the existing utorauth integration; UI is the idpz screen.
- [ ] Mobile student view is 390px wide and tap-target-friendly (44px min hit areas).
- [ ] Desktop views render correctly at 1280×720 minimum.
- [ ] No console errors. No use of `scrollIntoView`. No CSS files >300 lines (use tokens).
- [ ] Lighthouse mobile a11y ≥ 95.

---

## Reference

Open `Nox Redesign.html` to interact with every screen. Each artboard is fullscreen-able (hover, click the expand icon). Tweaks panel exposes brand-color overrides for theming experiments.

When in doubt about any visual detail, **read the corresponding source file** rather than guessing — every measurement, color, and animation timing in the designs is intentional.
