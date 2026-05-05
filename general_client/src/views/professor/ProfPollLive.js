import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  Btn,
  Card,
  NoxLockup,
  NoxTopBar,
  PollBars,
  SectionLabel,
} from '../../components/ui/primitives';
import {
  IconCheck,
  IconClock,
  IconPlus,
  IconShare,
  IconStop,
} from '../../components/ui/icons';
import { getSocket } from '../../socket';
import { pollOpen, pollUpdate, pollClose, startPoll, endPoll } from '../../actions/liveActions';

const cookies = new Cookies();

const TEMPLATES = [
  { name: 'Multiple choice', type: 'mc', options: [{ label: 'A', text: '' }, { label: 'B', text: '' }, { label: 'C', text: '' }, { label: 'D', text: '' }] },
  { name: 'True / False', type: 'tf', options: [{ label: 'A', text: 'True' }, { label: 'B', text: 'False' }] },
  { name: 'Confidence 1–5', type: 'conf', options: [{ label: 'A', text: '1' }, { label: 'B', text: '2' }, { label: 'C', text: '3' }, { label: 'D', text: '4' }, { label: 'E', text: '5' }] },
  { name: 'Open-ended', type: 'open', options: [] },
];

const useTimer = (expiresAt) => {
  const [secondsLeft, setSecondsLeft] = useState(null);
  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(null);
      return undefined;
    }
    const tick = () => {
      const r = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsLeft(r);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return secondsLeft;
};

const ProfPollLive = ({ poll, pollOpen, pollUpdate, pollClose, startPoll, endPoll, history }) => {
  const sesid = cookies.get('Prof_sesid');
  const courseCode = cookies.get('Prof_courseCode') || 'CSC209H5';
  const [composer, setComposer] = useState({
    question: 'What happens if you malloc but lose the pointer?',
    type: 'mc',
    options: [
      { label: 'A', text: 'Garbage Collection' },
      { label: 'B', text: 'Memory Leak' },
      { label: 'C', text: 'Seg Fault' },
      { label: 'D', text: 'None of the above' },
    ],
  });
  const [queued, setQueued] = useState([
    { question: 'What are the risks of using unsafe functions?', n: 4 },
    { question: 'True or false: free() always returns memory to the OS.', n: 2 },
  ]);

  useEffect(() => {
    if (!sesid) {
      if (history && history.push) history.push('/nox/professor');
      else window.location = '/nox/professor';
      return;
    }
    const socket = getSocket();
    socket.emit('joinSessionRoom', { sesid });
    const onOpen = (p) => pollOpen(p);
    const onUpdate = (p) => pollUpdate(p);
    const onClose = () => pollClose();
    socket.on('pollOpened', onOpen);
    socket.on('pollUpdate', onUpdate);
    socket.on('pollClosed', onClose);
    return () => {
      socket.off('pollOpened', onOpen);
      socket.off('pollUpdate', onUpdate);
      socket.off('pollClosed', onClose);
    };
  }, [sesid, pollOpen, pollUpdate, pollClose, history]);

  const active = poll.active;
  const secondsLeft = useTimer(active && active.expiresAt);

  const optsForBars = active && active.options
    ? active.options.map((o) => ({ label: o.label, text: o.text, votes: o.votes || 0 }))
    : composer.options.map((o) => ({ ...o, votes: 0 }));
  const total = optsForBars.reduce((s, o) => s + (o.votes || 0), 0);
  const audience = (active && active.audience) || 79;
  const leader = optsForBars.reduce((a, b) => ((a.votes || 0) >= (b.votes || 0) ? a : b), optsForBars[0]);
  const confidence = total > 0 ? Math.round(((leader.votes || 0) / total) * 100) : 0;

  const launch = () => {
    startPoll(sesid, composer.question, composer.type, composer.options);
  };
  const stop = () => {
    if (active && active.pollId) endPoll(sesid, active.pollId);
  };

  const timerLabel =
    secondsLeft != null
      ? `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')} LEFT`
      : 'OPEN';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <NoxTopBar
        height={56}
        left={
          <>
            <NoxLockup size={22} color="#fff" />
            <span className="mono" style={{ fontSize: 11, opacity: 0.5, marginLeft: 14 }}>
              {courseCode} · LIVE POLL
            </span>
          </>
        }
        right={
          <>
            <span
              className="mono"
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <IconClock size={12} /> {active ? timerLabel : 'NO ACTIVE POLL'}
            </span>
            {active ? (
              <Btn kind="danger" size="sm" icon={<IconStop size={11} />} onClick={stop}>End poll</Btn>
            ) : (
              <Btn kind="accent" size="sm" onClick={launch}>Launch poll</Btn>
            )}
          </>
        }
      />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 0, minHeight: 0 }}>
        <main style={{ padding: '28px 36px', overflow: 'auto' }}>
          <SectionLabel>Question · {composer.type === 'tf' ? 'true/false' : composer.type === 'conf' ? 'confidence' : composer.type === 'open' ? 'open-ended' : 'multiple choice'}</SectionLabel>
          {active ? (
            <h2
              className="serif"
              style={{ margin: '8px 0 22px', fontSize: 30, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.01em' }}
            >
              {active.question}
            </h2>
          ) : (
            <textarea
              value={composer.question}
              onChange={(e) => setComposer({ ...composer, question: e.target.value })}
              rows={2}
              style={{
                margin: '8px 0 22px',
                width: '100%',
                fontSize: 28,
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--ink)',
                resize: 'none',
              }}
            />
          )}

          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <SectionLabel>{active ? 'Live results' : 'Preview'}</SectionLabel>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                {total} of {audience} responded · {audience > 0 ? Math.round((total / audience) * 100) : 0}%
              </span>
            </div>
            <PollBars options={optsForBars} totalVotes={total} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 10,
                marginTop: 22,
                paddingTop: 18,
                borderTop: '1px solid var(--line-2)',
              }}
            >
              <div>
                <SectionLabel style={{ marginBottom: 4 }}>Leader</SectionLabel>
                <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>
                  {leader && leader.text ? `${leader.label}. ${leader.text}` : '—'}
                </div>
              </div>
              <div>
                <SectionLabel style={{ marginBottom: 4 }}>Confidence</SectionLabel>
                <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>{confidence}%</div>
              </div>
              <div>
                <SectionLabel style={{ marginBottom: 4 }}>Avg time</SectionLabel>
                <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>
                  {active && active.avgResponseSeconds ? `${active.avgResponseSeconds}s` : '—'}
                </div>
              </div>
            </div>
          </Card>

          {!active && (
            <div style={{ marginTop: 22 }}>
              <SectionLabel style={{ marginBottom: 10 }}>Options</SectionLabel>
              <Card style={{ padding: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {composer.options.map((o, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        className="serif"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: 'var(--paper-2)',
                          color: 'var(--ink)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontStyle: 'italic',
                          fontWeight: 600,
                        }}
                      >
                        {o.label}
                      </span>
                      <input
                        value={o.text}
                        onChange={(e) => {
                          const next = [...composer.options];
                          next[i] = { ...next[i], text: e.target.value };
                          setComposer({ ...composer, options: next });
                        }}
                        placeholder={`Option ${o.label}`}
                        style={{
                          flex: 1,
                          height: 36,
                          border: '1px solid var(--line)',
                          borderRadius: 8,
                          padding: '0 10px',
                          fontSize: 14,
                          background: '#fff',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </main>

        <aside
          style={{
            background: 'var(--bone)',
            borderLeft: '1px solid var(--line)',
            padding: '24px 24px',
            overflow: 'auto',
          }}
        >
          <SectionLabel style={{ marginBottom: 10 }}>Poll controls</SectionLabel>
          <Card style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn kind="primary" size="md" icon={<IconCheck size={13} />} disabled={!active}>
                Reveal correct answer
              </Btn>
              <Btn kind="ghost" size="md" icon={<IconClock size={13} />} disabled={!active}>
                Extend by 30s
              </Btn>
              <Btn kind="ghost" size="md" icon={<IconShare size={13} />}>Push to lecture screen</Btn>
            </div>
          </Card>

          <SectionLabel style={{ margin: '22px 0 10px' }}>Up next · queued</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {queued.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 14px',
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 6 }}>{p.question}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{p.n} options</span>
                  <Btn
                    kind="ghost"
                    size="sm"
                    onClick={() => {
                      setComposer({
                        question: p.question,
                        type: 'mc',
                        options: Array.from({ length: p.n }).map((_, idx) => ({
                          label: 'ABCDEF'[idx],
                          text: '',
                        })),
                      });
                      setQueued(queued.filter((_, j) => j !== i));
                    }}
                  >
                    Edit
                  </Btn>
                </div>
              </div>
            ))}
            <Btn
              kind="ghost"
              size="md"
              icon={<IconPlus size={13} />}
              style={{ justifyContent: 'center' }}
              onClick={() =>
                setQueued([...queued, { question: 'New question', n: composer.options.length || 4 }])
              }
            >
              New poll
            </Btn>
          </div>

          <SectionLabel style={{ margin: '22px 0 10px' }}>Templates</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => setComposer({ ...composer, type: t.type, options: t.options })}
                style={{
                  padding: '12px 12px',
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ poll: state.poll });

export default connect(mapStateToProps, { pollOpen, pollUpdate, pollClose, startPoll, endPoll })(ProfPollLive);
