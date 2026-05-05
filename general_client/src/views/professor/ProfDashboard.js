import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  Btn,
  Card,
  Dot,
  NoxLockup,
  NoxTopBar,
  Pill,
  PulseLine,
  SectionLabel,
} from '../../components/ui/primitives';
import {
  IconBolt,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconHand,
  IconMessage,
  IconPoll,
  IconQR,
  IconShare,
  IconSparkle,
  IconUsers,
} from '../../components/ui/icons';
import { getSocket } from '../../socket';
import {
  pulseTick,
  pulseDist,
  addQuestion,
  setQuestions,
  updateQuestionVote,
  markQuestionAnswered,
  emitMarkAnswered,
} from '../../actions/liveActions';

const cookies = new Cookies();

const ProfDashboard = ({
  pulseValues,
  pulseDistribution,
  questions,
  pulseTick,
  pulseDist,
  addQuestion,
  setQuestions,
  updateQuestionVote,
  markQuestionAnswered,
  emitMarkAnswered,
  history,
}) => {
  const sesid = cookies.get('Prof_sesid');
  const courseCode = cookies.get('Prof_courseCode') || 'CSC209H5';
  const [presence, setPresence] = useState(0);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    if (!sesid) {
      if (history && history.push) history.push('/nox/professor');
      else window.location = '/nox/professor';
      return;
    }
    const socket = getSocket();
    socket.emit('proffesorSocket', { sesid, socketID: socket.id });
    socket.emit('joinSessionRoom', { sesid });

    const onTick = (payload) => {
      pulseTick(payload.average);
      pulseDist({ good: payload.goodStudents, okay: payload.okayStudents, lost: payload.confusedStudents });
      if (typeof payload.totalStudents === 'number') setPresence(payload.totalStudents);
    };
    const onIncoming = (payload) => {
      const q = {
        id: payload._id || payload.id || `${payload.sid}-${payload.Time || Date.now()}`,
        text: payload.comment,
        votes: payload.votes || 0,
        answered: !!payload.answered,
        t: 'just now',
      };
      addQuestion(q);
      setRecentEvents((evs) => [{ t: 'New question', s: 'just now', i: 'msg' }, ...evs].slice(0, 6));
    };
    const onVote = (payload) => updateQuestionVote(payload.recordId || payload.id, payload.votes);
    const onAnswered = (payload) => markQuestionAnswered(payload.recordId || payload.id);
    const onPresence = (payload) => setPresence(payload.count || 0);

    socket.on('pulseTick', onTick);
    socket.on('Data', onTick);
    socket.on('incomingComment', onIncoming);
    socket.on('newQuestion', onIncoming);
    socket.on('voteUpdate', onVote);
    socket.on('markAnswered', onAnswered);
    socket.on('presenceUpdate', onPresence);

    return () => {
      socket.off('pulseTick', onTick);
      socket.off('Data', onTick);
      socket.off('incomingComment', onIncoming);
      socket.off('newQuestion', onIncoming);
      socket.off('voteUpdate', onVote);
      socket.off('markAnswered', onAnswered);
      socket.off('presenceUpdate', onPresence);
    };
  }, [
    sesid,
    pulseTick,
    pulseDist,
    addQuestion,
    setQuestions,
    updateQuestionVote,
    markQuestionAnswered,
    history,
  ]);

  const dist = pulseDistribution || { good: 0, okay: 0, lost: 0 };
  const total = (dist.good || 0) + (dist.okay || 0) + (dist.lost || 0);

  const last30s = pulseValues.slice(-30);
  const recentAvg =
    last30s.length > 0 ? last30s.reduce((s, v) => s + v, 0) / last30s.length : null;
  const showAlert = !alertDismissed && recentAvg != null && recentAvg < 1.8;

  const livePulse = pulseValues.length > 0 ? pulseValues : [2.5, 2.6, 2.4, 2.7, 2.5, 2.4, 2.5];
  const liveAvg = pulseValues.length > 0 ? pulseValues[pulseValues.length - 1].toFixed(1) : '—';

  const sortedQs = [...questions].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const lostCount = dist.lost || 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <NoxTopBar
        height={56}
        left={
          <>
            <NoxLockup size={22} color="#fff" />
            <span className="mono" style={{ fontSize: 11, opacity: 0.5, marginLeft: 14 }}>
              {courseCode} · LIVE
            </span>
          </>
        }
        center={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '4px 6px 4px 12px',
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.14em' }}
            >
              SESSION CODE
            </span>
            <span className="mono" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.18em' }}>
              {sesid || '——————'}
            </span>
            <button
              onClick={() => sesid && navigator.clipboard && navigator.clipboard.writeText(sesid)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: 28,
                height: 28,
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IconCopy size={12} stroke={2} />
            </button>
          </div>
        }
        right={
          <>
            <span
              className="mono"
              style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <IconUsers size={12} /> {presence} PRESENT
            </span>
            <Btn
              kind="accent"
              size="sm"
              icon={<IconPoll size={13} />}
              onClick={() => (history && history.push ? history.push('/nox/professor/poll') : (window.location = '/nox/professor/poll'))}
            >
              Start poll
            </Btn>
            <button
              onClick={() => {
                cookies.remove('Prof_sesid', { path: '/' });
                if (history && history.push) history.push('/nox/professor');
                else window.location = '/nox/professor';
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                height: 30,
                padding: '0 12px',
                borderRadius: 8,
                fontSize: 11,
                cursor: 'pointer',
              }}
              className="mono"
            >
              END SESSION
            </button>
          </>
        }
      />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 0 }}>
        <main style={{ padding: '24px 30px', overflow: 'auto' }}>
          <Card style={{ padding: '20px 24px', marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8, gap: 12, flexWrap: 'wrap' }}>
              <div>
                <SectionLabel>Live understanding · last {Math.min(pulseValues.length, 60)}s</SectionLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 6 }}>
                  <span className="serif" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1 }}>{liveAvg}</span>
                  <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>/ 3.0 — live</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Pill tone="good"><Dot color="var(--accent-good)" />good {dist.good || 0}</Pill>
                <Pill tone="okay"><Dot color="var(--accent-okay)" />okay {dist.okay || 0}</Pill>
                <Pill tone="low"><Dot color="var(--accent-low)" />lost {dist.lost || 0}</Pill>
              </div>
            </div>
            <PulseLine
              values={livePulse}
              width={760}
              height={120}
              strokeColor="var(--uoft-navy)"
              fillColor="rgba(74,111,165,0.14)"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>live</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>now</span>
            </div>
            {showAlert && (
              <div
                style={{
                  marginTop: 14,
                  padding: '10px 12px',
                  background: 'rgba(214,87,69,0.08)',
                  border: '1px solid rgba(214,87,69,0.25)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <IconBolt size={14} style={{ color: '#8C2A1E' }} />
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>
                  <strong>Heads up —</strong> {lostCount} students are lost in the last 30 seconds. Consider pausing on the current concept.
                </span>
                <Btn kind="ghost" size="sm" style={{ marginLeft: 'auto' }} onClick={() => setAlertDismissed(true)}>
                  Dismiss
                </Btn>
              </div>
            )}
          </Card>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <h3 className="serif" style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Top questions</h3>
              <SectionLabel style={{ marginTop: 2 }}>Sorted by upvotes · tap to mark answered</SectionLabel>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Pill tone="bone">All · {questions.length}</Pill>
              <Pill tone="paper">Unanswered · {questions.filter((q) => !q.answered).length}</Pill>
            </div>
          </div>

          <Card>
            {sortedQs.length === 0 && (
              <div style={{ padding: '28px 18px', color: 'var(--ink-3)', fontSize: 13 }}>
                Questions from the room appear here as students post them.
              </div>
            )}
            {sortedQs.map((q, i) => {
              const trending = (q.votes || 0) >= 30;
              return (
                <div
                  key={q.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '48px 1fr auto',
                    gap: 14,
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: i < sortedQs.length - 1 ? '1px solid var(--line-2)' : 'none',
                    background: trending ? 'rgba(200,162,75,0.06)' : 'transparent',
                  }}
                >
                  <div
                    className="serif"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: 'var(--paper-2)',
                      color: 'var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {q.votes || 0}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, lineHeight: 1.4 }}>
                      {q.text}
                      {trending && (
                        <Pill tone="okay" style={{ marginLeft: 10, fontSize: 9.5, padding: '2px 7px' }}>
                          <IconSparkle size={9} stroke={2.5} /> trending
                        </Pill>
                      )}
                      {q.answered && (
                        <Pill tone="good" style={{ marginLeft: 10, fontSize: 9.5, padding: '2px 7px' }}>
                          <IconCheck size={9} stroke={3} /> answered
                        </Pill>
                      )}
                    </div>
                    <span
                      className="mono"
                      style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3, display: 'inline-block' }}
                    >
                      {q.t || 'just now'} · anonymous
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!q.answered && (
                      <Btn
                        kind="ghost"
                        size="sm"
                        icon={<IconCheck size={12} stroke={2.5} />}
                        onClick={() => emitMarkAnswered(sesid, q.id)}
                      >
                        Mark answered
                      </Btn>
                    )}
                    <Btn kind="light" size="sm" icon={<IconMessage size={12} />}>Reply</Btn>
                  </div>
                </div>
              );
            })}
          </Card>
        </main>

        <aside
          style={{
            borderLeft: '1px solid var(--line)',
            background: 'var(--bone)',
            padding: '22px 22px',
            overflow: 'auto',
          }}
        >
          <SectionLabel style={{ marginBottom: 10 }}>Quick actions</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22 }}>
            <Btn kind="light" size="md" icon={<IconPoll size={14} />}
              onClick={() => (history && history.push ? history.push('/nox/professor/poll') : (window.location = '/nox/professor/poll'))}
            >
              Quick poll
            </Btn>
            <Btn kind="light" size="md" icon={<IconHand size={14} />}>Pause check</Btn>
            <Btn kind="light" size="md" icon={<IconQR size={14} />}>Show QR</Btn>
            <Btn kind="light" size="md" icon={<IconShare size={14} />}>Share code</Btn>
          </div>

          <SectionLabel style={{ marginBottom: 10 }}>Distribution · now</SectionLabel>
          <Card style={{ padding: 14, marginBottom: 18 }}>
            {[
              { l: 'Good', v: dist.good || 0, c: 'var(--accent-good)' },
              { l: 'Okay', v: dist.okay || 0, c: 'var(--accent-okay)' },
              { l: 'Lost', v: dist.lost || 0, c: 'var(--accent-low)' },
            ].map((r, i) => {
              const pct = total > 0 ? Math.round((r.v / total) * 100) : 0;
              return (
                <div key={i} style={{ marginBottom: i < 2 ? 10 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Dot color={r.c} /> {r.l}
                    </span>
                    <span className="mono">{r.v} · {pct}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--paper-2)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: r.c, borderRadius: 4, transition: 'width .4s ease' }} />
                  </div>
                </div>
              );
            })}
          </Card>

          <SectionLabel style={{ marginBottom: 10 }}>Recent activity</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(recentEvents.length === 0
              ? [{ t: 'Session started', s: 'just now', i: 'cal' }]
              : recentEvents
            ).map((e, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '10px 12px',
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: 'var(--paper)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--ink-2)',
                  }}
                >
                  {e.i === 'msg' ? <IconMessage size={13} /> : e.i === 'poll' ? <IconPoll size={13} /> : e.i === 'bolt' ? <IconBolt size={13} /> : <IconCalendar size={13} />}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--ink)' }}>{e.t}</div>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{e.s}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  pulseValues: state.pulse.values,
  pulseDistribution: state.pulse.dist,
  questions: state.questions.items,
});

export default connect(mapStateToProps, {
  pulseTick,
  pulseDist,
  addQuestion,
  setQuestions,
  updateQuestionVote,
  markQuestionAnswered,
  emitMarkAnswered,
})(ProfDashboard);
