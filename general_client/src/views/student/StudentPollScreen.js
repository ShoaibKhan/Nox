import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import CourseHeader from './CourseHeader';
import { Pill } from '../../components/ui/primitives';
import { IconBolt, IconCheck, IconUsers } from '../../components/ui/icons';
import { getSocket } from '../../socket';
import { pollOpen, pollUpdate, pollClose, submitPollVote } from '../../actions/liveActions';

const cookies = new Cookies();

const StudentPollScreen = ({ poll, pollOpen, pollUpdate, pollClose, submitPollVote, history }) => {
  const sid = cookies.get('sid');
  const sesid = cookies.get('sesid');
  const [secondsLeft, setSecondsLeft] = useState(null);
  const active = poll.active;
  const showResults = !!poll.myVote || poll.closed;
  const myVote = poll.myVote;

  useEffect(() => {
    if (!sid || !sesid) {
      if (history && history.push) history.push('/nox');
      else window.location = '/nox';
      return;
    }
    const socket = getSocket();
    socket.emit('joinSessionRoom', { sesid, sid });

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
  }, [sid, sesid, pollOpen, pollUpdate, pollClose, history]);

  const expiresAt = active && active.expiresAt;
  useEffect(() => {
    if (!expiresAt) return undefined;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const onPick = (optionId) => {
    if (myVote || poll.closed) return;
    submitPollVote(sesid, sid, active.pollId, optionId);
  };

  if (!active) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
        <CourseHeader meta="Week 5 · Live Poll" />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 28px',
            textAlign: 'center',
            color: 'var(--ink-3)',
          }}
        >
          <div>
            <div className="serif" style={{ fontSize: 22, color: 'var(--ink-2)', marginBottom: 8 }}>No active poll.</div>
            <div style={{ fontSize: 13 }}>Your professor will start one when needed.</div>
          </div>
        </div>
      </div>
    );
  }

  const opts = active.options || [];
  const total = opts.reduce((s, o) => s + (o.votes || 0), 0);
  const max = Math.max(1, ...opts.map((o) => o.votes || 0));
  const watchingCount = active.watching || 0;
  const timerLabel =
    secondsLeft != null ? `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')} LEFT` : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <CourseHeader meta="Week 5 · Live Poll" />

      <div style={{ padding: '18px 18px 12px', maxWidth: 480, width: '100%', margin: '0 auto' }}>
        <Pill tone="navy" style={{ marginBottom: 10 }}>
          <IconBolt size={11} /> POLL{timerLabel ? ` · ${timerLabel}` : ''}
        </Pill>
        <h2 className="serif" style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 500, lineHeight: 1.25 }}>
          {active.question}
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>Pick one. Your vote stays anonymous.</p>
      </div>

      <div style={{ flex: 1, padding: '8px 18px', overflow: 'auto', maxWidth: 480, width: '100%', margin: '0 auto', alignSelf: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {opts.map((o) => {
            const isPicked = myVote === o.id;
            const pct = total > 0 ? Math.round(((o.votes || 0) / total) * 100) : 0;
            const isLead = (o.votes || 0) === max && (o.votes || 0) > 0;
            return (
              <button
                key={o.id}
                onClick={() => onPick(o.id)}
                style={{
                  position: 'relative',
                  padding: '14px 14px',
                  textAlign: 'left',
                  background: '#fff',
                  border: isPicked ? '2px solid var(--uoft-navy)' : '1.5px solid var(--line)',
                  borderRadius: 14,
                  boxShadow: isPicked ? '0 6px 18px rgba(30,55,101,0.18)' : 'var(--shadow-sm)',
                  cursor: myVote || poll.closed ? 'default' : 'pointer',
                  overflow: 'hidden',
                  minHeight: 60,
                  width: '100%',
                }}
              >
                {showResults && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isLead ? 'rgba(30,55,101,0.10)' : 'rgba(113,150,199,0.10)',
                      width: `${pct}%`,
                      transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
                    }}
                  />
                )}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    className="serif"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: isPicked ? 'var(--uoft-navy)' : 'var(--paper-2)',
                      color: isPicked ? '#fff' : 'var(--ink-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      fontWeight: 600,
                      fontStyle: 'italic',
                      flexShrink: 0,
                    }}
                  >
                    {o.label}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>{o.text}</div>
                    {showResults && (
                      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>
                        {o.votes || 0} votes · {pct}%
                      </div>
                    )}
                  </div>
                  {isPicked && <IconCheck size={20} stroke={2.4} style={{ color: 'var(--uoft-navy)' }} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          padding: '10px 18px 16px',
          background: 'rgba(247,243,235,0.94)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 11, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <IconUsers size={12} /> {total} voted · {watchingCount} watching
          </span>
          {showResults ? (
            <Pill tone="good">
              <IconCheck size={10} stroke={3} /> {poll.closed ? 'POLL CLOSED' : 'VOTE LOCKED IN'}
            </Pill>
          ) : (
            <Pill tone="paper">tap to vote</Pill>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ poll: state.poll });

export default connect(mapStateToProps, { pollOpen, pollUpdate, pollClose, submitPollVote })(StudentPollScreen);
