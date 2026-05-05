import React, { useState } from 'react';
import axios from 'axios';
import { PublicURL } from '../../config/constants';

axios.defaults.withCredentials = true;

const UoftCrest = ({ size = 44 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 60 70" fill="none">
    <path d="M30 4 L54 12 V36 C54 52 42 62 30 66 C18 62 6 52 6 36 V12 Z" fill="#0F2D52" stroke="#0F2D52" />
    <path d="M30 6 L52 13.5 V36 C52 50.5 41 60 30 64 C19 60 8 50.5 8 36 V13.5 Z" fill="#fff" />
    <path d="M30 9 L50 15.5 V36 C50 49 40 57.5 30 61 C20 57.5 10 49 10 36 V15.5 Z" fill="#0F2D52" />
    <rect x="18" y="22" width="24" height="14" fill="#fff" />
    <line x1="30" y1="22" x2="30" y2="36" stroke="#0F2D52" strokeWidth="1.2" />
    <path d="M18 22 Q14 22 14 26 V36 Q18 36 18 36" fill="#fff" stroke="#0F2D52" strokeWidth="0.8" />
    <path d="M42 22 Q46 22 46 26 V36 Q42 36 42 36" fill="#fff" stroke="#0F2D52" strokeWidth="0.8" />
    <path d="M14 42 L46 42 L42 50 L18 50 Z" fill="#fff" stroke="#0F2D52" strokeWidth="0.8" />
    <text x="30" y="48" textAnchor="middle" fontSize="3.5" fill="#0F2D52" fontFamily="serif">VELUT ARBOR AEVO</text>
    <path d="M22 14 Q30 8 38 14" stroke="#fff" strokeWidth="1" fill="none" />
    <circle cx="30" cy="13" r="1.5" fill="#fff" />
  </svg>
);

const UoftAuthScreen = ({ history }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState('protect');
  const [error, setError] = useState(null);
  const tabs = [
    { k: 'protect', label: 'Protect Your Account' },
    { k: 'what',    label: 'What is weblogin?' },
    { k: 'need',    label: 'Need a UTORid?' },
    { k: 'logout',  label: 'How to Log Out' },
    { k: 'forgot',  label: 'Forgotten Password' },
    { k: 'login',   label: 'Login Problems' },
    { k: 'help',    label: 'Finding Help' },
    { k: 'email',   label: 'Protect Your Email' },
  ];

  const onSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!id.trim()) return;
    setError(null);
    axios
      .post(PublicURL + ':5001/nox/api/professor/login', { utorid: id, password: pw })
      .then((res) => {
        if (res.data && res.data.success) {
          if (history && history.push) history.push('/nox/professor');
          else window.location = '/nox/professor';
        } else {
          setError('Invalid UTORid or password.');
        }
      })
      .catch(() => setError('Login failed. Please try again.'));
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#fff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#222',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '18px 60px 12px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <UoftCrest size={40} />
        <div style={{ lineHeight: 1.05 }}>
          <div style={{ fontFamily: 'Garamond, "Times New Roman", serif', fontSize: 13, color: '#1B2D52', letterSpacing: '0.06em' }}>UNIVERSITY OF</div>
          <div style={{ fontFamily: 'Garamond, "Times New Roman", serif', fontSize: 30, color: '#1B2D52', letterSpacing: '0.02em', fontWeight: 600 }}>TORONTO</div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(to right,#1B2D52,#3A5790)', color: '#fff', padding: '10px 60px', fontSize: 13, fontWeight: 500 }}>weblogin</div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 200px', gap: 0, padding: '18px 60px 30px', flex: 1, minHeight: 0 }}>
        <div style={{ padding: '0 18px 0 0' }}>
          <div style={{ display: 'flex', height: 5, marginBottom: 10 }}>
            <div style={{ flex: 1, background: '#9CC4D8' }} />
            <div style={{ flex: 1, background: '#E0C25F' }} />
            <div style={{ flex: 1, background: '#3F8C42' }} />
            <div style={{ flex: 1, background: '#A85B81' }} />
            <div style={{ flex: 1, background: '#1B2D52' }} />
          </div>
          <div style={{ fontSize: 11, color: '#A85B81', marginBottom: 10 }}>Please log in to identify yourself.</div>
          <form onSubmit={onSubmit}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>UTORid / JOINid</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoFocus
              style={{ width: '100%', height: 28, padding: '2px 6px', border: '1px solid #b8b8b8', fontSize: 13, marginBottom: 10 }}
            />
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Password</label>
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              type="password"
              style={{ width: '100%', height: 28, padding: '2px 6px', border: '1px solid #b8b8b8', fontSize: 13, marginBottom: 14 }}
            />
            <button
              type="submit"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#3A8FCB', color: '#fff', border: 'none', padding: '7px 13px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Log in
              <span style={{ display: 'inline-flex', width: 16, height: 16, borderRadius: '50%', background: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#3A8FCB" strokeWidth="3"><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>
              </span>
            </button>
          </form>
          {error && <div style={{ marginTop: 10, color: '#B23A2A', fontSize: 11 }}>{error}</div>}
          <div style={{ marginTop: 8 }}><a href="#forgotten" style={{ fontSize: 11, color: '#3A8FCB', textDecoration: 'underline' }}>Forgotten Password?</a></div>
          <div style={{ marginTop: 18, padding: '8px 10px', background: '#FBE4DD', border: '1px solid #E8B7A8', fontSize: 11, color: '#7a2d1a' }}>
            <strong>Alert:</strong> Completely exit your web browser when you are finished.
          </div>
        </div>

        <div style={{ padding: '0 30px', borderLeft: '1px solid #e8e8e8' }}>
          <h3 style={{ margin: '0 0 14px', color: '#1B2D52', fontSize: 17, fontWeight: 600 }}>Steps you can take to protect your account:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 12.5, color: '#222', lineHeight: 1.55 }}>
            <li style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, marginTop: 2, width: 16, height: 16, borderRadius: '50%', background: '#3F8C42', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="4 12 10 18 20 6" /></svg>
              </span>
              <span>
                Before you begin, make sure the weblogin page (URL) starts with: <a href="#weblogin" style={{ color: '#3A8FCB' }}>https://weblogin.utoronto.ca/...</a>
              </span>
            </li>
            <li style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, marginTop: 2, width: 16, height: 16, borderRadius: '50%', background: '#3F8C42', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="4 12 10 18 20 6" /></svg>
              </span>
              <div>
                <div style={{ marginBottom: 6 }}>Check your browser for a valid University of Toronto security certificate:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="#1A6FBC" /><text x="11" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="serif">e</text></svg>
                  <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="#E66020" /><path d="M11 4 Q15 6 16 11 Q15 15 11 16 Q7 15 6 11 Q7 6 11 4Z" fill="#FBBE3D" /></svg>
                  <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="#fff" /><circle cx="11" cy="11" r="9" fill="none" stroke="#DD4B39" strokeWidth="3" /><circle cx="11" cy="11" r="4" fill="#1A6FBC" /></svg>
                  <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="#1A6FBC" /><polygon points="11,5 13,11 11,17 9,11" fill="#fff" /></svg>
                  <span style={{ fontSize: 11, color: '#A85B81' }}>← Select your browser to see how</span>
                </div>
              </div>
            </li>
            <li style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, marginTop: 2, width: 16, height: 16, borderRadius: '50%', background: '#3F8C42', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="4 12 10 18 20 6" /></svg>
              </span>
              <span>
                When using a public computer, <a href="#close" style={{ color: '#3A8FCB' }}>close all windows</a> and exit the browser.
              </span>
            </li>
            <li style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, marginTop: 2, width: 16, height: 16, borderRadius: '50%', background: '#3F8C42', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="4 12 10 18 20 6" /></svg>
              </span>
              <div>
                <div>Keep your password a secret at all times.</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>
                  Tip: U of T will <strong style={{ color: '#B23A2A' }}>never</strong> ask for your password or other personal information by e-mail.
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: 8 }}>
          {tabs.map((t) => {
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                style={{
                  background: active ? '#1B6FB5' : '#fff',
                  color: active ? '#fff' : '#1B2D52',
                  border: '1px solid #c8d6dc',
                  borderBottom: 'none',
                  padding: '7px 10px',
                  fontSize: 11.5,
                  fontWeight: active ? 600 : 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {active && <span style={{ fontSize: 10 }}>◀</span>}
                {t.label}
              </button>
            );
          })}
          <div style={{ borderBottom: '1px solid #c8d6dc' }} />
        </div>
      </div>

      <div style={{ padding: '10px 60px', borderTop: '1px solid #e1e1e1', background: '#fff', fontSize: 11, color: '#666', textAlign: 'right' }}>
        <a href="#feedback" style={{ color: '#3A8FCB' }}>Site Feedback</a> &nbsp;
        <a href="#a11y" style={{ color: '#3A8FCB' }}>Accessibility</a> &nbsp; © University of Toronto
      </div>
    </div>
  );
};

export default UoftAuthScreen;
