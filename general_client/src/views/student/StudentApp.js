import React, { useEffect, useState } from 'react';
import StudentLiveScreen from './StudentLiveScreen';
import StudentDesktopLive from './StudentDesktopLive';
import StudentPollScreen from './StudentPollScreen';
import { connect } from 'react-redux';

const useViewport = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
};

const StudentApp = ({ poll, history }) => {
  const w = useViewport();
  const isDesktop = w >= 768;

  if (poll && poll.active) {
    return <StudentPollScreen history={history} />;
  }
  return isDesktop ? <StudentDesktopLive history={history} /> : <StudentLiveScreen history={history} />;
};

const mapStateToProps = (state) => ({ poll: state.poll });

export default connect(mapStateToProps)(StudentApp);
