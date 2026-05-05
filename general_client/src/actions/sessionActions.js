import axios from 'axios';
import { GET_SESSIONS, ADD_SESSION, ADD_COURSE, DOWNLOAD_SESSION, SESSIONS_LOADING } from './types';
import { PublicURL } from '../config/constants';

axios.defaults.withCredentials = true;
const apiBase = PublicURL + ':5001/nox/api';

function getRandomSesid() {
  // 6-char alphanumeric session code matching the OTP input on the join screen
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export const getCourses = (pid) => (dispatch) => {
  dispatch(setSessionsLoading());
  return axios
    .get(apiBase + '/sessions/FindCourse')
    .then((res) => dispatch({ type: GET_SESSIONS, payload: res.data }))
    .catch(() => dispatch({ type: GET_SESSIONS, payload: [] }));
};

export const getSessions = (pid, courseCode) => (dispatch) => {
  dispatch(setSessionsLoading());
  return axios
    .get(apiBase + '/sessions/AllSessions', { params: { courseCode } })
    .then((res) => dispatch({ type: GET_SESSIONS, payload: res.data }))
    .catch(() => dispatch({ type: GET_SESSIONS, payload: [] }));
};

export const downloadSession = (sesid) => (dispatch) =>
  axios.get(apiBase + '/sessions/Report', { params: { sesid } }).then(() =>
    dispatch({ type: DOWNLOAD_SESSION, payload: sesid })
  );

export const addCourse = (course) => (dispatch) => {
  const body = { ...course, sesid: course.sesid || getRandomSesid() };
  return axios.post(apiBase + '/sessions', body).then((res) => {
    dispatch({ type: ADD_COURSE, payload: res.data });
    return res.data;
  });
};

export const addSession = (session) => (dispatch) => {
  const body = { ...session, sesid: session.sesid || getRandomSesid() };
  return axios.post(apiBase + '/sessions', body).then((res) => {
    dispatch({ type: ADD_SESSION, payload: res.data });
    return res.data;
  });
};

export const setSessionsLoading = () => ({ type: SESSIONS_LOADING });
