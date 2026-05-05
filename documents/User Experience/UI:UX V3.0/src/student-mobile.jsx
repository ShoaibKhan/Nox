// Student mobile screens for Nox.
// All sized to fit inside an iOS device frame (390 x 844).

const SCREEN_W = 390;
const SCREEN_H = 844;

// Shared "course context" header used on every in-session screen.
const CourseHeader = ({course='CSC209H5', meta='Week 5 · Live'}) => (
  <NoxTopBar
    height={56}
    left={
      <div style={{display:'flex', flexDirection:'column', lineHeight:1.05}}>
        <span className="mono" style={{fontSize:13, fontWeight:600, letterSpacing:'0.06em'}}>{course}</span>
        <span className="mono" style={{fontSize:10, opacity:0.7, letterSpacing:'0.14em', textTransform:'uppercase', marginTop:2}}>{meta}</span>
      </div>
    }
    center={<NoxLockup size={20} color="#fff" showWord={false} />}
    right={
      <button title="Leave" style={{
        background:'transparent', border:'1px solid rgba(255,255,255,0.18)',
        color:'#fff', height:32, padding:'0 10px', borderRadius:8,
        display:'inline-flex', alignItems:'center', gap:6, fontSize:11
      }} className="mono">
        <IconClose size={12} stroke={2}/>LEAVE
      </button>
    }
  />
);

// 1) JOIN screen — minimal, focused on the code input
const StudentJoinScreen = ({onJoin}) => {
  const [code, setCode] = React.useState('');
  const valid = code.length === 6;
  return (
    <div style={{height:'100%', background:'var(--paper)', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden'}}>
      {/* warm paper texture, very subtle */}
      <div style={{position:'absolute', inset:0, background:'radial-gradient(120% 60% at 50% 0%, rgba(30,55,101,0.06), transparent 60%)'}}/>

      <div style={{padding:'20px 22px 0', display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative'}}>
        <NoxLockup size={26} color="var(--ink)"/>
        <button style={{
          background:'transparent', border:'1px solid var(--line)',
          color:'var(--ink-2)', height:32, padding:'0 12px', borderRadius:999,
          fontSize:12, fontWeight:500
        }}>Sign in as Professor →</button>
      </div>

      <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 28px', position:'relative'}}>
        <div className="mono" style={{fontSize:11, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase', marginBottom:10}}>
          Join a session
        </div>
        <h1 className="serif" style={{fontSize:38, lineHeight:1.05, margin:'0 0 8px', fontWeight:500, letterSpacing:'-0.01em'}}>
          What's the<br/>session code?
        </h1>
        <p style={{fontSize:14, color:'var(--ink-3)', lineHeight:1.5, margin:'0 0 28px', maxWidth:280}}>
          Your professor will share a six-character code at the start of class. No account needed.
        </p>

        {/* 6-char OTP-style input */}
        <div style={{display:'flex', gap:8, marginBottom:18}}>
          {Array.from({length:6}).map((_,i) => {
            const ch = code[i] || '';
            const isCursor = i === code.length;
            return (
              <div key={i} className="mono" style={{
                flex:1, height:62, background:'#fff',
                border:`1.5px solid ${isCursor ? 'var(--uoft-navy)' : 'var(--line)'}`,
                borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:24, fontWeight:600, color:'var(--ink)',
                boxShadow: isCursor ? '0 0 0 4px rgba(30,55,101,0.08)' : 'var(--shadow-sm)',
                transition:'all .15s ease'
              }}>
                {ch || (isCursor ? <span style={{width:1.5, height:24, background:'var(--uoft-navy)', animation:'blink 1s infinite'}}/> : '')}
              </div>
            );
          })}
        </div>

        {/* Numpad-ish keyboard suggestion (decorative) */}
        <Btn kind={valid?'primary':'ghost'} size="lg" style={{width:'100%', justifyContent:'center'}}
             iconRight={<IconArrowR size={16}/>} onClick={onJoin}>
          {valid ? 'Join session' : 'Enter code'}
        </Btn>

        <div style={{marginTop:16, display:'flex', alignItems:'center', justifyContent:'center', gap:14, color:'var(--ink-3)'}}>
          <span style={{flex:1, height:1, background:'var(--line)'}}/>
          <span className="mono" style={{fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase'}}>or</span>
          <span style={{flex:1, height:1, background:'var(--line)'}}/>
        </div>
        <button style={{
          marginTop:14, width:'100%', height:48,
          background:'#fff', border:'1px solid var(--line)', borderRadius:12,
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap:10,
          fontSize:14, fontWeight:500, color:'var(--ink)'
        }}>
          <IconQR size={18}/> Scan QR on the lecture screen
        </button>
      </div>

      <div style={{padding:'0 28px 32px', textAlign:'center', position:'relative'}}>
        <div style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:11, color:'var(--ink-3)'}} className="mono">
          <IconLock size={11}/> ANONYMOUS · NO TRACKING
        </div>
      </div>

      {/* fake demo: pre-filled code on second render */}
      <DemoFiller value="A4R7K9" set={setCode} delay={400}/>

      <style>{`@keyframes blink { 50% { opacity:0 } }`}</style>
    </div>
  );
};

// Helper: types code into the join screen for visual demo
const DemoFiller = ({value, set, delay=300}) => {
  React.useEffect(() => {
    let i = 0;
    const t = setTimeout(function tick(){
      i++;
      set(value.slice(0,i));
      if (i < value.length) setTimeout(tick, 110);
    }, delay);
    return () => clearTimeout(t);
  }, []);
  return null;
};

// 2) Student "in session" main view: pulse + Q&A feed combined
const StudentLiveScreen = ({initialPulse='good'}) => {
  const [pulse, setPulse] = React.useState(initialPulse);
  const [draft, setDraft] = React.useState('');
  const [questions, setQ] = React.useState([
    {id:1, text:'What happens if you malloc but lose the pointer?', votes:42, mine:false, answered:false},
    {id:2, text:'Is there any other way to push data to the heap?', votes:15, mine:false, answered:true},
    {id:3, text:'Does this create any risk of race conditions?', votes:9, mine:true, answered:false},
    {id:4, text:'Can you re-explain the diagram on slide 14?', votes:6, mine:false, answered:false},
  ]);

  const moods = [
    {id:'good', label:'I get it', color:'var(--accent-good)', fg:'#1F6A33'},
    {id:'okay', label:'Slow down', color:'var(--accent-okay)', fg:'#7A5816'},
    {id:'lost', label:'I\'m lost', color:'var(--accent-low)', fg:'#8C2A1E'},
  ];

  const upvote = (id) => setQ(qs => qs.map(q => q.id===id ? {...q, mine:!q.mine, votes:q.votes+(q.mine?-1:1)} : q));

  return (
    <div style={{height:'100%', background:'var(--paper)', display:'flex', flexDirection:'column'}}>
      <CourseHeader/>

      {/* Pulse strip */}
      <div style={{padding:'16px 18px 12px', background:'var(--paper)', borderBottom:'1px solid var(--line)'}}>
        <SectionLabel style={{marginBottom:8}}>How are you following?</SectionLabel>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
          {moods.map(m => {
            const active = pulse === m.id;
            return (
              <button key={m.id} onClick={()=>setPulse(m.id)} style={{
                background: active ? m.color : '#fff',
                border:`1.5px solid ${active ? m.color : 'var(--line)'}`,
                borderRadius:12, padding:'10px 8px',
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                color: active ? '#fff' : 'var(--ink)',
                transition:'all .15s ease', cursor:'pointer',
                boxShadow: active ? '0 4px 12px rgba(15,23,41,0.12)' : 'none'
              }}>
                <div style={{width:22, height:22, borderRadius:'50%',
                             background: active ? 'rgba(255,255,255,0.25)' : m.color,
                             display:'flex', alignItems:'center', justifyContent:'center'}}>
                  {m.id==='good' && <IconCheck size={13} stroke={2.5}/>}
                  {m.id==='okay' && <IconClock size={13} stroke={2.5}/>}
                  {m.id==='lost' && <IconClose size={13} stroke={2.5}/>}
                </div>
                <span style={{fontSize:12, fontWeight:600}}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question feed */}
      <div style={{flex:1, overflow:'auto', padding:'14px 18px 0'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <SectionLabel>Class Questions · {questions.length}</SectionLabel>
          <span className="mono" style={{fontSize:10, color:'var(--ink-3)', display:'inline-flex', alignItems:'center', gap:5}}>
            <span style={{width:6, height:6, borderRadius:'50%', background:'#3F8C42', boxShadow:'0 0 0 3px rgba(63,140,66,0.18)'}}/> LIVE
          </span>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          {questions.sort((a,b)=>b.votes-a.votes).map(q => (
            <div key={q.id} style={{
              background:'#fff', border:'1px solid var(--line)', borderRadius:14,
              padding:'12px 12px 12px 14px', display:'flex', alignItems:'flex-start', gap:10,
              boxShadow:'var(--shadow-sm)'
            }}>
              <button onClick={()=>upvote(q.id)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:0, minWidth:40, padding:'6px 4px',
                background: q.mine ? 'var(--uoft-navy)' : 'var(--paper)',
                border: q.mine ? '1px solid var(--uoft-navy)' : '1px solid var(--line)',
                borderRadius:10, color: q.mine ? '#fff' : 'var(--ink-2)',
                cursor:'pointer'
              }}>
                <IconUp size={14} stroke={2.4}/>
                <span className="mono" style={{fontSize:13, fontWeight:600, marginTop:2}}>{q.votes}</span>
              </button>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:14, lineHeight:1.4, color:'var(--ink)', marginBottom: q.answered||q.mine ? 6 : 0}}>{q.text}</div>
                {(q.answered || q.mine) && (
                  <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                    {q.answered && <Pill tone="good" style={{padding:'2px 7px', fontSize:9.5}}><IconCheck size={9} stroke={3}/> answered</Pill>}
                    {q.mine && <Pill tone="blue" style={{padding:'2px 7px', fontSize:9.5}}>your question</Pill>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div style={{padding:'10px 14px 14px', background:'rgba(247,243,235,0.94)', backdropFilter:'blur(8px)', borderTop:'1px solid var(--line)'}}>
        <div style={{
          display:'flex', alignItems:'center', gap:8, background:'#fff',
          border:'1px solid var(--line)', borderRadius:999,
          padding:'5px 5px 5px 16px', boxShadow:'var(--shadow-sm)'
        }}>
          <input value={draft} onChange={e=>setDraft(e.target.value)}
                 placeholder="Ask anonymously…"
                 style={{flex:1, border:'none', outline:'none', fontSize:14, padding:'8px 0', background:'transparent', color:'var(--ink)'}}/>
          <button style={{
            width:36, height:36, border:'none', borderRadius:'50%',
            background: draft.length ? 'var(--uoft-navy)' : 'var(--paper-2)',
            color: draft.length ? '#fff' : 'var(--ink-3)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', transition:'background .15s'
          }}>
            <IconSend size={15} stroke={2.2}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// 3) Student poll screen — multiple choice with live result reveal after vote
const StudentPollScreen = ({revealed=false}) => {
  const [picked, setPicked] = React.useState(revealed ? 'A' : null);
  const [showResults, setShowResults] = React.useState(revealed);

  const opts = [
    {id:'A', text:'Garbage Collection', votes:10, color:'#7196C7'},
    {id:'B', text:'Memory Leak',        votes:14, color:'#1E3765'},
    {id:'C', text:'Seg Fault',          votes:2,  color:'#7196C7'},
    {id:'D', text:'None of the above',  votes:4,  color:'#1E3765'},
  ];
  const total = opts.reduce((s,o)=>s+o.votes,0);

  return (
    <div style={{height:'100%', background:'var(--paper)', display:'flex', flexDirection:'column'}}>
      <CourseHeader meta="Week 5 · Live Poll"/>

      <div style={{padding:'18px 18px 12px'}}>
        <Pill tone="navy" style={{marginBottom:10}}><IconBolt size={11}/> POLL · 0:42 LEFT</Pill>
        <h2 className="serif" style={{margin:'0 0 6px', fontSize:22, fontWeight:500, lineHeight:1.25}}>
          What happens if you malloc but lose the pointer?
        </h2>
        <p style={{margin:0, fontSize:12, color:'var(--ink-3)'}}>Pick one. Your vote stays anonymous.</p>
      </div>

      <div style={{flex:1, padding:'8px 18px', overflow:'auto'}}>
        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          {opts.map(o => {
            const isPicked = picked === o.id;
            const pct = Math.round(o.votes/total*100);
            const isLead = o.votes === Math.max(...opts.map(x=>x.votes));
            return (
              <button key={o.id} onClick={()=>{setPicked(o.id); setTimeout(()=>setShowResults(true), 250);}}
                style={{
                  position:'relative', padding:'14px 14px', textAlign:'left',
                  background:'#fff',
                  border: isPicked ? '2px solid var(--uoft-navy)' : '1.5px solid var(--line)',
                  borderRadius:14,
                  boxShadow: isPicked ? '0 6px 18px rgba(30,55,101,0.18)' : 'var(--shadow-sm)',
                  cursor:'pointer', overflow:'hidden',
                }}>
                {showResults && (
                  <div style={{
                    position:'absolute', inset:0,
                    background: isLead ? 'rgba(30,55,101,0.10)' : 'rgba(113,150,199,0.10)',
                    width:`${pct}%`,
                    transition:'width .6s cubic-bezier(.2,.8,.2,1)'
                  }}/>
                )}
                <div style={{position:'relative', display:'flex', alignItems:'center', gap:14}}>
                  <div className="serif" style={{
                    width:40, height:40, borderRadius:10,
                    background: isPicked ? 'var(--uoft-navy)' : 'var(--paper-2)',
                    color: isPicked ? '#fff' : 'var(--ink-2)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:22, fontWeight:600, fontStyle:'italic', flexShrink:0
                  }}>{o.id}</div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:15, fontWeight:500, color:'var(--ink)'}}>{o.text}</div>
                    {showResults && (
                      <div className="mono" style={{fontSize:11, color:'var(--ink-3)', marginTop:3}}>
                        {o.votes} votes · {pct}%
                      </div>
                    )}
                  </div>
                  {isPicked && <IconCheck size={20} stroke={2.4} style={{color:'var(--uoft-navy)'}}/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{padding:'10px 18px 16px', background:'rgba(247,243,235,0.94)', borderTop:'1px solid var(--line)'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span className="mono" style={{fontSize:11, color:'var(--ink-3)', display:'inline-flex', alignItems:'center', gap:6}}>
            <IconUsers size={12}/> {total} voted · {12} watching
          </span>
          {showResults
            ? <Pill tone="good"><IconCheck size={10} stroke={3}/> VOTE LOCKED IN</Pill>
            : <Pill tone="paper">tap to vote</Pill>}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { StudentJoinScreen, StudentLiveScreen, StudentPollScreen, CourseHeader });
