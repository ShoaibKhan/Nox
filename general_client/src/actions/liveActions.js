import axios from 'axios';
import {
  PULSE_TICK,
  PULSE_DIST,
  QUESTIONS_SET,
  QUESTION_ADD,
  QUESTION_VOTE,
  QUESTION_ANSWER,
  POLL_OPEN,
  POLL_UPDATE,
  POLL_CLOSE,
  POLL_VOTE_LOCAL,
} from './types';
import { PublicURL } from '../config/constants';
import { getSocket } from '../socket';

const apiBase = PublicURL + ':5001/nox/api';

axios.defaults.withCredentials = true;

export const emitStudentPulse = (sesid, sid, value) => () => {
  const socket = getSocket();
  socket.emit('studentPulse', { sesid, sid, value, time: Date.now() });
};

export const emitNewQuestion = (sesid, sid, text) => (dispatch) =>
  axios
    .post(apiBase + '/records/AddRecord', { comment: text, isComment: 'true' })
    .then((res) => {
      const q = {
        id: (res.data && (res.data._id || res.data.id)) || `local-${Date.now()}`,
        text,
        votes: 0,
        mine: true,
        answered: false,
        sesid,
      };
      dispatch({ type: QUESTION_ADD, payload: q });
      return q;
    });

export const emitVoteQuestion = (sesid, sid, recordId, delta) => (dispatch, getState) => {
  const current = getState().questions.items.find((q) => q.id === recordId);
  if (current) {
    dispatch({
      type: QUESTION_VOTE,
      payload: {
        id: recordId,
        votes: Math.max(0, (current.votes || 0) + delta),
        mine: delta > 0,
      },
    });
  }
  return axios
    .post(apiBase + '/records/Vote', { recordId, delta })
    .catch(() => {
      // Roll back optimistic update on failure
      if (current) {
        dispatch({
          type: QUESTION_VOTE,
          payload: { id: recordId, votes: current.votes, mine: current.mine },
        });
      }
    });
};

export const emitMarkAnswered = (sesid, recordId) => (dispatch) => {
  dispatch({ type: QUESTION_ANSWER, payload: { id: recordId } });
  return axios
    .post(apiBase + '/records/MarkAnswered', { recordId })
    .catch(() => {});
};

export const setQuestions = (items) => ({ type: QUESTIONS_SET, payload: items });
export const addQuestion = (q) => ({ type: QUESTION_ADD, payload: q });
export const updateQuestionVote = (id, votes) => ({ type: QUESTION_VOTE, payload: { id, votes } });
export const markQuestionAnswered = (id) => ({ type: QUESTION_ANSWER, payload: { id } });

export const pulseTick = (avg) => ({ type: PULSE_TICK, payload: avg });
export const pulseDist = (dist) => ({ type: PULSE_DIST, payload: dist });

export const pollOpen = (poll) => ({ type: POLL_OPEN, payload: poll });
export const pollUpdate = (payload) => ({ type: POLL_UPDATE, payload });
export const pollClose = () => ({ type: POLL_CLOSE });
export const pollVoteLocal = (optionId) => ({ type: POLL_VOTE_LOCAL, payload: optionId });

export const startPoll = (sesid, question, type, options, durationSeconds) => (dispatch) =>
  axios
    .post(apiBase + '/sessions/StartPoll', { sesid, question, type, options, durationSeconds })
    .then((res) => {
      dispatch(pollOpen(res.data));
      return res.data;
    });

export const endPoll = (sesid, pollId) => (dispatch) =>
  axios.post(apiBase + '/sessions/EndPoll', { sesid, pollId }).then(() => dispatch(pollClose()));

export const submitPollVote = (sesid, sid, pollId, optionId) => (dispatch) => {
  dispatch(pollVoteLocal(optionId));
  return axios.post(apiBase + '/sessions/Vote', { pollId, optionId }).catch(() => {});
};

export const fetchSessionsByCourse = (pid, courseCode) => () =>
  axios.get(apiBase + '/sessions/ByCourse', { params: { courseCode } });

export const fetchSessionReport = (sesid) => () =>
  axios.get(apiBase + '/sessions/Report', { params: { sesid } });
