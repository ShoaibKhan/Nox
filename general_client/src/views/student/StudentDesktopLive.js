import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Btn, NoxLockup, NoxTopBar, Pill, SectionLabel } from '../../components/ui/primitives';
import { IconCheck, IconClock, IconClose, IconSearch, IconSend, IconUp } from '../../components/ui/icons';
import { getSocket } from '../../socket';
import {
  emitStudentPulse,
  emitNewQuestion,
  emitVoteQuestion,
  addQuestion,
  updateQuestionVote,
  markQuestionAnswered,
} from '../../actions/liveActions';

const cookies = new Cookies();

const moods = [
  { id: 'good', label: 'I get it', value: 3, color: 'var(--accent-good)' },
  { id: 'okay', label: 'Slow down', value: 2, color: 'var(--accent-okay)' },
  { id: 'lost', label: "I'm lost", value: 1, color: 'var(--accent-low)' },
];

const StudentDesktopLive = ({
  questions,
  poll,
  emitStudentPulse,
  emitNewQuestion,
  emitVoteQuestion,
  addQuestion,
  updateQuestionVote,
  markQuestionAnswered,
  history,
}) => {
  const sid = cookies.get('sid');
  const sesid = cookies.get('sesid');
  const [pulse, setPulse] = useState(null);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [presence, setPresence] = useState(0);

  useEffect(() => {
    if (!sid || !sesid) {
      if (history && history.push) history.push('/nox');
      else window.location = '/nox';
      return;
    }
    const socket = getSocket();
    socket.emit('joinSessionRoom', { sesid, sid });

    const onIncoming = (payload) => {
      const q = {
        id: payload._id || payload.id || `${payload.sid}-${payload.Time || Date.now()}`,
        text: payload.comment || payload.text,
        votes: payload.votes || 0,
        mine: payload.sid === sid,
        answered: !!payload.answered,
      };
      addQuestion(q);
    };
    const onVote = (payload) => updateQuestionVote(payload.recordId || payload.id, payload.votes);
    const onAnswered = (payload) => markQuestionAnswered(payload.recordId || payload.id);
    const onPresence = (payload) => setPresence(payload.count || 0);

    socket.on('incomingComment', onIncoming);
    socket.on('newQuestion', onIncoming);
    socket.on('voteUpdate', onVote);
    socket.on('markAnswered', onAnswered);
    socket.on('presenceUpdate', onPresence);

    return () => {
      socket.off('incomingComment', onIncoming);
      socket.off('newQuestion', onIncoming);
      socket.off('voteUpdate', onVote);
      socket.off('markAnswered', onAnswered);
      socket.off('presenceUpdate', onPresence);
    };
  }, [sid, sesid, addQuestion, updateQuestionVote, markQuestionAnswered, history]);

  const onMood = (m) => {
    setPulse(m.id);
    emitStudentPulse(sesid, sid, m.value);
  };

  const onUpvote = (q) => {
    const delta = q.mine ? -1 : 1;
    emitVoteQuestion(sesid, sid, q.id, delta);
  };

  const onSend = () => {
    const text = draft.trim();
    if (!text || posting) return;
    setPosting(true);
    Promise.resolve(emitNewQuestion(sesid, sid, text))
      .catch(() => {})
      .then(() => {
        setDraft('');
        setPosting(false);
      });
  };

  const onLeave = () => {
    cookies.remove('sesid', { path: '/' });
    if (history && history.push) history.push('/nox');
    else window.location = '/nox';
  };

  const sorted = [...questions].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <NoxTopBar
        height={56}
        left={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <NoxLockup size={22} color="#fff" />
            <span className="mono" style={{ fontSize: 11, opacity: 0.6, letterSpacing: '0.16em' }}>·</span>
            <span className="mono" style={{ fontSize: 12, letterSpacing: '0.06em' }}>CSC209H5 · Week 5 — Live</span>
          </div>
        }
        center={null}
        right={
          <>
            <span
              className="mono"
              style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7BD18A' }} />
              {presence || 0} IN ROOM
            </span>
            <button
              onClick={onLeave}
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
              LEAVE
            </button>
          </>
        }
      />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 0 }}>
        <div style={{ padding: '24px 32px', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h2 className="serif" style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>
                Class questions
              </h2>
              <SectionLabel style={{ marginTop: 4 }}>Sorted by upvotes · Anonymous</SectionLabel>
            </div>
            <Btn kind="ghost" size="sm" icon={<IconSearch size={13} />}>Search</Btn>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sorted.length === 0 && (
              <div
                style={{
                  padding: '32px 18px',
                  textAlign: 'center',
                  color: 'var(--ink-3)',
                  fontSize: 14,
                  background: '#fff',
                  border: '1px dashed var(--line)',
                  borderRadius: 14,
                }}
              >
                No questions yet — be the first.
              </div>
            )}
            {sorted.map((q) => (
              <div
                key={q.id}
                style={{
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <button
                  onClick={() => onUpvote(q)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 50,
                    padding: '8px 6px',
                    background: q.mine ? 'var(--uoft-navy)' : 'var(--paper)',
                    border: q.mine ? '1px solid var(--uoft-navy)' : '1px solid var(--line)',
                    borderRadius: 10,
                    color: q.mine ? '#fff' : 'var(--ink-2)',
                    cursor: 'pointer',
                  }}
                >
                  <IconUp size={15} stroke={2.4} />
                  <span className="mono" style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{q.votes || 0}</span>
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, lineHeight: 1.45, color: 'var(--ink)', marginBottom: 6 }}>{q.text}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {q.answered && (
                      <Pill tone="good" style={{ fontSize: 10 }}>
                        <IconCheck size={9} stroke={3} /> answered live
                      </Pill>
                    )}
                    {q.mine && (
                      <Pill tone="blue" style={{ fontSize: 10 }}>your question</Pill>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <SectionLabel style={{ marginBottom: 6 }}>Ask anonymously</SectionLabel>
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '14px 14px 12px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, 240))}
                placeholder="What's not landing?  Type a question…"
                rows={2}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  color: 'var(--ink)',
                  background: 'transparent',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{draft.length}/240</span>
                <Btn size="sm" iconRight={<IconSend size={12} />} onClick={onSend} disabled={!draft.length || posting}>
                  Post
                </Btn>
              </div>
            </div>
          </div>
        </div>

        <aside
          style={{
            background: 'var(--bone)',
            borderLeft: '1px solid var(--line)',
            padding: '24px 22px',
            overflow: 'auto',
          }}
        >
          <SectionLabel>Your understanding</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {moods.map((m) => {
              const active = pulse === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onMood(m)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    background: active ? m.color : '#fff',
                    border: `1.5px solid ${active ? m.color : 'var(--line)'}`,
                    color: active ? '#fff' : 'var(--ink)',
                    textAlign: 'left',
                    boxShadow: active ? '0 6px 18px rgba(15,23,41,0.12)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: active ? 'rgba(255,255,255,0.3)' : m.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    {m.id === 'good' && <IconCheck size={14} stroke={2.5} />}
                    {m.id === 'okay' && <IconClock size={14} stroke={2.5} />}
                    {m.id === 'lost' && <IconClose size={14} stroke={2.5} />}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 24,
              padding: '14px 14px',
              borderRadius: 12,
              border: '1px dashed var(--line)',
              background: '#fff',
            }}
          >
            <SectionLabel style={{ marginBottom: 6 }}>Live poll</SectionLabel>
            {poll.active ? (
              <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>
                {poll.active.question}
                <div className="mono" style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-3)' }}>
                  Open the live poll on your phone to vote.
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 10, lineHeight: 1.4 }}>
                  No active poll. The professor will start one when needed.
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-3)', fontSize: 11 }}
                  className="mono"
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-3)' }} />
                  WAITING
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <SectionLabel style={{ marginBottom: 8 }}>Recent answers</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {questions.filter((q) => q.answered && q.reply).slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: '10px 12px',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 4, fontStyle: 'italic' }}>{r.text}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.45 }}>{r.reply}</div>
                </div>
              ))}
              {!questions.some((q) => q.answered && q.reply) && (
                <div
                  style={{
                    padding: '10px 12px',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    fontSize: 12,
                    color: 'var(--ink-3)',
                  }}
                >
                  Replies from the professor will appear here.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  questions: state.questions.items,
  poll: state.poll,
});

export default connect(mapStateToProps, {
  emitStudentPulse,
  emitNewQuestion,
  emitVoteQuestion,
  addQuestion,
  updateQuestionVote,
  markQuestionAnswered,
})(StudentDesktopLive);
