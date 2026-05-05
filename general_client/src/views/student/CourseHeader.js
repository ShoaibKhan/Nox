import React from 'react';
import { NoxTopBar, NoxLockup } from '../../components/ui/primitives';
import { IconClose } from '../../components/ui/icons';

const CourseHeader = ({ course = 'CSC209H5', meta = 'Week 5 · Live', onLeave }) => (
  <NoxTopBar
    height={56}
    left={
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span className="mono" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em' }}>{course}</span>
        <span
          className="mono"
          style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}
        >
          {meta}
        </span>
      </div>
    }
    center={<NoxLockup size={20} color="#fff" showWord={false} />}
    right={
      <button
        title="Leave"
        onClick={onLeave}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff',
          height: 32,
          padding: '0 10px',
          borderRadius: 8,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          cursor: 'pointer',
        }}
        className="mono"
      >
        <IconClose size={12} stroke={2} />
        LEAVE
      </button>
    }
  />
);

export default CourseHeader;
