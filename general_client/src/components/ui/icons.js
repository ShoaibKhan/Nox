import React from 'react';

const Icon = ({ children, size = 20, stroke = 1.6, style, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    {...rest}
  >
    {children}
  </svg>
);

export const IconLogout    = (p) => <Icon {...p}><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>;
export const IconUser      = (p) => <Icon {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></Icon>;
export const IconUsers     = (p) => <Icon {...p}><circle cx="9" cy="8" r="3"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/><path d="M16 5.5a3 3 0 0 1 0 5.5"/><path d="M21 19c0-2.5-1.7-4.4-4.5-5"/></Icon>;
export const IconMessage   = (p) => <Icon {...p}><path d="M4 5h16v11H8l-4 4z"/></Icon>;
export const IconSend      = (p) => <Icon {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></Icon>;
export const IconUp        = (p) => <Icon {...p}><path d="M12 5v14"/><polyline points="6 11 12 5 18 11"/></Icon>;
export const IconCheck     = (p) => <Icon {...p}><polyline points="4 12 10 18 20 6"/></Icon>;
export const IconClose     = (p) => <Icon {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></Icon>;
export const IconPlus      = (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>;
export const IconChart     = (p) => <Icon {...p}><line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="10" width="3" height="8"/><rect x="11" y="6" width="3" height="12"/><rect x="16" y="13" width="3" height="5"/></Icon>;
export const IconPulse     = (p) => <Icon {...p}><polyline points="3 12 7 12 9 6 13 18 15 12 21 12"/></Icon>;
export const IconPoll      = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10"/><path d="M7 13h7"/><path d="M7 17h4"/></Icon>;
export const IconBook      = (p) => <Icon {...p}><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></Icon>;
export const IconDownload  = (p) => <Icon {...p}><path d="M12 4v12"/><polyline points="6 10 12 16 18 10"/><path d="M4 20h16"/></Icon>;
export const IconCalendar  = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></Icon>;
export const IconClock     = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></Icon>;
export const IconSearch    = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.5" y2="16.5"/></Icon>;
export const IconSparkle   = (p) => <Icon {...p}><path d="M12 4v6"/><path d="M12 14v6"/><path d="M4 12h6"/><path d="M14 12h6"/></Icon>;
export const IconChevron   = (p) => <Icon {...p}><polyline points="9 6 15 12 9 18"/></Icon>;
export const IconChevronDown = (p) => <Icon {...p}><polyline points="6 9 12 15 18 9"/></Icon>;
export const IconHand      = (p) => <Icon {...p}><path d="M9 11V5a1.5 1.5 0 0 1 3 0v6"/><path d="M12 11V4a1.5 1.5 0 0 1 3 0v7"/><path d="M15 11V5.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-12 0v-2.5a1.5 1.5 0 0 1 3 0V13"/></Icon>;
export const IconBolt      = (p) => <Icon {...p}><polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2"/></Icon>;
export const IconArrowR    = (p) => <Icon {...p}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></Icon>;
export const IconWifi      = (p) => <Icon {...p}><path d="M2 8.5a16 16 0 0 1 20 0"/><path d="M5 12a12 12 0 0 1 14 0"/><path d="M8.5 15.5a7 7 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></Icon>;
export const IconDot       = (p) => <Icon {...p}><circle cx="12" cy="12" r="3" fill="currentColor"/></Icon>;
export const IconStop      = (p) => <Icon {...p}><rect x="6" y="6" width="12" height="12" rx="1"/></Icon>;
export const IconCopy      = (p) => <Icon {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></Icon>;
export const IconSettings  = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>;
export const IconShare     = (p) => <Icon {...p}><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="8.6" y1="13.4" x2="15.4" y2="16.6"/><line x1="15.4" y1="7.4" x2="8.6" y2="10.6"/></Icon>;
export const IconQR        = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M20 14v3"/><path d="M14 20h3"/><path d="M17 17v4"/></Icon>;
export const IconLock      = (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Icon>;

export const NoxMark = ({ size = 44, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="29" stroke={color} strokeWidth="1.5" />
    <text
      x="32"
      y="42"
      textAnchor="middle"
      fontFamily="Newsreader, serif"
      fontSize="34"
      fontStyle="italic"
      fontWeight="500"
      fill={color}
    >
      N
    </text>
    <path d="M44 22 L48 18 L48 22 Z" fill={color} opacity="0.6" />
  </svg>
);
