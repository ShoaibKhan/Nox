import io from 'socket.io-client';
import { ApiOrigin } from './config/constants';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(ApiOrigin, { withCredentials: true });
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
