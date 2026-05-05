// Professor desktop screens: sessions list, live dashboard, poll composer/results, analytics.

// ---- Sessions / home ----
const ProfSessions = () => {
  const [sel, setSel] = React.useState('CSC209');
  const courses = [
    {code:'CSC209', title:'Software Tools and Systems Programming', term:'Winter 2026', sessions:14, students:184, color:'var(--uoft-navy)'},
    {code:'CSC369', title:'Operating Systems',                       term:'Winter 2026', sessions:9,  students:122, color:'#4A6FA5'},
    {code:'CSC373', title:'Algorithm Design and Analysis',           term:'Winter 2026', sessions:7,  students:96,  color:'#7196C7'},
  ];
  const sessions = [
    {wk:'Week 5 (today)', date:'Apr 22 · 10:00–11:30', state:'live', avg:2.4, q:23, polls:3},
    {wk:'Week 4',         date:'Apr 15 · 10:00–11:30', state:'past', avg:2.6, q:18, polls:2},
    {wk:'Week 3',         date:'Apr 08 · 10:00–11:30', state:'past', avg:2.3, q:31, polls:4},
    {wk:'Week 2',         date:'Apr 01 · 10:00–11:30', state:'past', avg:2.7, q:12, polls:1},
    {wk:'Week 1',         date:'Mar 25 · 10:00–11:30', state:'past', avg:2.5, q:9,  polls:2},
  ];

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background:'var(--paper)'}}>
      <NoxTopBar
        height={58}
        left={
          <>
            <NoxLockup size={22} color="#fff"/>
            <span className="mono" style={{fontSize:11, opacity:0.5, marginLeft:14}}>FOR PROFESSORS</span>
          </>
        }
        right={
          <>
            <span style={{display:'inline-flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.85)'}}>
              <span style={{width:28, height:28, borderRadius:'50%', background:'#7196C7', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color:'#fff'}}>RK</span>
              <span style={{fontSize:13}}>Prof. Khan</span>
            </span>
            <button style={{background:'transparent', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', height:30, padding:'0 12px', borderRadius:8, fontSize:11}} className="mono">LOG OUT</button>
          </>
        }
      />

      <div style={{flex:1, display:'grid', gridTemplateColumns:'320px 1fr', minHeight:0}}>
        {/* Course list */}
        <aside style={{borderRight:'1px solid var(--line)', background:'var(--bone)', padding:'24px 18px', overflow:'auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
            <SectionLabel>Your courses</SectionLabel>
            <Btn kind="ghost" size="sm" icon={<IconPlus size={12}/>}>Add</Btn>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {courses.map(c => {
              const active = sel === c.code;
              return (
                <button key={c.code} onClick={()=>setSel(c.code)} style={{
                  textAlign:'left', padding:'14px 14px',
                  background: active ? '#fff' : 'transparent',
                  border:`1px solid ${active ? 'var(--line)' : 'transparent'}`,
                  borderRadius:12, cursor:'pointer',
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                  display:'flex', flexDirection:'column', gap:4
                }}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <span style={{width:6, height:28, borderRadius:3, background:c.color}}/>
                    <span className="mono" style={{fontSize:13, fontWeight:600}}>{c.code}</span>
                  </div>
                  <div style={{fontSize:13, color:'var(--ink-2)', marginLeft:16}}>{c.title}</div>
                  <div className="mono" style={{fontSize:10, color:'var(--ink-3)', marginLeft:16, letterSpacing:'0.08em'}}>
                    {c.sessions} sessions · {c.students} students
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Course detail */}
        <main style={{padding:'28px 36px', overflow:'auto'}}>
          <SectionLabel>{courses.find(c=>c.code===sel).term}</SectionLabel>
          <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:6, marginBottom:22}}>
            <div>
              <h1 className="serif" style={{margin:0, fontSize:36, fontWeight:500, letterSpacing:'-0.01em'}}>
                {sel} · {courses.find(c=>c.code===sel).title}
              </h1>
              <p style={{margin:'6px 0 0', color:'var(--ink-3)', fontSize:14}}>Lecture sessions and class feedback at a glance.</p>
            </div>
            <div style={{display:'flex', gap:8}}>
              <Btn kind="ghost" size="md" icon={<IconCalendar size={14}/>}>Schedule</Btn>
              <Btn kind="primary" size="md" icon={<IconBolt size={14}/>}>Start session</Btn>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24}}>
            {[
              {k:'Avg understanding', v:'2.5', s:'/3 across term', tone:'good'},
              {k:'Questions asked',   v:'164', s:'last 5 sessions', tone:'blue'},
              {k:'Poll responses',    v:'1,422', s:'avg 87% turnout', tone:'navy'},
              {k:'Students reached',  v:'184', s:'enrolled this term', tone:'paper'},
            ].map((s,i)=>(
              <Card key={i} style={{padding:'14px 16px'}}>
                <SectionLabel style={{marginBottom:6, fontSize:10}}>{s.k}</SectionLabel>
                <div className="serif" style={{fontSize:30, fontWeight:500, lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:11, color:'var(--ink-3)', marginTop:5}}>{s.s}</div>
              </Card>
            ))}
          </div>

          <SectionLabel style={{marginBottom:10}}>Sessions</SectionLabel>
          <Card>
            {sessions.map((s,i)=>(
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'1fr 200px 100px 100px 110px',
                gap:14, alignItems:'center',
                padding:'14px 18px',
                borderBottom: i<sessions.length-1 ? '1px solid var(--line-2)' : 'none'
              }}>
                <div>
                  <div style={{fontSize:14, fontWeight:600}}>
                    {s.wk}
                    {s.state==='live' && <Pill tone="low" style={{marginLeft:8, padding:'2px 7px', fontSize:9.5}}><span style={{width:5, height:5, borderRadius:'50%', background:'#B23A2A', boxShadow:'0 0 0 3px rgba(178,58,42,0.18)'}}/> LIVE NOW</Pill>}
                  </div>
                  <div className="mono" style={{fontSize:11, color:'var(--ink-3)', marginTop:2}}>{s.date}</div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <PulseLine values={[2,2.2,2.5,2.4,2.7,2.6,2.4,2.3,2.5,2.6,2.5,s.avg]} width={120} height={28}/>
                </div>
                <div className="mono" style={{fontSize:12}}>{s.q} <span style={{color:'var(--ink-3)'}}>Qs</span></div>
                <div className="mono" style={{fontSize:12}}>{s.polls} <span style={{color:'var(--ink-3)'}}>polls</span></div>
                <div style={{textAlign:'right'}}>
                  {s.state==='live'
                    ? <Btn size="sm" kind="primary" iconRight={<IconArrowR size={12}/>}>Resume</Btn>
                    : <Btn size="sm" kind="ghost" icon={<IconDownload size={12}/>}>Report</Btn>}
                </div>
              </div>
            ))}
          </Card>
        </main>
      </div>
    </div>
  );
};

// ---- Live dashboard ----
const ProfDashboard = () => {
  const pulse = [2.5,2.6,2.4,2.7,2.5,2.3,2.0,1.8,1.9,2.1,2.4,2.5,2.6,2.4,2.2,2.0,1.7,1.5,1.6,1.9,2.2,2.4,2.5];
  const dist = {good:42, okay:24, lost:13};
  const total = dist.good + dist.okay + dist.lost;
  const questions = [
    {id:1, text:'What happens if you malloc but lose the pointer?', votes:42, t:'2m', flag:true},
    {id:2, text:'What are the risks of using unsafe functions?', votes:37, t:'4m'},
    {id:3, text:'Is there any other way to push data to the heap?', votes:15, t:'5m'},
    {id:4, text:'Are we allowed to use unsafe functions for our assignment?', votes:15, t:'7m'},
    {id:5, text:'Does this create any risk of race conditions?', votes:9, t:'8m'},
    {id:6, text:'Can you re-explain the diagram on slide 14?', votes:6, t:'10m'},
  ];

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background:'var(--paper)'}}>
      <NoxTopBar
        height={56}
        left={
          <>
            <NoxLockup size={22} color="#fff"/>
            <span className="mono" style={{fontSize:11, opacity:0.5, marginLeft:14}}>CSC209H5 · WEEK 5</span>
          </>
        }
        center={
          <div style={{display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.08)', borderRadius:8, padding:'4px 6px 4px 12px'}}>
            <span className="mono" style={{fontSize:11, color:'rgba(255,255,255,0.65)', letterSpacing:'0.14em'}}>SESSION CODE</span>
            <span className="mono" style={{fontSize:16, fontWeight:600, letterSpacing:'0.18em'}}>A4R7K9</span>
            <button style={{background:'rgba(255,255,255,0.15)', border:'none', color:'#fff', width:28, height:28, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center'}}><IconCopy size={12} stroke={2}/></button>
          </div>
        }
        right={
          <>
            <span className="mono" style={{fontSize:11, color:'rgba(255,255,255,0.7)', display:'inline-flex', alignItems:'center', gap:6}}>
              <IconUsers size={12}/> 79 PRESENT
            </span>
            <Btn kind="accent" size="sm" icon={<IconPoll size={13}/>}>Start poll</Btn>
            <button style={{background:'transparent', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', height:30, padding:'0 12px', borderRadius:8, fontSize:11}} className="mono">END SESSION</button>
          </>
        }
      />

      <div style={{flex:1, display:'grid', gridTemplateColumns:'1fr 380px', minHeight:0}}>
        <main style={{padding:'24px 30px', overflow:'auto'}}>
          {/* Pulse hero */}
          <Card style={{padding:'20px 24px', marginBottom:18}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:8}}>
              <div>
                <SectionLabel>Live understanding · last 12 minutes</SectionLabel>
                <div style={{display:'flex', alignItems:'baseline', gap:14, marginTop:6}}>
                  <span className="serif" style={{fontSize:44, fontWeight:500, lineHeight:1}}>2.0</span>
                  <span style={{fontSize:13, color:'var(--ink-3)'}}>/ 3.0 — slipping</span>
                </div>
              </div>
              <div style={{display:'flex', gap:6}}>
                <Pill tone="good"><Dot color="var(--accent-good)"/>good {dist.good}</Pill>
                <Pill tone="okay"><Dot color="var(--accent-okay)"/>okay {dist.okay}</Pill>
                <Pill tone="low"><Dot color="var(--accent-low)"/>lost {dist.lost}</Pill>
              </div>
            </div>
            <PulseLine values={pulse} width={760} height={120}
                       strokeColor="var(--uoft-navy)"
                       fillColor="rgba(74,111,165,0.14)"/>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:6}}>
              <span className="mono" style={{fontSize:10, color:'var(--ink-3)'}}>10:00</span>
              <span className="mono" style={{fontSize:10, color:'var(--ink-3)'}}>10:12 (now)</span>
            </div>
            {/* Inline alert */}
            <div style={{marginTop:14, padding:'10px 12px', background:'rgba(214,87,69,0.08)', border:'1px solid rgba(214,87,69,0.25)', borderRadius:10, display:'flex', alignItems:'center', gap:10}}>
              <IconBolt size={14} style={{color:'#8C2A1E'}}/>
              <span style={{fontSize:13, color:'var(--ink)'}}>
                <strong>Heads up —</strong> 13 students are lost in the last 90 seconds. Consider pausing on the current concept.
              </span>
              <Btn kind="ghost" size="sm" style={{marginLeft:'auto'}}>Dismiss</Btn>
            </div>
          </Card>

          {/* Question feed */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
            <div>
              <h3 className="serif" style={{margin:0, fontSize:20, fontWeight:500}}>Top questions</h3>
              <SectionLabel style={{marginTop:2}}>Sorted by upvotes · tap to mark answered</SectionLabel>
            </div>
            <div style={{display:'flex', gap:6}}>
              <Pill tone="bone">All · {questions.length}</Pill>
              <Pill tone="paper">Unanswered · 5</Pill>
            </div>
          </div>

          <Card>
            {questions.map((q,i)=>(
              <div key={q.id} style={{
                display:'grid', gridTemplateColumns:'48px 1fr auto', gap:14,
                alignItems:'center', padding:'14px 16px',
                borderBottom: i<questions.length-1 ? '1px solid var(--line-2)' : 'none',
                background: q.flag ? 'rgba(200,162,75,0.06)' : 'transparent'
              }}>
                <div className="serif" style={{
                  width:42, height:42, borderRadius:10,
                  background:'var(--paper-2)', color:'var(--ink)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:18, fontWeight:500, flexShrink:0
                }}>{q.votes}</div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:15, lineHeight:1.4}}>
                    {q.text}
                    {q.flag && <Pill tone="okay" style={{marginLeft:10, fontSize:9.5, padding:'2px 7px'}}><IconSparkle size={9} stroke={2.5}/> trending</Pill>}
                  </div>
                  <span className="mono" style={{fontSize:11, color:'var(--ink-3)', marginTop:3, display:'inline-block'}}>{q.t} ago · anonymous</span>
                </div>
                <div style={{display:'flex', gap:6}}>
                  <Btn kind="ghost" size="sm" icon={<IconCheck size={12} stroke={2.5}/>}>Mark answered</Btn>
                  <Btn kind="light" size="sm" icon={<IconMessage size={12}/>}>Reply</Btn>
                </div>
              </div>
            ))}
          </Card>
        </main>

        {/* Right rail: roster + activity */}
        <aside style={{borderLeft:'1px solid var(--line)', background:'var(--bone)', padding:'22px 22px', overflow:'auto'}}>
          <SectionLabel style={{marginBottom:10}}>Quick actions</SectionLabel>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:22}}>
            <Btn kind="light" size="md" icon={<IconPoll size={14}/>}>Quick poll</Btn>
            <Btn kind="light" size="md" icon={<IconHand size={14}/>}>Pause check</Btn>
            <Btn kind="light" size="md" icon={<IconQR size={14}/>}>Show QR</Btn>
            <Btn kind="light" size="md" icon={<IconShare size={14}/>}>Share code</Btn>
          </div>

          <SectionLabel style={{marginBottom:10}}>Distribution · now</SectionLabel>
          <Card style={{padding:14, marginBottom:18}}>
            {[
              {l:'Good',     v:dist.good, c:'var(--accent-good)'},
              {l:'Okay',     v:dist.okay, c:'var(--accent-okay)'},
              {l:'Lost',     v:dist.lost, c:'var(--accent-low)'},
            ].map((r,i)=>{
              const pct = Math.round(r.v/total*100);
              return (
                <div key={i} style={{marginBottom: i<2?10:0}}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4}}>
                    <span style={{display:'inline-flex', alignItems:'center', gap:6}}><Dot color={r.c}/> {r.l}</span>
                    <span className="mono">{r.v} · {pct}%</span>
                  </div>
                  <div style={{height:8, background:'var(--paper-2)', borderRadius:4, overflow:'hidden'}}>
                    <div style={{width:`${pct}%`, height:'100%', background:r.c, borderRadius:4}}/>
                  </div>
                </div>
              );
            })}
          </Card>

          <SectionLabel style={{marginBottom:10}}>Recent activity</SectionLabel>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {[
              {t:'New question · 42 upvotes', s:'2m ago', i:<IconMessage size={13}/>},
              {t:'Poll closed · 67 votes',    s:'5m ago', i:<IconPoll size={13}/>},
              {t:'12 students felt lost',     s:'7m ago', i:<IconBolt size={13}/>},
              {t:'Session started',           s:'12m ago', i:<IconCalendar size={13}/>},
            ].map((e,i)=>(
              <div key={i} style={{display:'flex', gap:10, padding:'10px 12px', background:'#fff', border:'1px solid var(--line)', borderRadius:10}}>
                <span style={{width:26, height:26, borderRadius:8, background:'var(--paper)', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--ink-2)'}}>{e.i}</span>
                <div style={{minWidth:0, flex:1}}>
                  <div style={{fontSize:13, color:'var(--ink)'}}>{e.t}</div>
                  <span className="mono" style={{fontSize:10, color:'var(--ink-3)'}}>{e.s}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

// ---- Poll composer / live results ----
const ProfPollLive = () => {
  const opts = [
    {label:'A', text:'Garbage Collection', votes:10},
    {label:'B', text:'Memory Leak',        votes:14},
    {label:'C', text:'Seg Fault',          votes:2},
    {label:'D', text:'None of the above',  votes:4},
  ];
  const total = opts.reduce((s,o)=>s+o.votes,0);
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background:'var(--paper)'}}>
      <NoxTopBar
        height={56}
        left={
          <>
            <NoxLockup size={22} color="#fff"/>
            <span className="mono" style={{fontSize:11, opacity:0.5, marginLeft:14}}>CSC209H5 · WEEK 5 · LIVE POLL</span>
          </>
        }
        right={
          <>
            <span className="mono" style={{fontSize:11, color:'rgba(255,255,255,0.7)', display:'inline-flex', alignItems:'center', gap:6}}>
              <IconClock size={12}/> 0:42 LEFT
            </span>
            <Btn kind="danger" size="sm" icon={<IconStop size={11}/>}>End poll</Btn>
          </>
        }
      />

      <div style={{flex:1, display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:0, minHeight:0}}>
        {/* Left — results */}
        <main style={{padding:'28px 36px', overflow:'auto'}}>
          <SectionLabel>Question · multiple choice</SectionLabel>
          <h2 className="serif" style={{margin:'8px 0 22px', fontSize:30, fontWeight:500, lineHeight:1.2, letterSpacing:'-0.01em'}}>
            What happens if you malloc but lose the pointer?
          </h2>

          <Card style={{padding:'22px 24px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:18}}>
              <SectionLabel>Live results</SectionLabel>
              <span className="mono" style={{fontSize:12, color:'var(--ink-3)'}}>{total} of 79 responded · {Math.round(total/79*100)}%</span>
            </div>
            <PollBars options={opts} totalVotes={total}/>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:22, paddingTop:18, borderTop:'1px solid var(--line-2)'}}>
              <div><SectionLabel style={{marginBottom:4}}>Leader</SectionLabel><div className="serif" style={{fontSize:22, fontWeight:500}}>B. Memory Leak</div></div>
              <div><SectionLabel style={{marginBottom:4}}>Confidence</SectionLabel><div className="serif" style={{fontSize:22, fontWeight:500}}>47%</div></div>
              <div><SectionLabel style={{marginBottom:4}}>Avg time</SectionLabel><div className="serif" style={{fontSize:22, fontWeight:500}}>11s</div></div>
            </div>
          </Card>
        </main>

        {/* Right — poll controls */}
        <aside style={{background:'var(--bone)', borderLeft:'1px solid var(--line)', padding:'24px 24px', overflow:'auto'}}>
          <SectionLabel style={{marginBottom:10}}>Poll controls</SectionLabel>
          <Card style={{padding:'16px'}}>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              <Btn kind="primary" size="md" icon={<IconCheck size={13}/>}>Reveal correct answer</Btn>
              <Btn kind="ghost"   size="md" icon={<IconClock size={13}/>}>Extend by 30s</Btn>
              <Btn kind="ghost"   size="md" icon={<IconShare size={13}/>}>Push to lecture screen</Btn>
            </div>
          </Card>

          <SectionLabel style={{margin:'22px 0 10px'}}>Up next · queued</SectionLabel>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {[
              {t:'What are the risks of using unsafe functions?', n:4},
              {t:'True or false: free() always returns memory to the OS.', n:2},
            ].map((p,i)=>(
              <div key={i} style={{padding:'12px 14px', background:'#fff', border:'1px solid var(--line)', borderRadius:12}}>
                <div style={{fontSize:13, lineHeight:1.4, marginBottom:6}}>{p.t}</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span className="mono" style={{fontSize:10, color:'var(--ink-3)'}}>{p.n} options</span>
                  <Btn kind="ghost" size="sm">Edit</Btn>
                </div>
              </div>
            ))}
            <Btn kind="ghost" size="md" icon={<IconPlus size={13}/>} style={{justifyContent:'center'}}>New poll</Btn>
          </div>

          <SectionLabel style={{margin:'22px 0 10px'}}>Templates</SectionLabel>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            {['Multiple choice','True / False','Confidence 1–5','Open-ended'].map((t,i)=>(
              <button key={i} style={{
                padding:'12px 12px', background:'#fff', border:'1px solid var(--line)', borderRadius:10,
                textAlign:'left', cursor:'pointer', fontSize:12, fontWeight:500
              }}>{t}</button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

Object.assign(window, { ProfSessions, ProfDashboard, ProfPollLive });
