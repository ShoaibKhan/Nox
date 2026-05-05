// Composes everything into the design canvas.

const { DesignCanvas, DCSection, DCArtboard } = window;

const PhoneArtboard = ({children, style}) => (
  <div style={{
    width: 390, height: 844, position:'relative',
    borderRadius: 44, overflow:'hidden',
    background:'#000',
    boxShadow:'0 30px 60px rgba(15,23,41,0.18), 0 6px 14px rgba(15,23,41,0.10)',
    border:'10px solid #0F1729',
    ...style
  }}>
    {/* status bar */}
    <div style={{
      position:'absolute', top:0, left:0, right:0, height:44,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 24px', zIndex:5,
      color:'#fff', pointerEvents:'none'
    }}>
      <span className="mono" style={{fontSize:14, fontWeight:600}}>9:41</span>
      <span style={{display:'inline-flex', gap:6, alignItems:'center'}}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="2.5" height="4"/><rect x="3.5" y="4" width="2.5" height="6"/><rect x="7" y="2" width="2.5" height="8"/><rect x="10.5" y="0" width="2.5" height="10"/></svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 4 a8 8 0 0 1 12 0"/><path d="M3 6 a5 5 0 0 1 8 0"/><circle cx="7" cy="8.5" r="1" fill="currentColor"/></svg>
        <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.5"/><rect x="2" y="2" width="15" height="6" rx="1" fill="currentColor"/><rect x="19" y="3.5" width="2" height="3" rx="0.5" fill="currentColor" opacity="0.5"/></svg>
      </span>
    </div>
    {/* dynamic island */}
    <div style={{
      position:'absolute', top:11, left:'50%', transform:'translateX(-50%)',
      width:120, height:34, borderRadius:20, background:'#000', zIndex:6
    }}/>
    {/* screen content with safe area padding for status bar */}
    <div style={{position:'absolute', inset:0, paddingTop:44, background:'var(--paper)'}}>
      {children}
    </div>
    {/* home indicator */}
    <div style={{
      position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
      width:130, height:4, borderRadius:2, background:'rgba(255,255,255,0.7)', zIndex:5
    }}/>
  </div>
);

const BrowserChrome = ({children, url='nox.utoronto.ca', width=1280, height=820}) => (
  <div style={{
    width, height, borderRadius:14, overflow:'hidden',
    background:'#fff', border:'1px solid var(--line)',
    boxShadow:'0 24px 60px rgba(15,23,41,0.16), 0 4px 10px rgba(15,23,41,0.08)'
  }}>
    <div style={{
      height:38, display:'flex', alignItems:'center', gap:10,
      padding:'0 14px', background:'#EAE5DA', borderBottom:'1px solid var(--line)'
    }}>
      <div style={{display:'flex', gap:6}}>
        <span style={{width:11, height:11, borderRadius:'50%', background:'#FF5F57'}}/>
        <span style={{width:11, height:11, borderRadius:'50%', background:'#FEBC2E'}}/>
        <span style={{width:11, height:11, borderRadius:'50%', background:'#28C840'}}/>
      </div>
      <div style={{flex:1, display:'flex', justifyContent:'center'}}>
        <div className="mono" style={{
          fontSize:11, color:'var(--ink-2)',
          background:'#fff', border:'1px solid var(--line-2)',
          padding:'4px 14px', borderRadius:6, minWidth:300, textAlign:'center'
        }}>{url}</div>
      </div>
    </div>
    <div style={{height:height-38, overflow:'hidden'}}>{children}</div>
  </div>
);

// ---------- Tweaks ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent":"#1E3765",
  "paper":"#F7F3EB",
  "headerSerif":true,
  "studentMoodVariant":"trio"
}/*EDITMODE-END*/;

const App = () => {
  const { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakToggle, TweakRadio } = window;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--uoft-navy', tweaks.accent);
    r.style.setProperty('--paper', tweaks.paper);
  }, [tweaks.accent, tweaks.paper]);

  return (
    <>
      <DesignCanvas title="Nox · Modernized UI" subtitle="Anonymous Q&A and live polling for U of T lectures — student mobile · student web · professor desktop">
        <DCSection id="auth" title="01 · Authentication" subtitle="University of Toronto weblogin (kept as-is per brief)">
          <DCArtboard id="auth-uoft" label="UTORid login (weblogin) — kept exactly as-is" width={1000} height={560}>
            <div style={{width:'100%', height:'100%', background:'#fff', overflow:'hidden'}}>
              <img src="documents/auth-screenshot.png" alt="U of T weblogin"
                   style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="student-mobile" title="02 · Student · mobile" subtitle="Mobile-first, low-distraction. Three core screens.">
          <DCArtboard id="student-join" label="Join session" width={420} height={880}>
            <div style={{width:420, height:880, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent'}}>
              <PhoneArtboard><StudentJoinScreen/></PhoneArtboard>
            </div>
          </DCArtboard>
          <DCArtboard id="student-live" label="Live · Q&A + pulse" width={420} height={880}>
            <div style={{width:420, height:880, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent'}}>
              <PhoneArtboard><StudentLiveScreen/></PhoneArtboard>
            </div>
          </DCArtboard>
          <DCArtboard id="student-poll" label="Live poll · vote" width={420} height={880}>
            <div style={{width:420, height:880, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent'}}>
              <PhoneArtboard><StudentPollScreen/></PhoneArtboard>
            </div>
          </DCArtboard>
          <DCArtboard id="student-poll-results" label="Poll · results revealed" width={420} height={880}>
            <div style={{width:420, height:880, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent'}}>
              <PhoneArtboard><StudentPollScreen revealed={true}/></PhoneArtboard>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="student-desktop" title="03 · Student · web" subtitle="Same flow, wider canvas with side rail">
          <DCArtboard id="student-web-live" label="Web · live class" width={1280} height={820}>
            <BrowserChrome><StudentDesktopLive/></BrowserChrome>
          </DCArtboard>
        </DCSection>

        <DCSection id="prof" title="04 · Professor · desktop" subtitle="Sessions list, live dashboard, poll composer">
          <DCArtboard id="prof-sessions" label="Sessions · course detail" width={1280} height={820}>
            <BrowserChrome><ProfSessions/></BrowserChrome>
          </DCArtboard>
          <DCArtboard id="prof-dashboard" label="Live dashboard · pulse + Q&A" width={1280} height={820}>
            <BrowserChrome><ProfDashboard/></BrowserChrome>
          </DCArtboard>
          <DCArtboard id="prof-poll" label="Live poll · results & controls" width={1280} height={820}>
            <BrowserChrome><ProfPollLive/></BrowserChrome>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Brand">
          <TweakColor label="Primary navy"
            value={tweaks.accent}
            onChange={v=>setTweak('accent', v)}/>
          <TweakColor label="Paper background"
            value={tweaks.paper}
            onChange={v=>setTweak('paper', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
