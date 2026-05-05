import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Btn, NoxLockup } from '../../components/ui/primitives';
import { IconArrowR, IconQR, IconLock } from '../../components/ui/icons';
import { PublicURL } from '../../config/constants';

axios.defaults.withCredentials = true;

const StudentJoinScreen = ({ history }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const hiddenRef = useRef(null);
  const valid = code.length === 6;

  useEffect(() => {
    if (hiddenRef.current) hiddenRef.current.focus();
  }, []);

  const onChange = (e) => {
    const next = (e.target.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCode(next);
    setError(null);
  };

  const join = (override) => {
    const sesid = (override || code).toUpperCase();
    if (sesid.length !== 6) return;
    setSubmitting(true);
    axios
      .post(PublicURL + ':5001/nox/api/sessions/JoinSession', { sesid })
      .then((res) => {
        setSubmitting(false);
        if (res.data && res.data.success) {
          if (history && history.push) history.push('/nox/student');
          else window.location = '/nox/student';
        } else {
          setError("That code didn't match an active session.");
        }
      })
      .catch(() => {
        setSubmitting(false);
        setError("That code didn't match an active session.");
      });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(120% 60% at 50% 0%, rgba(30,55,101,0.06), transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          padding: '20px 22px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <NoxLockup size={26} color="var(--ink)" />
        <button
          onClick={() => (history && history.push ? history.push('/nox/login') : (window.location = '/nox/login'))}
          style={{
            background: 'transparent',
            border: '1px solid var(--line)',
            color: 'var(--ink-2)',
            height: 32,
            padding: '0 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Sign in as Professor →
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 28px',
          position: 'relative',
          maxWidth: 420,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--ink-3)',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Join a session
        </div>
        <h1
          className="serif"
          style={{ fontSize: 38, lineHeight: 1.05, margin: '0 0 8px', fontWeight: 500, letterSpacing: '-0.01em' }}
        >
          What's the<br />session code?
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5, margin: '0 0 28px', maxWidth: 280 }}>
          Your professor will share a six-character code at the start of class. No account needed.
        </p>

        <input
          ref={hiddenRef}
          value={code}
          onChange={onChange}
          autoComplete="one-time-code"
          inputMode="text"
          maxLength={6}
          aria-label="Session code"
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: 1,
            height: 1,
          }}
        />

        <div
          onClick={() => hiddenRef.current && hiddenRef.current.focus()}
          style={{ display: 'flex', gap: 8, marginBottom: 18, cursor: 'text' }}
        >
          {Array.from({ length: 6 }).map((_, i) => {
            const ch = code[i] || '';
            const isCursor = i === code.length;
            return (
              <div
                key={i}
                className="mono"
                style={{
                  flex: 1,
                  height: 62,
                  background: '#fff',
                  border: `1.5px solid ${isCursor ? 'var(--uoft-navy)' : 'var(--line)'}`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 600,
                  color: 'var(--ink)',
                  boxShadow: isCursor ? '0 0 0 4px rgba(30,55,101,0.08)' : 'var(--shadow-sm)',
                  transition: 'all .15s ease',
                }}
              >
                {ch ||
                  (isCursor ? (
                    <span
                      style={{
                        width: 1.5,
                        height: 24,
                        background: 'var(--uoft-navy)',
                        animation: 'nox-blink 1s infinite',
                      }}
                    />
                  ) : (
                    ''
                  ))}
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ fontSize: 13, color: '#8C2A1E', marginBottom: 12, textAlign: 'center' }}>{error}</div>
        )}

        <Btn
          kind={valid ? 'primary' : 'ghost'}
          size="lg"
          style={{ width: '100%', justifyContent: 'center' }}
          iconRight={<IconArrowR size={16} />}
          onClick={() => join()}
          disabled={!valid || submitting}
        >
          {submitting ? 'Joining…' : valid ? 'Join session' : 'Enter code'}
        </Btn>

        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            color: 'var(--ink-3)',
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span
            className="mono"
            style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}
          >
            or
          </span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        <button
          style={{
            marginTop: 14,
            width: '100%',
            height: 48,
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 12,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--ink)',
            cursor: 'pointer',
          }}
        >
          <IconQR size={18} /> Scan QR on the lecture screen
        </button>
      </div>

      <div style={{ padding: '0 28px 32px', textAlign: 'center', position: 'relative' }}>
        <div
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-3)' }}
          className="mono"
        >
          <IconLock size={11} /> ANONYMOUS · NO TRACKING
        </div>
      </div>
    </div>
  );
};

export default StudentJoinScreen;
