import io from 'socket.io-client';
import { PublicURL } from './config/constants';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(PublicURL + ':5001', { withCredentials: true });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default getSocket;
