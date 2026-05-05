import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import StudentLiveScreen from './StudentLiveScreen';
import StudentDesktopLive from './StudentDesktopLive';
import StudentPollScreen from './StudentPollScreen';
import { getSocket } from '../../socket';
import { pollOpen, pollUpdate, pollClose } from '../../actions/liveActions';

const cookies = new Cookies();

const useViewport = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
};

const StudentApp = ({ poll, pollOpen, pollUpdate, pollClose, history }) => {
  const w = useViewport();
  const isDesktop = w >= 768;

  // Top-level poll listener: poll state must update regardless of which student
  // sub-screen is mounted, otherwise the screen-swap into the poll view never
  // fires.
  useEffect(() => {
    const sid = cookies.get('sid');
    const sesid = cookies.get('sesid');
    if (!sid || !sesid) {
      if (history && history.push) history.push('/nox');
      else window.location = '/nox';
      return undefined;
    }
    const socket = getSocket();
    socket.emit('joinSessionRoom', { sesid, sid });
    const onOpen = (p) => pollOpen(p);
    const onUpdate = (p) => pollUpdate(p);
    const onClose = () => pollClose();
    socket.on('pollOpened', onOpen);
    socket.on('pollUpdate', onUpdate);
    socket.on('pollClosed', onClose);
    return () => {
      socket.off('pollOpened', onOpen);
      socket.off('pollUpdate', onUpdate);
      socket.off('pollClosed', onClose);
    };
  }, [pollOpen, pollUpdate, pollClose, history]);

  if (poll && poll.active && !poll.closed) {
    return <StudentPollScreen history={history} />;
  }
  return isDesktop ? <StudentDesktopLive history={history} /> : <StudentLiveScreen history={history} />;
};

const mapStateToProps = (state) => ({ poll: state.poll });

export default connect(mapStateToProps, { pollOpen, pollUpdate, pollClose })(StudentApp);
