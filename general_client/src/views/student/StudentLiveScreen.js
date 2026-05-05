import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import CourseHeader from './CourseHeader';
import { Pill, SectionLabel } from '../../components/ui/primitives';
import { IconCheck, IconClock, IconClose, IconUp, IconSend } from '../../components/ui/icons';
import { getSocket } from '../../socket';
import {
  emitStudentPulse,
  emitNewQuestion,
  emitVoteQuestion,
  setQuestions,
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

const StudentLiveScreen = ({
  questions,
  setQuestions,
  addQuestion,
  updateQuestionVote,
  markQuestionAnswered,
  emitStudentPulse,
  emitNewQuestion,
  emitVoteQuestion,
  history,
}) => {
  const sid = cookies.get('sid');
  const sesid = cookies.get('sesid');
  const [pulse, setPulse] = useState(null);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const liveRef = useRef(true);

  useEffect(() => {
    if (!sid || !sesid) {
      if (history && history.push) history.push('/nox');
      else window.location = '/nox';
      return;
    }
    const socket = getSocket();
    socket.emit('joinSessionRoom', { sesid, sid });

    const onIncoming = (payload) => {
      if (!liveRef.current) return;
      const q = {
        id: payload._id || payload.id || `${payload.sid}-${payload.Time || Date.now()}`,
        text: payload.comment,
        votes: payload.votes || 0,
        mine: payload.sid === sid,
        answered: !!payload.answered,
      };
      addQuestion(q);
    };
    const onVote = (payload) => updateQuestionVote(payload.recordId || payload.id, payload.votes);
    const onAnswered = (payload) => markQuestionAnswered(payload.recordId || payload.id);

    socket.on('incomingComment', onIncoming);
    socket.on('newQuestion', onIncoming);
    socket.on('voteUpdate', onVote);
    socket.on('markAnswered', onAnswered);

    return () => {
      liveRef.current = false;
      socket.off('incomingComment', onIncoming);
      socket.off('newQuestion', onIncoming);
      socket.off('voteUpdate', onVote);
      socket.off('markAnswered', onAnswered);
    };
  }, [sesid, sid, addQuestion, updateQuestionVote, markQuestionAnswered, history]);

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

  const sortedQs = [...questions].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const onLeave = () => {
    cookies.remove('sesid', { path: '/' });
    if (history && history.push) history.push('/nox');
    else window.location = '/nox';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CourseHeader onLeave={onLeave} />

      <div
        style={{
          padding: '16px 18px 12px',
          background: 'var(--paper)',
          borderBottom: '1px solid var(--line)',
          maxWidth: 480,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <SectionLabel style={{ marginBottom: 8 }}>How are you following?</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {moods.map((m) => {
            const active = pulse === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onMood(m)}
                style={{
                  background: active ? m.color : '#fff',
                  border: `1.5px solid ${active ? m.color : 'var(--line)'}`,
                  borderRadius: 12,
                  padding: '10px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  color: active ? '#fff' : 'var(--ink)',
                  transition: 'all .15s ease',
                  cursor: 'pointer',
                  boxShadow: active ? '0 4px 12px rgba(15,23,41,0.12)' : 'none',
                  minHeight: 64,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: active ? 'rgba(255,255,255,0.25)' : m.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: active ? '#fff' : '#fff',
                  }}
                >
                  {m.id === 'good' && <IconCheck size={13} stroke={2.5} />}
                  {m.id === 'okay' && <IconClock size={13} stroke={2.5} />}
                  {m.id === 'lost' && <IconClose size={13} stroke={2.5} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '14px 18px 0',
          maxWidth: 480,
          width: '100%',
          margin: '0 auto',
          alignSelf: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionLabel>Class Questions · {questions.length}</SectionLabel>
          <span
            className="mono"
            style={{ fontSize: 10, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#3F8C42',
                boxShadow: '0 0 0 3px rgba(63,140,66,0.18)',
              }}
            />
            LIVE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
          {sortedQs.length === 0 && (
            <div
              style={{
                padding: '24px 18px',
                textAlign: 'center',
                color: 'var(--ink-3)',
                fontSize: 13,
                background: '#fff',
                border: '1px dashed var(--line)',
                borderRadius: 14,
              }}
            >
              No questions yet. Be the first to ask anonymously.
            </div>
          )}
          {sortedQs.map((q) => (
            <div
              key={q.id}
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '12px 12px 12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <button
                onClick={() => onUpvote(q)}
                aria-label={q.mine ? 'Remove upvote' : 'Upvote'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0,
                  minWidth: 44,
                  minHeight: 44,
                  padding: '6px 4px',
                  background: q.mine ? 'var(--uoft-navy)' : 'var(--paper)',
                  border: q.mine ? '1px solid var(--uoft-navy)' : '1px solid var(--line)',
                  borderRadius: 10,
                  color: q.mine ? '#fff' : 'var(--ink-2)',
                  cursor: 'pointer',
                }}
              >
                <IconUp size={14} stroke={2.4} />
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                  {q.votes || 0}
                </span>
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    color: 'var(--ink)',
                    marginBottom: q.answered || q.mine ? 6 : 0,
                  }}
                >
                  {q.text}
                </div>
                {(q.answered || q.mine) && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {q.answered && (
                      <Pill tone="good" style={{ padding: '2px 7px', fontSize: 9.5 }}>
                        <IconCheck size={9} stroke={3} /> answered
                      </Pill>
                    )}
                    {q.mine && (
                      <Pill tone="blue" style={{ padding: '2px 7px', fontSize: 9.5 }}>
                        your question
                      </Pill>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '10px 14px 14px',
          background: 'rgba(247,243,235,0.94)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '5px 5px 5px 16px',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSend();
            }}
            placeholder="Ask anonymously…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 14,
              padding: '8px 0',
              background: 'transparent',
              color: 'var(--ink)',
            }}
          />
          <button
            onClick={onSend}
            aria-label="Send question"
            disabled={!draft.length || posting}
            style={{
              width: 44,
              height: 44,
              border: 'none',
              borderRadius: '50%',
              background: draft.length ? 'var(--uoft-navy)' : 'var(--paper-2)',
              color: draft.length ? '#fff' : 'var(--ink-3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: draft.length ? 'pointer' : 'default',
              transition: 'background .15s',
            }}
          >
            <IconSend size={15} stroke={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  questions: state.questions.items,
});

export default connect(mapStateToProps, {
  setQuestions,
  addQuestion,
  updateQuestionVote,
  markQuestionAnswered,
  emitStudentPulse,
  emitNewQuestion,
  emitVoteQuestion,
})(StudentLiveScreen);
