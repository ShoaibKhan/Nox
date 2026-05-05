import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Btn, Card, NoxLockup, NoxTopBar, Pill, PulseLine, SectionLabel } from '../../components/ui/primitives';
import {
  IconArrowR,
  IconBolt,
  IconCalendar,
  IconDownload,
  IconPlus,
} from '../../components/ui/icons';
import { PublicURL } from '../../config/constants';
import { getCourses, addCourse } from '../../actions/sessionActions';

const cookies = new Cookies();

const courseColors = ['var(--uoft-navy)', '#4A6FA5', '#7196C7', '#B58F47', '#5A6478'];

const formatPid = (pid) => (pid ? pid.toUpperCase().slice(0, 2) : 'PR');

axios.defaults.withCredentials = true;

const ProfSessions = ({ courses, getCourses, history }) => {
  const pid = cookies.get('pid') || 'dev';
  const [sel, setSel] = useState(null);
  const [sessionsByCourse, setSessionsByCourse] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getCourses(pid);
  }, [pid, getCourses]);

  useEffect(() => {
    if (courses && courses.length && !sel) setSel(courses[0]);
  }, [courses, sel]);

  useEffect(() => {
    if (!sel) return;
    axios
      .get(PublicURL + ':5001/nox/api/sessions/ByCourse', { params: { courseCode: sel } })
      .then((res) => {
        setSessionsByCourse((prev) => ({ ...prev, [sel]: Array.isArray(res.data) ? res.data : [] }));
      })
      .catch(() => {
        setSessionsByCourse((prev) => ({ ...prev, [sel]: [] }));
      });
  }, [sel]);

  const courseList = (courses && courses.length ? courses : []).map((c, i) => ({
    code: typeof c === 'string' ? c : c.courseCode || c.code || c,
    title: typeof c === 'string' ? '' : c.title || '',
    term: 'Winter 2026',
    sessions: 0,
    students: 0,
    color: courseColors[i % courseColors.length],
  }));

  const fallbackCourses = [
    { code: 'CSC209', title: 'Software Tools and Systems Programming', term: 'Winter 2026', sessions: 14, students: 184, color: 'var(--uoft-navy)' },
    { code: 'CSC369', title: 'Operating Systems',                       term: 'Winter 2026', sessions: 9,  students: 122, color: '#4A6FA5' },
    { code: 'CSC373', title: 'Algorithm Design and Analysis',           term: 'Winter 2026', sessions: 7,  students: 96,  color: '#7196C7' },
  ];

  const list = courseList.length > 0 ? courseList : fallbackCourses;
  const selected = list.find((c) => c.code === sel) || list[0];
  const sessions = sessionsByCourse[selected ? selected.code : ''] || [];

  const startSession = () => {
    if (creating || !selected) return;
    setCreating(true);
    const sesid = Math.random().toString(36).slice(2, 8).toUpperCase();
    axios
      .post(PublicURL + ':5001/nox/api/sessions', { sesid, courseCode: selected.code })
      .then((res) => {
        const newSesid = (res.data && res.data.sesid) || sesid;
        cookies.set('Prof_sesid', newSesid, { path: '/' });
        cookies.set('Prof_courseCode', selected.code, { path: '/' });
        if (history && history.push) history.push('/nox/professor/dashboard');
        else window.location = '/nox/professor/dashboard';
      })
      .catch(() => setCreating(false));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <NoxTopBar
        height={58}
        left={
          <>
            <NoxLockup size={22} color="#fff" />
            <span className="mono" style={{ fontSize: 11, opacity: 0.5, marginLeft: 14 }}>FOR PROFESSORS</span>
          </>
        }
        right={
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)' }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#7196C7',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                {formatPid(pid)}
              </span>
              <span style={{ fontSize: 13 }}>Prof. {pid}</span>
            </span>
            <button
              onClick={() => {
                cookies.remove('pid', { path: '/' });
                if (history && history.push) history.push('/nox/login');
                else window.location = '/nox/login';
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
              LOG OUT
            </button>
          </>
        }
      />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: 0 }}>
        <aside
          style={{
            borderRight: '1px solid var(--line)',
            background: 'var(--bone)',
            padding: '24px 18px',
            overflow: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <SectionLabel>Your courses</SectionLabel>
            <Btn kind="ghost" size="sm" icon={<IconPlus size={12} />}>Add</Btn>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {list.map((c) => {
              const active = sel === c.code || (!sel && list[0].code === c.code);
              return (
                <button
                  key={c.code}
                  onClick={() => setSel(c.code)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 14px',
                    background: active ? '#fff' : 'transparent',
                    border: `1px solid ${active ? 'var(--line)' : 'transparent'}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                    boxShadow: active ? 'var(--shadow-sm)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 6, height: 28, borderRadius: 3, background: c.color }} />
                    <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{c.code}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', marginLeft: 16 }}>{c.title}</div>
                  <div
                    className="mono"
                    style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 16, letterSpacing: '0.08em' }}
                  >
                    {c.sessions} sessions · {c.students} students
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main style={{ padding: '28px 36px', overflow: 'auto' }}>
          <SectionLabel>{selected ? selected.term : ''}</SectionLabel>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: 6,
              marginBottom: 22,
              gap: 16,
            }}
          >
            <div>
              <h1
                className="serif"
                style={{ margin: 0, fontSize: 36, fontWeight: 500, letterSpacing: '-0.01em' }}
              >
                {selected ? `${selected.code} · ${selected.title}` : ''}
              </h1>
              <p style={{ margin: '6px 0 0', color: 'var(--ink-3)', fontSize: 14 }}>
                Lecture sessions and class feedback at a glance.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn kind="ghost" size="md" icon={<IconCalendar size={14} />}>Schedule</Btn>
              <Btn kind="primary" size="md" icon={<IconBolt size={14} />} onClick={startSession} disabled={creating}>
                {creating ? 'Starting…' : 'Start session'}
              </Btn>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { k: 'Avg understanding', v: '2.5', s: '/3 across term' },
              { k: 'Questions asked', v: '164', s: 'last 5 sessions' },
              { k: 'Poll responses', v: '1,422', s: 'avg 87% turnout' },
              { k: 'Students reached', v: String(selected ? selected.students : 184), s: 'enrolled this term' },
            ].map((s, i) => (
              <Card key={i} style={{ padding: '14px 16px' }}>
                <SectionLabel style={{ marginBottom: 6, fontSize: 10 }}>{s.k}</SectionLabel>
                <div className="serif" style={{ fontSize: 30, fontWeight: 500, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 5 }}>{s.s}</div>
              </Card>
            ))}
          </div>

          <SectionLabel style={{ marginBottom: 10 }}>Sessions</SectionLabel>
          <Card>
            {sessions.length === 0 && (
              <div style={{ padding: '24px 18px', color: 'var(--ink-3)', fontSize: 13 }}>
                No sessions yet for this course. Press “Start session” to launch your first one.
              </div>
            )}
            {sessions.map((s, i) => {
              const live = s.state === 'live';
              return (
                <div
                  key={s._id || s.sesid || i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px 100px 100px 110px',
                    gap: 14,
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderBottom: i < sessions.length - 1 ? '1px solid var(--line-2)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {s.wk || `Session ${i + 1}`}
                      {live && (
                        <Pill tone="low" style={{ marginLeft: 8, padding: '2px 7px', fontSize: 9.5 }}>
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: '#B23A2A',
                              boxShadow: '0 0 0 3px rgba(178,58,42,0.18)',
                            }}
                          />{' '}
                          LIVE NOW
                        </Pill>
                      )}
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                      {s.date || s.dateStart || ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <PulseLine
                      values={s.pulseSamples || [2, 2.2, 2.5, 2.4, 2.7, 2.6, 2.4, 2.3, 2.5, 2.6, 2.5, s.avg || 2.5]}
                      width={120}
                      height={28}
                    />
                  </div>
                  <div className="mono" style={{ fontSize: 12 }}>
                    {s.q || 0} <span style={{ color: 'var(--ink-3)' }}>Qs</span>
                  </div>
                  <div className="mono" style={{ fontSize: 12 }}>
                    {s.polls || 0} <span style={{ color: 'var(--ink-3)' }}>polls</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {live ? (
                      <Btn
                        size="sm"
                        kind="primary"
                        iconRight={<IconArrowR size={12} />}
                        onClick={() => {
                          cookies.set('Prof_sesid', s.sesid, { path: '/' });
                          cookies.set('Prof_courseCode', selected.code, { path: '/' });
                          if (history && history.push) history.push('/nox/professor/dashboard');
                          else window.location = '/nox/professor/dashboard';
                        }}
                      >
                        Resume
                      </Btn>
                    ) : (
                      <Btn size="sm" kind="ghost" icon={<IconDownload size={12} />}>Report</Btn>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  courses: state.session.sessions,
});

export default connect(mapStateToProps, { getCourses, addCourse })(ProfSessions);
