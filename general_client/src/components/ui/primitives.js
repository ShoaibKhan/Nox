import React from 'react';
import { NoxMark } from './icons';

export const Pill = ({ children, tone = 'ink', style, ...rest }) => {
  const tones = {
    ink:    { bg: '#0F1729', fg: '#F7F3EB', border: 'transparent' },
    navy:   { bg: 'var(--uoft-navy)', fg: '#fff', border: 'transparent' },
    paper:  { bg: 'var(--paper)', fg: 'var(--ink)', border: 'var(--line)' },
    bone:   { bg: 'var(--bone)', fg: 'var(--ink)', border: 'var(--line)' },
    good:   { bg: 'rgba(76,170,90,0.14)', fg: '#1F6A33', border: 'rgba(76,170,90,0.35)' },
    okay:   { bg: 'rgba(225,178,69,0.18)', fg: '#7A5816', border: 'rgba(225,178,69,0.4)' },
    low:    { bg: 'rgba(214,87,69,0.14)', fg: '#8C2A1E', border: 'rgba(214,87,69,0.35)' },
    blue:   { bg: 'rgba(74,111,165,0.14)', fg: '#1E3765', border: 'rgba(74,111,165,0.3)' },
  };
  const t = tones[tone] || tones.ink;
  return (
    <span
      className="mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 9px',
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
};

export const NoxTopBar = ({ left, center, right, dark = true, height = 58, style }) => (
  <header
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: dark ? 'var(--uoft-navy)' : 'transparent',
      color: dark ? '#fff' : 'var(--ink)',
      height,
      padding: '0 18px',
      borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--line)',
      flexShrink: 0,
      ...style,
    }}
  >
    <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', alignItems: 'center', gap: 12 }}>{left}</div>
    <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>{center}</div>
    <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>{right}</div>
  </header>
);

export const NoxLockup = ({ size = 22, color = 'currentColor', showWord = true }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color }}>
    <NoxMark size={size} color={color} />
    {showWord && (
      <span
        className="serif"
        style={{ fontSize: size * 0.85, letterSpacing: '0.08em', fontStyle: 'italic', fontWeight: 500 }}
      >
        Nox
      </span>
    )}
  </span>
);

export const Btn = ({ children, kind = 'primary', size = 'md', icon, iconRight, style, ...rest }) => {
  const sizes = {
    sm: { h: 30, px: 12, fz: 12, gap: 6 },
    md: { h: 38, px: 16, fz: 13, gap: 8 },
    lg: { h: 46, px: 20, fz: 15, gap: 10 },
  };
  const kinds = {
    primary: { bg: 'var(--uoft-navy)', fg: '#fff', border: 'transparent', hover: 'var(--uoft-navy-deep)' },
    ghost:   { bg: 'transparent', fg: 'var(--ink)', border: 'var(--line)', hover: 'var(--paper-2)' },
    light:   { bg: '#fff', fg: 'var(--ink)', border: 'var(--line)', hover: 'var(--bone)' },
    danger:  { bg: '#B23A2A', fg: '#fff', border: 'transparent', hover: '#8C2A1E' },
    accent:  { bg: 'var(--accent-warm)', fg: '#1F1804', border: 'transparent', hover: '#B8902F' },
    minimal: { bg: 'transparent', fg: 'var(--ink-2)', border: 'transparent', hover: 'rgba(15,23,41,0.05)' },
  };
  const s = sizes[size] || sizes.md;
  const k = kinds[kind] || kinds.primary;
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.fz,
        fontWeight: 600,
        letterSpacing: '0.01em',
        borderRadius: 8,
        border: `1px solid ${k.border}`,
        background: k.bg,
        color: k.fg,
        cursor: 'pointer',
        transition: 'background .15s ease, transform .05s ease',
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(1px)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = k.bg;
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = k.hover)}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
};

export const Card = ({ children, style, ...rest }) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-sm)',
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const PulseLine = ({
  values,
  width = 520,
  height = 72,
  strokeColor = 'var(--uoft-navy)',
  fillColor = 'rgba(74,111,165,0.18)',
}) => {
  if (!values || !values.length) return null;
  const min = 1;
  const max = 3;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - 6 - ((v - min) / (max - min)) * (height - 12);
    return [x, y];
  });
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const fill = `${path} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={fill} fill={fillColor} />
      <path d={path} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      {points.length > 0 && (
        <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="3.5" fill={strokeColor} />
      )}
    </svg>
  );
};

export const PollBars = ({ options, totalVotes, accent = 'var(--uoft-navy)' }) => {
  const max = Math.max(1, ...options.map((o) => o.votes));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((o, i) => {
        const pct = Math.round((o.votes / Math.max(1, totalVotes)) * 100);
        const w = (o.votes / max) * 100;
        const isLead = o.votes === max && o.votes > 0;
        return (
          <div key={i} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>
                <span className="mono" style={{ color: 'var(--ink-3)', marginRight: 8, fontSize: 12 }}>{o.label}</span>
                {o.text}
              </span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                {o.votes} · {pct}%
              </span>
            </div>
            <div style={{ height: 10, background: 'var(--paper-2)', borderRadius: 6, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${w}%`,
                  background: isLead ? accent : 'var(--uoft-blue-light)',
                  borderRadius: 6,
                  transition: 'width .4s cubic-bezier(.2,.8,.2,1)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Dot = ({ color = 'var(--uoft-navy)', size = 8, style }) => (
  <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, ...style }} />
);

export const SectionLabel = ({ children, style }) => (
  <div
    className="mono"
    style={{
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--ink-3)',
      ...style,
    }}
  >
    {children}
  </div>
);
